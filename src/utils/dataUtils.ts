/**
 * 数据工具函数
 * 提供数据统计和处理相关的工具方法
 */

import type { GistData } from '@/types/gist';
import type { DataStats } from '@/types/sync';

/**
 * 获取数据统计信息
 * @param data Gist 数据
 * @returns 数据统计
 */
export function getDataStats(data: GistData): DataStats {
    return {
        resources: data.resources.length,
        questions: data.questions.length,
        subQuestions: data.subQuestions.length,
        answers: data.answers.length,
        lastUpdated: data.metadata.lastSync || new Date().toISOString(),
    };
}

/**
 * 格式化日期为相对时间
 * @param dateStr 日期字符串
 * @returns 格式化后的相对时间
 */
export function formatRelativeTime(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins} 分钟前`;
        if (diffHours < 24) return `${diffHours} 小时前`;
        if (diffDays < 7) return `${diffDays} 天前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;

        return `${Math.floor(diffDays / 365)} 年前`;
    } catch {
        return dateStr;
    }
}

/**
 * 格式化日期为本地日期字符串
 * @param dateStr 日期字符串
 * @returns 格式化后的日期
 */
export function formatLocalDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

/**
 * 计算数据总数
 * @param stats 数据统计
 * @returns 总数
 */
export function getTotalCount(stats: DataStats): number {
    return stats.resources + stats.questions + stats.subQuestions + stats.answers;
}

/**
 * 比较两个数据统计
 * @param local 本地数据统计
 * @param remote 云端数据统计
 * @returns 比较结果描述
 */
export function compareDataStats(local: DataStats, remote: DataStats): {
    hasMoreLocal: boolean;
    hasMoreRemote: boolean;
    isEqual: boolean;
    difference: {
        resources: number;
        questions: number;
        subQuestions: number;
        answers: number;
    };
} {
    const localTotal = getTotalCount(local);
    const remoteTotal = getTotalCount(remote);

    return {
        hasMoreLocal: localTotal > remoteTotal,
        hasMoreRemote: remoteTotal > localTotal,
        isEqual: localTotal === remoteTotal,
        difference: {
            resources: local.resources - remote.resources,
            questions: local.questions - remote.questions,
            subQuestions: local.subQuestions - remote.subQuestions,
            answers: local.answers - remote.answers,
        },
    };
}

/**
 * 检查数据是否为空
 * @param data Gist 数据
 * @returns 是否为空
 */
export function isDataEmpty(data: GistData): boolean {
    return (
        data.resources.length === 0 &&
        data.questions.length === 0 &&
        data.subQuestions.length === 0 &&
        data.answers.length === 0
    );
}

/**
 * 获取数据摘要
 * @param data Gist 数据
 * @returns 数据摘要字符串
 */
export function getDataSummary(data: GistData): string {
    const stats = getDataStats(data);
    const parts: string[] = [];

    if (stats.resources > 0) parts.push(`${stats.resources} 个资源`);
    if (stats.questions > 0) parts.push(`${stats.questions} 个问题`);
    if (stats.subQuestions > 0) parts.push(`${stats.subQuestions} 个子问题`);
    if (stats.answers > 0) parts.push(`${stats.answers} 个回答`);

    if (parts.length === 0) return '暂无数据';

    return parts.join('、');
}
