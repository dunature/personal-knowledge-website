/**
 * 数据对比器
 * 负责比较本地和云端数据，生成对比报告
 */

import type { GistData, GistMetadataExtended } from '@/types/gist';
import type { DataStatistics, DataComparisonResult } from '@/types/sync';

/**
 * 数据对比器类
 */
class DataComparator {
    /**
     * 生成数据统计信息
     * @param data Gist 数据
     * @returns 数据统计
     */
    generateStatistics(data: GistData): DataStatistics {
        return {
            resourceCount: data.resources?.length || 0,
            questionCount: data.questions?.length || 0,
            subQuestionCount: data.subQuestions?.length || 0,
            answerCount: data.answers?.length || 0,
            lastModified: data.metadata?.lastSync || new Date().toISOString(),
        };
    }

    /**
     * 从 Gist 元数据生成统计信息
     * @param metadata Gist 元数据
     * @returns 数据统计
     */
    generateStatisticsFromMetadata(metadata: GistMetadataExtended): DataStatistics {
        // 如果元数据中已经包含统计信息，直接使用
        if (metadata.statistics) {
            return metadata.statistics;
        }

        // 否则返回默认值（需要下载完整数据才能获取准确统计）
        return {
            resourceCount: 0,
            questionCount: 0,
            subQuestionCount: 0,
            answerCount: 0,
            lastModified: metadata.updated_at,
        };
    }

    /**
     * 比较本地和云端数据
     * @param localData 本地数据
     * @param remoteStats 云端数据统计
     * @returns 对比结果
     */
    compare(localData: GistData, remoteStats: DataStatistics): DataComparisonResult {
        const localStats = this.generateStatistics(localData);

        // 计算差异
        const differences = {
            resources: remoteStats.resourceCount - localStats.resourceCount,
            questions: remoteStats.questionCount - localStats.questionCount,
            subQuestions: remoteStats.subQuestionCount - localStats.subQuestionCount,
            answers: remoteStats.answerCount - localStats.answerCount,
        };

        // 判断是否有变化
        const hasChanges = Object.values(differences).some((diff) => diff !== 0);

        // 生成建议
        const recommendation = this.generateRecommendation(
            localStats,
            remoteStats,
            differences
        );

        return {
            hasChanges,
            local: localStats,
            remote: remoteStats,
            differences,
            recommendation,
        };
    }

    /**
     * 生成同步建议
     * @param _localStats 本地统计
     * @param _remoteStats 云端统计
     * @param differences 差异
     * @returns 同步建议
     */
    private generateRecommendation(
        _localStats: DataStatistics,
        _remoteStats: DataStatistics,
        differences: {
            resources: number;
            questions: number;
            subQuestions: number;
            answers: number;
        }
    ): 'pull' | 'push' | 'merge' | 'skip' {
        // 计算总差异数（绝对值）
        const totalDiff = Object.values(differences).reduce(
            (sum, diff) => sum + Math.abs(diff),
            0
        );

        // 没有差异，跳过
        if (totalDiff === 0) {
            return 'skip';
        }

        // 计算云端比本地多的项数
        const remoteMoreCount = Object.values(differences).filter((diff) => diff > 0).length;
        // 计算本地比云端多的项数
        const localMoreCount = Object.values(differences).filter((diff) => diff < 0).length;

        // 如果云端所有类型都比本地多或相等，建议 pull
        if (remoteMoreCount > 0 && localMoreCount === 0) {
            return 'pull';
        }

        // 如果本地所有类型都比云端多或相等，建议 push
        if (localMoreCount > 0 && remoteMoreCount === 0) {
            return 'push';
        }

        // 如果双方都有更多的项，建议合并
        if (remoteMoreCount > 0 && localMoreCount > 0) {
            return 'merge';
        }

        // 默认建议 pull（优先使用云端数据）
        return 'pull';
    }

    /**
     * 判断是否需要同步
     * @param localSyncTime 本地同步时间
     * @param remoteSyncTime 云端同步时间
     * @param comparison 对比结果
     * @returns 是否需要同步
     */
    shouldSync(
        localSyncTime: string | null,
        remoteSyncTime: string,
        comparison: DataComparisonResult
    ): boolean {
        // 如果有数据差异，需要同步
        if (comparison.hasChanges) {
            return true;
        }

        // 如果从未同步过，需要同步
        if (!localSyncTime) {
            return true;
        }

        // 比较时间戳
        const localTime = new Date(localSyncTime).getTime();
        const remoteTime = new Date(remoteSyncTime).getTime();

        // 如果云端更新时间晚于本地同步时间，需要同步
        return remoteTime > localTime;
    }

