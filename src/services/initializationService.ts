/**
 * 初始化服务
 * 管理用户首次登录或配置 Token 后的数据初始化流程
 */

import { authService } from './authService';
import { syncService } from './syncService';
import { gistService } from './gistService';
import { cacheService, STORAGE_KEYS } from './cacheService';
import type { InitializationResult } from '@/types/auth';
import type { GistData } from '@/types/gist';

/**
 * 冲突解决策略
 */
export type ConflictStrategy = 'use-remote' | 'use-local' | 'merge';

/**
 * 初始化错误类型
 */
export const InitializationErrorType = {
    TOKEN_INVALID: 'TOKEN_INVALID',
    NETWORK_ERROR: 'NETWORK_ERROR',
    GIST_NOT_FOUND: 'GIST_NOT_FOUND',
    GIST_PRIVATE: 'GIST_PRIVATE',
    DATA_INVALID: 'DATA_INVALID',
    SYNC_FAILED: 'SYNC_FAILED',
    CREATE_FAILED: 'CREATE_FAILED',
    DATA_CONFLICT: 'DATA_CONFLICT',
} as const;

export type InitializationErrorType = typeof InitializationErrorType[keyof typeof InitializationErrorType];

/**
 * 初始化错误类
 */
export class InitializationError extends Error {
    type: InitializationErrorType;
    recoverable: boolean;

    constructor(
        type: InitializationErrorType,
        message: string,
        recoverable: boolean = true
    ) {
        super(message);
        this.type = type;
        this.recoverable = recoverable;
        this.name = 'InitializationError';
        Object.setPrototypeOf(this, InitializationError.prototype);
    }
}

/**
 * 初始化服务类
 */
class InitializationService {
    /**
     * 检测并同步数据
     * @param token GitHub Token
     * @returns 初始化结果
     */
    async detectAndSync(token: string): Promise<InitializationResult> {
        try {
            // 1. 检测用户是否已有 Gist
            console.log('检测用户 Gist...');
            const detectResult = await authService.detectUserGist();

            if (detectResult.found && detectResult.gistId) {
                // 2. 找到 Gist，保存 Gist ID
                console.log('找到现有 Gist:', detectResult.gistId);
                authService.setGistId(detectResult.gistId);

                // 3. 检查本地是否有数据
                const hasLocalData = await this.hasLocalData();

                if (hasLocalData) {
                    // 有本地数据，需要处理冲突
                    return {
                        success: false,
                        action: 'conflict',
                        gistId: detectResult.gistId,
                        error: 'DATA_CONFLICT',
                    };
                }

                // 4. 没有本地数据，直接同步
                console.log('从云端同步数据...');
                const syncResult = await syncService.performInitialSync(detectResult.gistId);

                if (syncResult.success) {
                    return {
                        success: true,
                        action: 'synced',
                        gistId: detectResult.gistId,
                    };
                } else {
                    throw new InitializationError(
                        InitializationErrorType.SYNC_FAILED,
                        syncResult.error || '同步失败'
                    );
                }
            } else {
                // 5. 没有找到 Gist，创建新的
                console.log('未找到现有 Gist，创建新的...');
                const gistId = await this.createNewGist(token);

                return {
                    success: true,
                    action: 'created',
                    gistId,
                };
            }
        } catch (error) {
            console.error('初始化失败:', error);

            if (error instanceof InitializationError) {
                return {
                    success: false,
                    action: 'skipped',
                    error: error.message,
                };
            }

            return {
                success: false,
                action: 'skipped',
                error: error instanceof Error ? error.message : '初始化失败',
            };
        }
    }

    /**
     * 处理数据冲突
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @param strategy 冲突解决策略
     * @returns 处理后的数据
     */
    async handleDataConflict(
        localData: GistData,
        remoteData: GistData,
        strategy: ConflictStrategy
    ): Promise<GistData> {
        try {
            switch (strategy) {
                case 'use-remote':
                    // 使用云端数据
                    console.log('使用云端数据覆盖本地');
                    return remoteData;

                case 'use-local':
                    // 使用本地数据
                    console.log('使用本地数据覆盖云端');
                    return localData;

                case 'merge':
                    // 合并数据
                    console.log('合并本地和云端数据');
                    return syncService.mergeLocalAndRemoteData(localData, remoteData);

                default:
                    throw new Error(`未知的冲突策略: ${strategy}`);
            }
        } catch (error) {
            console.error('处理数据冲突失败:', error);
            throw new InitializationError(
                InitializationErrorType.DATA_CONFLICT,
                '处理数据冲突失败'
            );
        }
    }

