/**
 * 冲突解决器
 * 负责检测和解决本地与云端数据的冲突
 */

import type { GistData } from '@/types/gist';
import type { ConflictInfo, PendingChange, ConflictStrategy } from '@/types/sync';

/**
 * 冲突解决器类
 */
class ConflictResolver {
    /**
     * 检测冲突
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @param pendingChanges 待同步变更
     * @returns 冲突信息
     */
    detectConflict(
        localData: GistData,
        remoteData: GistData,
        pendingChanges: PendingChange[]
    ): ConflictInfo {
        const hasLocalChanges = pendingChanges.length > 0;
        const hasRemoteChanges = this.hasDataChanged(localData, remoteData);

        // 如果本地和云端都有变更，则存在冲突
        const hasConflict = hasLocalChanges && hasRemoteChanges;

        // 识别具体的冲突项
        const conflictItems = hasConflict
            ? this.identifyConflictItems(localData, remoteData, pendingChanges)
            : [];

        return {
            hasConflict,
            localChanges: pendingChanges.length,
            remoteChanges: hasRemoteChanges,
            conflictItems,
        };
    }

    /**
     * 解决冲突
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @param strategy 冲突解决策略
     * @returns 解决后的数据
     */
    async resolve(
        localData: GistData,
        remoteData: GistData,
        strategy: ConflictStrategy
    ): Promise<GistData> {
        switch (strategy) {
            case 'remote':
                // 使用云端数据
                return this.useRemote(remoteData);

            case 'local':
                // 使用本地数据
                return this.useLocal(localData);

            case 'merge':
                // 智能合并
                return this.smartMerge(localData, remoteData);

            default:
                throw new Error(`未知的冲突策略: ${strategy}`);
        }
    }

    /**
     * 智能合并数据
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @returns 合并后的数据
     */
    smartMerge(localData: GistData, remoteData: GistData): GistData {
        return {
            resources: this.mergeByIdAndTime(localData.resources, remoteData.resources),
            questions: this.mergeByIdAndTime(localData.questions, remoteData.questions),
            subQuestions: this.mergeByIdAndTime(
                localData.subQuestions,
                remoteData.subQuestions
            ),
            answers: this.mergeByIdAndTime(localData.answers, remoteData.answers),
            metadata: {
                ...remoteData.metadata,
                lastSync: new Date().toISOString(),
            },
        };
    }

    /**
     * 使用云端数据
     * @param remoteData 云端数据
     * @returns 云端数据
     */
    private useRemote(remoteData: GistData): GistData {
        return {
            ...remoteData,
            metadata: {
                ...remoteData.metadata,
                lastSync: new Date().toISOString(),
            },
        };
    }

    /**
     * 使用本地数据
     * @param localData 本地数据
     * @returns 本地数据
     */
    private useLocal(localData: GistData): GistData {
        return {
            ...localData,
            metadata: {
                ...localData.metadata,
                lastSync: new Date().toISOString(),
            },
        };
    }

    /**
     * 基于 ID 和时间戳合并数组
     * @param local 本地数组
     * @param remote 云端数组
     * @returns 合并后的数组
     */
    private mergeByIdAndTime<T extends { id: string; updatedAt?: string }>(
        local: T[],
        remote: T[]
    ): T[] {
        const map = new Map<string, T>();

        // 添加所有项目
        [...local, ...remote].forEach((item) => {
            const existing = map.get(item.id);

            if (!existing) {
                // 第一次出现，直接添加
                map.set(item.id, item);
            } else if (item.updatedAt && existing.updatedAt) {
                // 比较时间戳，保留最新的
                if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
                    map.set(item.id, item);
                }
            } else if (item.updatedAt && !existing.updatedAt) {
                // 如果当前项有时间戳而已存在项没有，使用当前项
                map.set(item.id, item);
            }
            // 如果都没有时间戳，保留第一个（已存在的）
        });

