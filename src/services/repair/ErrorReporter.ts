/**
 * Error Reporter
 * 错误报告生成器 - 生成和导出错误报告
 */

import type {
    DetectionResult,
    ErrorSummary,
    ReportMetadata,
    ItemError,
} from '@/types/dataRepair';

/**
 * ErrorReporter 类
 * 负责生成和导出错误报告
 */
export class ErrorReporter {
    /**
     * 生成错误摘要
     */
    generateSummary(result: DetectionResult): ErrorSummary {
        return result.summary;
    }

    /**
     * 导出 JSON 格式报告
     */
    exportJSON(result: DetectionResult, metadata: ReportMetadata): string {
        const report = {
            metadata: {
                gistId: metadata.gistId,
                timestamp: metadata.timestamp,
                version: metadata.version,
            },
            summary: result.summary,
            errors: result.errorsByType,
            totalErrors: result.totalErrors,
            valid: result.valid,
        };

        return JSON.stringify(report, null, 2);
    }

    /**
     * 导出文本格式报告
     */
    exportText(result: DetectionResult, metadata: ReportMetadata): string {
        const lines: string[] = [];

        // 标题
        lines.push('='.repeat(60));
        lines.push('数据验证错误报告');
        lines.push('='.repeat(60));
        lines.push('');

        // 元数据
        lines.push('报告信息:');
        lines.push(`  Gist ID: ${metadata.gistId}`);
        lines.push(`  生成时间: ${metadata.timestamp}`);
        lines.push(`  版本: ${metadata.version}`);
        lines.push('');

        // 摘要
        lines.push('错误摘要:');
        lines.push(`  总错误数: ${result.summary.totalErrors}`);
        lines.push(`  严重错误: ${result.summary.criticalErrors}`);
        lines.push(`  可自动修复: ${result.summary.autoRepairableErrors}`);
        lines.push('');

        // 按数据类型分类
        lines.push('按数据类型分类:');
        for (const [dataType, count] of Object.entries(
            result.summary.errorsByType,
        )) {
            if (count > 0) {
                lines.push(`  ${dataType}: ${count} 个错误`);
            }
        }
        lines.push('');

        // 按错误类型分类
        lines.push('按错误类型分类:');
        for (const [errorType, count] of Object.entries(
            result.summary.errorsByCategory,
        )) {
            if (count > 0) {
                lines.push(`  ${errorType}: ${count} 个错误`);
            }
        }
        lines.push('');

        // 详细错误列表
        lines.push('详细错误列表:');
        lines.push('-'.repeat(60));

        for (const [dataType, errors] of Object.entries(result.errorsByType)) {
            if (errors.length > 0) {
                lines.push('');
                lines.push(`${dataType.toUpperCase()}:`);
                errors.forEach((error, index) => {
                    lines.push(`  ${index + 1}. ${error.message}`);
                    lines.push(`     字段: ${error.field}`);
                    lines.push(`     错误类型: ${error.errorType}`);
                    lines.push(`     期望格式: ${error.expectedFormat}`);
                    if (error.itemId) {
                        lines.push(`     项目 ID: ${error.itemId}`);
                    }
                    lines.push(`     项目索引: ${error.itemIndex}`);
                });
            }
        }

        lines.push('');
        lines.push('='.repeat(60));
        lines.push('报告结束');
        lines.push('='.repeat(60));

        return lines.join('\n');
    }

    /**
     * 格式化单个错误为可读文本
     */
    formatError(error: ItemError): string {
        return `${error.message} (字段: ${error.field}, 类型: ${error.errorType})`;
    }

    /**
     * 生成错误统计信息
     */
    generateStatistics(result: DetectionResult): {
        totalErrors: number;
        errorsByType: Record<string, number>;
        errorsByCategory: Record<string, number>;
        criticalErrors: number;
        autoRepairableErrors: number;
    } {
        return {
            totalErrors: result.summary.totalErrors,
            errorsByType: result.summary.errorsByType,
            errorsByCategory: result.summary.errorsByCategory,
            criticalErrors: result.summary.criticalErrors,
            autoRepairableErrors: result.summary.autoRepairableErrors,
        };
    }

    /**
     * 生成修复建议
     */
    generateRecommendations(result: DetectionResult): string[] {
        const recommendations: string[] = [];

        if (result.summary.autoRepairableErrors > 0) {
            recommendations.push(
                `有 ${result.summary.autoRepairableErrors} 个错误可以自动修复。建议使用自动修复功能。`,
            );
        }

        if (result.summary.criticalErrors > 0) {
            recommendations.push(
                `发现 ${result.summary.criticalErrors} 个严重错误，可能导致数据不可用。请优先处理这些错误。`,
            );
        }

        const manualRepairCount =
            result.summary.totalErrors - result.summary.autoRepairableErrors;
        if (manualRepairCount > 0) {
            recommendations.push(
                `有 ${manualRepairCount} 个错误需要手动修复。请检查详细错误列表。`,
            );
        }

        if (result.summary.totalErrors === 0) {
            recommendations.push('数据验证通过，未发现错误。');
        }

        return recommendations;
    }
}

// 导出单例实例
export const errorReporter = new ErrorReporter();