    /**
     * 格式化差异描述
     * @param differences 差异对象
     * @returns 差异描述数组
     */
    formatDifferences(differences: {
        resources: number;
        questions: number;
        subQuestions: number;
        answers: number;
    }): string[] {
        const descriptions: string[] = [];

        if (differences.resources !== 0) {
            const action = differences.resources > 0 ? '多' : '少';
            descriptions.push(`资源${action} ${Math.abs(differences.resources)} 个`);
        }

        if (differences.questions !== 0) {
            const action = differences.questions > 0 ? '多' : '少';
            descriptions.push(`大问题${action} ${Math.abs(differences.questions)} 个`);
        }

        if (differences.subQuestions !== 0) {
            const action = differences.subQuestions > 0 ? '多' : '少';
            descriptions.push(`子问题${action} ${Math.abs(differences.subQuestions)} 个`);
        }

        if (differences.answers !== 0) {
            const action = differences.answers > 0 ? '多' : '少';
            descriptions.push(`答案${action} ${Math.abs(differences.answers)} 个`);
        }

        return descriptions;
    }

    /**
     * 获取对比摘要
     * @param comparison 对比结果
     * @returns 摘要文本
     */
    getComparisonSummary(comparison: DataComparisonResult): string {
        if (!comparison.hasChanges) {
            return '本地和云端数据一致';
        }

        const diffs = this.formatDifferences(comparison.differences);

        if (diffs.length === 0) {
            return '数据有更新';
        }

        return `云端比本地${diffs.join('，')}`;
    }

    /**
     * 计算数据完整性得分（0-100）
     * @param stats 数据统计
     * @returns 完整性得分
     */
    calculateCompletenessScore(stats: DataStatistics): number {
        let score = 0;

        // 有资源 +25
        if (stats.resourceCount > 0) score += 25;
        // 有问题 +25
        if (stats.questionCount > 0) score += 25;
        // 有子问题 +25
        if (stats.subQuestionCount > 0) score += 25;
        // 有答案 +25
        if (stats.answerCount > 0) score += 25;

        return score;
    }

    /**
     * 判断数据是否为空
     * @param stats 数据统计
     * @returns 是否为空
     */
    isEmpty(stats: DataStatistics): boolean {
        return (
            stats.resourceCount === 0 &&
            stats.questionCount === 0 &&
            stats.subQuestionCount === 0 &&
            stats.answerCount === 0
        );
    }

    /**
     * 获取推荐操作的描述
     * @param recommendation 推荐操作
     * @returns 描述文本
     */
    getRecommendationDescription(
        recommendation: 'pull' | 'push' | 'merge' | 'skip'
    ): string {
        switch (recommendation) {
            case 'pull':
                return '建议从云端拉取最新数据';
            case 'push':
                return '建议将本地数据推送到云端';
            case 'merge':
                return '建议合并本地和云端数据';
            case 'skip':
                return '数据已同步，无需操作';
            default:
                return '未知操作';
        }
    }

    /**
     * 快速比较本地和云端数据统计信息是否一致
     * @param localStats 本地统计
     * @param remoteStats 云端统计
     * @returns 是否完全一致
     */
    quickCheck(localStats: DataStatistics, remoteStats: DataStatistics): boolean {
        return (
            localStats.resourceCount === remoteStats.resourceCount &&
            localStats.questionCount === remoteStats.questionCount &&
            localStats.subQuestionCount === remoteStats.subQuestionCount &&
            localStats.answerCount === remoteStats.answerCount
        );
    }

    /**
     * 深度比较本地和云端数据是否完全一致（预留接口）
     * @param localData 本地数据
     * @param remoteData 云端数据
     * @returns 是否完全一致
     */
    isIdentical(localData: GistData, remoteData: GistData): boolean {
        // 先进行快速统计检查
        const localStats = this.generateStatistics(localData);
        const remoteStats = this.generateStatistics(remoteData);

        if (!this.quickCheck(localStats, remoteStats)) {
            return false;
        }

        // 统计信息一致，可以认为数据一致
        // 未来可以添加更深度的内容哈希比较
        return true;
    }
}

// 导出单例
export const dataComparator = new DataComparator();

