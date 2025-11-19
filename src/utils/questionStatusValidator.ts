/**
 * 问题状态验证工具类
 * 用于验证大问题状态更改的前置条件
 */

import type { QuestionStatus, SubQuestion } from '@/types/question';

/**
 * 验证错误类型
 */
export type ValidationErrorType = 'unsolvedSubQuestions' | 'emptySummary';

/**
 * 验证错误详情
 */
export interface ValidationError {
    type: ValidationErrorType;
    message: string;
    details?: {
        unsolvedSubQuestions?: Array<{
            id: string;
            title: string;
            status: QuestionStatus;
        }>;
    };
}

/**
 * 验证结果
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * 问题状态验证器
 */
export class QuestionStatusValidator {
    /**
     * 验证状态更改是否允许
     * @param newStatus 新状态
     * @param currentStatus 当前状态
     * @param subQuestions 小问题列表
     * @param summary 最终总结
     * @returns 验证结果
     */
    static validateStatusChange(
        newStatus: QuestionStatus,
        currentStatus: QuestionStatus,
        subQuestions: SubQuestion[],
        summary: string
    ): ValidationResult {
        // 如果不是更改为"已解决"状态，直接允许
        if (newStatus !== 'solved') {
            return {
                isValid: true,
                errors: [],
            };
        }

        // 如果已经是"已解决"状态，允许（保持不变）
        if (currentStatus === 'solved') {
            return {
                isValid: true,
                errors: [],
            };
        }

        // 获取所有验证错误
        const errors = this.getValidationErrors(subQuestions, summary);

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * 检查所有小问题是否已解决
     * @param subQuestions 小问题列表
     * @returns 检查结果
     */
    static checkSubQuestionsStatus(subQuestions: SubQuestion[]): {
        allSolved: boolean;
        unsolvedQuestions: SubQuestion[];
    } {
        const unsolvedQuestions = subQuestions.filter(
            (sq) => sq.status !== 'solved'
        );

        return {
            allSolved: unsolvedQuestions.length === 0,
            unsolvedQuestions,
        };
    }

    /**
     * 检查最终总结是否已填写
     * @param summary 最终总结内容
     * @returns 是否已填写
     */
    static checkSummaryContent(summary: string): boolean {
        // 去除空白字符后检查是否为空
        return summary.trim().length > 0;
    }

    /**
     * 获取所有验证错误
     * @param subQuestions 小问题列表
     * @param summary 最终总结
     * @returns 错误列表
     */
    static getValidationErrors(
        subQuestions: SubQuestion[],
        summary: string
    ): ValidationError[] {
        const errors: ValidationError[] = [];

        // 检查小问题状态
        const { allSolved, unsolvedQuestions } =
            this.checkSubQuestionsStatus(subQuestions);

        if (!allSolved) {
            errors.push({
                type: 'unsolvedSubQuestions',
                message: `存在未解决的小问题 (${unsolvedQuestions.length}/${subQuestions.length})`,
                details: {
                    unsolvedSubQuestions: unsolvedQuestions.map((sq) => ({
                        id: sq.id,
                        title: sq.title,
                        status: sq.status,
                    })),
                },
            });
        }

        // 检查最终总结
        if (!this.checkSummaryContent(summary)) {
            errors.push({
                type: 'emptySummary',
                message: '最终总结未填写',
            });
        }

        return errors;
    }

    /**
     * 格式化验证错误消息（用于 Toast 等简短提示）
     * @param errors 错误列表
     * @returns 格式化的错误消息
     */
    static formatErrorMessage(errors: ValidationError[]): string {
        if (errors.length === 0) {
            return '';
        }

        const messages = errors.map((error) => error.message);
        return messages.join('；');
    }

    /**
     * 检查是否可以标记为已解决（用于 UI 禁用状态判断）
     * @param subQuestions 小问题列表
     * @param summary 最终总结
     * @returns 是否可以标记为已解决
     */
    static canMarkAsSolved(
        subQuestions: SubQuestion[],
        summary: string
    ): boolean {
        const errors = this.getValidationErrors(subQuestions, summary);
        return errors.length === 0;
    }

    /**
     * 获取禁用原因（用于工具提示）
     * @param subQuestions 小问题列表
     * @param summary 最终总结
     * @returns 禁用原因文本
     */
    static getDisabledReason(
        subQuestions: SubQuestion[],
        summary: string
    ): string {
        const errors = this.getValidationErrors(subQuestions, summary);

        if (errors.length === 0) {
            return '';
        }

        const reasons: string[] = [];

        errors.forEach((error) => {
            if (error.type === 'unsolvedSubQuestions') {
                reasons.push(error.message);
            } else if (error.type === 'emptySummary') {
                reasons.push(error.message);
            }
        });

        return reasons.join('\n');
    }
}
