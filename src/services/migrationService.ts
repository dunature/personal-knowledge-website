/**
 * 数据迁移服务
 * 负责检测本地数据并迁移到 GitHub Gist
 */

import { gistService } from './gistService';
import { cacheService, STORAGE_KEYS } from './cacheService';
import { authService } from './authService';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';

export interface LocalDataInfo {
    hasResources: boolean;
    hasQuestions: boolean;
    hasSubQuestions: boolean;
    hasAnswers: boolean;
    resourceCount: number;
    questionCount: number;
    subQuestionCount: number;
    answerCount: number;
    totalSize: number; // 估算的数据大小（字节）
}

export interface MigrationResult {
    success: boolean;
    gistId?: string;
    error?: string;
}

class MigrationService {
    /**
     * 检测本地是否有数据
     */
    async detectLocalData(): Promise<LocalDataInfo> {
        const resources = await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES) || [];
        const questions = await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS) || [];
        const subQuestions = await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS) || [];
        const answers = await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS) || [];

        // 计算数据大小
        const dataSize =
            JSON.stringify(resources).length +
            JSON.stringify(questions).length +
            JSON.stringify(subQuestions).length +
            JSON.stringify(answers).length;

        return {
            hasResources: resources.length > 0,
            hasQuestions: questions.length > 0,
            hasSubQuestions: subQuestions.length > 0,
            hasAnswers: answers.length > 0,
            resourceCount: resources.length,
            questionCount: questions.length,
            subQuestionCount: subQuestions.length,
            answerCount: answers.length,
            totalSize: dataSize,
        };
    }

    /**
     * 迁移数据到 Gist
     */
    async migrateToGist(): Promise<MigrationResult> {
        try {
            // 获取 Token
            const token = await authService.getToken();
            if (!token) {
                return {
                    success: false,
                    error: 'No authentication token found',
                };
            }

            // 获取本地数据
            const resources = await cacheService.getData<Resource[]>(STORAGE_KEYS.RESOURCES) || [];
            const questions = await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS) || [];
            const subQuestions = await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS) || [];
            const answers = await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS) || [];

            // 获取用户信息
            const user = await authService.getCurrentUser();
            const username = user?.username || 'unknown';

            // 创建 Gist 数据
            const gistData = {
                resources,
                questions,
                subQuestions,
                answers,
                metadata: {
                    version: '1.0.0',
                    lastSync: new Date().toISOString(),
                    owner: username,
                },
            };

            // 创建 Gist
            const gist = await gistService.createGist(gistData, token);

            // 保存 Gist ID
            await authService.setGistId(gist.id);

            return {
                success: true,
                gistId: gist.id,
            };
        } catch (error) {
            console.error('Migration failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 从 Gist 加载数据
     * 下载 Gist 数据，验证格式，保存到 LocalStorage
     */
    async loadFromGist(gistId: string, token?: string): Promise<MigrationResult> {
        try {
            // 获取 Gist 数据
            const gistData = await gistService.getGist(gistId, token);

            // 验证数据格式
            if (!this.validateGistData(gistData)) {
                return {
                    success: false,
                    error: 'Invalid Gist data format',
                };
            }

            // 保存到缓存
            await cacheService.saveData(STORAGE_KEYS.RESOURCES, gistData.resources);
            await cacheService.saveData(STORAGE_KEYS.QUESTIONS, gistData.questions);
            await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, gistData.subQuestions);
            await cacheService.saveData(STORAGE_KEYS.ANSWERS, gistData.answers);

            // 保存元数据
            if (gistData.metadata) {
                await cacheService.saveData(STORAGE_KEYS.METADATA, gistData.metadata);
            }

            // 保存 Gist ID
            authService.setGistId(gistId);

            // 保存最后同步时间
            await cacheService.saveData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

            return {
                success: true,
                gistId,
            };
        } catch (error) {
            console.error('Load from Gist failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 验证 Gist 数据格式
     */
    private validateGistData(data: any): boolean {
        // 检查必需的字段
        if (!data || typeof data !== 'object') {
            return false;
        }

        // 检查数组字段
        if (!Array.isArray(data.resources)) {
            console.warn('Invalid resources data');
            return false;
        }

        if (!Array.isArray(data.questions)) {
            console.warn('Invalid questions data');
            return false;
        }

        if (!Array.isArray(data.subQuestions)) {
            console.warn('Invalid subQuestions data');
            return false;
        }

        if (!Array.isArray(data.answers)) {
            console.warn('Invalid answers data');
            return false;
        }

        // 检查元数据
        if (data.metadata && typeof data.metadata !== 'object') {
            console.warn('Invalid metadata');
            return false;
        }

        return true;
    }

    /**
     * 检查是否需要迁移
     */
    async needsMigration(): Promise<boolean> {
        const gistId = await authService.getGistId();
        if (gistId) {
            return false; // 已经有 Gist ID，不需要迁移
        }

        const localData = await this.detectLocalData();
        return localData.hasResources || localData.hasQuestions;
    }
}

export const migrationService = new MigrationService();