        return Array.from(map.values());
    }

    /**
     * 检查数据是否有变化
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @returns 是否有变化
     */
    private hasDataChanged(localData: GistData, remoteData: GistData): boolean {
        // 比较数据数量
        const localCounts = {
            resources: localData.resources?.length || 0,
            questions: localData.questions?.length || 0,
            subQuestions: localData.subQuestions?.length || 0,
            answers: localData.answers?.length || 0,
        };

        const remoteCounts = {
            resources: remoteData.resources?.length || 0,
            questions: remoteData.questions?.length || 0,
            subQuestions: remoteData.subQuestions?.length || 0,
            answers: remoteData.answers?.length || 0,
        };

        // 如果数量不同，说明有变化
        if (
            localCounts.resources !== remoteCounts.resources ||
            localCounts.questions !== remoteCounts.questions ||
            localCounts.subQuestions !== remoteCounts.subQuestions ||
            localCounts.answers !== remoteCounts.answers
        ) {
            return true;
        }

        // 比较最后同步时间
        const localSyncTime = localData.metadata?.lastSync;
        const remoteSyncTime = remoteData.metadata?.lastSync;

        if (localSyncTime && remoteSyncTime) {
            return new Date(remoteSyncTime) > new Date(localSyncTime);
        }

        return false;
    }

    /**
     * 识别冲突项
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @param pendingChanges 待同步变更
     * @returns 冲突项列表
     */
    private identifyConflictItems(
        localData: GistData,
        remoteData: GistData,
        pendingChanges: PendingChange[]
    ): Array<{
        type: 'resource' | 'question' | 'subQuestion' | 'answer';
        id: string;
        localVersion?: any;
        remoteVersion?: any;
    }> {
        const conflicts: Array<{
            type: 'resource' | 'question' | 'subQuestion' | 'answer';
            id: string;
            localVersion?: any;
            remoteVersion?: any;
        }> = [];

        // 检查每个待同步变更是否与云端数据冲突
        pendingChanges.forEach((change) => {
            let remoteItem: any;
            let localItem: any;

            switch (change.entity) {
                case 'resource':
                    remoteItem = remoteData.resources?.find((r) => r.id === change.id);
                    localItem = localData.resources?.find((r) => r.id === change.id);
                    break;
                case 'question':
                    remoteItem = remoteData.questions?.find((q) => q.id === change.id);
                    localItem = localData.questions?.find((q) => q.id === change.id);
                    break;
                case 'subQuestion':
                    remoteItem = remoteData.subQuestions?.find((sq) => sq.id === change.id);
                    localItem = localData.subQuestions?.find((sq) => sq.id === change.id);
                    break;
                case 'answer':
                    remoteItem = remoteData.answers?.find((a) => a.id === change.id);
                    localItem = localData.answers?.find((a) => a.id === change.id);
                    break;
            }

            // 如果云端也有这个项目，且与本地不同，则存在冲突
            if (remoteItem && localItem && this.itemsAreDifferent(localItem, remoteItem)) {
                conflicts.push({
                    type: change.entity,
                    id: change.id,
                    localVersion: localItem,
                    remoteVersion: remoteItem,
                });
            }
        });

        return conflicts;
    }

    /**
     * 比较两个项目是否不同
     * @param item1 项目1
     * @param item2 项目2
     * @returns 是否不同
     */
    private itemsAreDifferent(item1: any, item2: any): boolean {
        // 简单比较：如果有 updatedAt 字段，比较时间戳
        if (item1.updatedAt && item2.updatedAt) {
            return item1.updatedAt !== item2.updatedAt;
        }

        // 否则进行深度比较（简化版）
        return JSON.stringify(item1) !== JSON.stringify(item2);
    }

    /**
     * 获取冲突描述
     * @param conflictInfo 冲突信息
     * @returns 描述文本
     */
    getConflictDescription(conflictInfo: ConflictInfo): string {
        if (!conflictInfo.hasConflict) {
            return '无冲突';
        }

        const parts: string[] = [];

        if (conflictInfo.localChanges > 0) {
            parts.push(`本地有 ${conflictInfo.localChanges} 个待同步变更`);
        }

        if (conflictInfo.remoteChanges) {
            parts.push('云端有新的更新');
        }

        if (conflictInfo.conflictItems.length > 0) {
            parts.push(`发现 ${conflictInfo.conflictItems.length} 个冲突项`);
        }

        return parts.join('，');
    }

    /**
     * 获取策略描述
     * @param strategy 策略
     * @returns 描述文本
     */
    getStrategyDescription(strategy: ConflictStrategy): string {
        switch (strategy) {
            case 'remote':
                return '使用云端数据（本地变更将被丢弃）';
            case 'local':
                return '使用本地数据（云端变更将被覆盖）';
            case 'merge':
                return '智能合并（保留最新的变更）';
            default:
                return '未知策略';
        }
    }

    /**
     * 获取推荐策略
     * @param conflictInfo 冲突信息
     * @returns 推荐策略
     */
    getRecommendedStrategy(conflictInfo: ConflictInfo): ConflictStrategy {
        // 如果没有冲突，返回 remote（默认）
        if (!conflictInfo.hasConflict) {
            return 'remote';
        }

        // 如果只有本地变更，推荐 local
        if (conflictInfo.localChanges > 0 && !conflictInfo.remoteChanges) {
            return 'local';
        }

        // 如果只有云端变更，推荐 remote
        if (!conflictInfo.localChanges && conflictInfo.remoteChanges) {
            return 'remote';
        }

        // 如果双方都有变更，推荐 merge
        return 'merge';
    }
}

// 导出单例
export const conflictResolver = new ConflictResolver();