    /**
     * 创建新的 Gist
     * @param token GitHub Token
     * @param initialData 初始数据（可选）
     * @returns Gist ID
     */
    async createNewGist(token: string, initialData?: GistData): Promise<string> {
        try {
            // 如果没有提供初始数据，检查本地是否有数据
            let dataToUpload = initialData;

            if (!dataToUpload) {
                const hasLocalData = await this.hasLocalData();

                if (hasLocalData) {
                    // 使用本地数据
                    dataToUpload = await this.getLocalData();
                } else {
                    // 创建空数据
                    const user = await authService.getCurrentUser();
                    dataToUpload = {
                        resources: [],
                        questions: [],
                        subQuestions: [],
                        answers: [],
                        metadata: {
                            version: '1.0.0',
                            lastSync: new Date().toISOString(),
                            owner: user?.username || 'unknown',
                        },
                    };
                }
            }

            // 创建 Gist
            const result = await gistService.createGist(dataToUpload, token);

            // 保存 Gist ID
            authService.setGistId(result.id);

            // 保存同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            return result.id;
        } catch (error) {
            console.error('创建 Gist 失败:', error);
            throw new InitializationError(
                InitializationErrorType.CREATE_FAILED,
                '创建 Gist 失败'
            );
        }
    }

    /**
     * 检查本地是否有数据
     * @returns 是否有本地数据
     */
    private async hasLocalData(): Promise<boolean> {
        const resources = await cacheService.getData(STORAGE_KEYS.RESOURCES);
        const questions = await cacheService.getData(STORAGE_KEYS.QUESTIONS);

        return (
            (Array.isArray(resources) && resources.length > 0) ||
            (Array.isArray(questions) && questions.length > 0)
        );
    }

    /**
     * 获取本地数据
     * @returns 本地数据
     */
    private async getLocalData(): Promise<GistData> {
        const resources = ((await cacheService.getData(STORAGE_KEYS.RESOURCES)) || []) as any[];
        const questions = ((await cacheService.getData(STORAGE_KEYS.QUESTIONS)) || []) as any[];
        const subQuestions = ((await cacheService.getData(STORAGE_KEYS.SUB_QUESTIONS)) || []) as any[];
        const answers = ((await cacheService.getData(STORAGE_KEYS.ANSWERS)) || []) as any[];
        const metadata = ((await cacheService.getData(STORAGE_KEYS.METADATA)) || {
            version: '1.0.0',
            lastSync: new Date().toISOString(),
            owner: 'unknown',
        }) as any;

        return {
            resources,
            questions,
            subQuestions,
            answers,
            metadata,
        };
    }

    /**
     * 应用冲突解决策略并同步
     * @param strategy 冲突解决策略
     * @returns 初始化结果
     */
    async resolveConflictAndSync(strategy: ConflictStrategy): Promise<InitializationResult> {
        try {
            const gistId = authService.getGistId();
            if (!gistId) {
                throw new Error('Gist ID 不可用');
            }

            const token = await authService.getToken();
            if (!token) {
                throw new Error('Token 不可用');
            }

            // 获取本地和云端数据
            const localData = await this.getLocalData();
            const remoteData = await gistService.getGist(gistId, token);

            // 处理冲突
            const resolvedData = await this.handleDataConflict(localData, remoteData, strategy);

            // 保存到本地
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, resolvedData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, resolvedData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, resolvedData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, resolvedData.answers);
            await cacheService.saveData(STORAGE_KEYS.METADATA, resolvedData.metadata);

            // 上传到 Gist
            await gistService.updateGist(gistId, resolvedData, token);

            // 保存同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            return {
                success: true,
                action: 'synced',
                gistId,
            };
        } catch (error) {
            console.error('解决冲突并同步失败:', error);
            return {
                success: false,
                action: 'skipped',
                error: error instanceof Error ? error.message : '解决冲突失败',
            };
        }
    }
}

// 导出单例
export const initializationService = new InitializationService();
