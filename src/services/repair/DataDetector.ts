/**
 * Data Detector
 * 数据检测器 - 检测 Gist 数据中的所有格式错误
 */

import type {
    ItemError,
    ErrorSummary,
    DetectionResult,
    DataType,
    ErrorType,
} from '@/types/dataRepair';

/**
 * DataDetector 类
 * 负责检测数据中的所有格式错误
 */
export class DataDetector {
    /**
     * 检测 Gist 数据中的所有错误
     */
    detectErrors(data: any): DetectionResult {
        const errorsByType: Record<DataType, ItemError[]> = {
            questions: [],
            subQuestions: [],
            answers: [],
            resources: [],
            metadata: [],
        };

        // 基础类型检查
        if (typeof data !== 'object' || data === null) {
            return {
                valid: false,
                totalErrors: 1,
                errorsByType,
                summary: this.generateSummary(errorsByType),
            };
        }

        // 验证 questions
        if (Array.isArray(data.questions)) {
            data.questions.forEach((item: any, index: number) => {
                const errors = this.detectBigQuestionErrors(item, index);
                errorsByType.questions.push(...errors);
            });
        }

        // 验证 subQuestions
        if (Array.isArray(data.subQuestions)) {
            data.subQuestions.forEach((item: any, index: number) => {
                const errors = this.detectSubQuestionErrors(item, index);
                errorsByType.subQuestions.push(...errors);
            });
        }

        // 验证 answers
        if (Array.isArray(data.answers)) {
            data.answers.forEach((item: any, index: number) => {
                const errors = this.detectTimelineAnswerErrors(item, index);
                errorsByType.answers.push(...errors);
            });
        }

        // 验证 resources
        if (Array.isArray(data.resources)) {
            data.resources.forEach((item: any, index: number) => {
                const errors = this.detectResourceErrors(item, index);
                errorsByType.resources.push(...errors);
            });
        }

        // 验证 metadata
        if (data.metadata) {
            const errors = this.detectMetadataErrors(data.metadata, 0);
            errorsByType.metadata.push(...errors);
        }

        const summary = this.generateSummary(errorsByType);

        return {
            valid: summary.totalErrors === 0,
            totalErrors: summary.totalErrors,
            errorsByType,
            summary,
        };
    }

    /**
     * 检测单个 BigQuestion 的错误
     * 只检查字段存在性和基本类型，不验证业务规则
     */
    detectBigQuestionErrors(item: any, index: number): ItemError[] {
        const errors: ItemError[] = [];

        if (typeof item !== 'object' || item === null) {
            errors.push({
                itemIndex: index,
                field: '_root',
                errorType: 'invalid_type',
                currentValue: item,
                expectedFormat: 'object',
                message: `问题 #${index}: 不是有效的对象`,
            });
            return errors;
        }

        // 只检查字段存在性和类型，不验证具体值
        if (typeof item.id !== 'string') {
            errors.push(this.createError(index, item.id, 'id', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'id' 字段`));
        }

        if (typeof item.title !== 'string') {
            errors.push(this.createError(index, item.id, 'title', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'title' 字段`));
        }

        if (typeof item.description !== 'string') {
            errors.push(this.createError(index, item.id, 'description', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'description' 字段`));
        }

        if (typeof item.status !== 'string') {
            errors.push(this.createError(index, item.id, 'status', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'status' 字段`));
        }

        if (typeof item.category !== 'string') {
            errors.push(this.createError(index, item.id, 'category', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'category' 字段`));
        }

        if (typeof item.summary !== 'string') {
            errors.push(this.createError(index, item.id, 'summary', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'summary' 字段`));
        }

        if (!Array.isArray(item.sub_questions)) {
            errors.push(this.createError(index, item.id, 'sub_questions', 'missing_field', 'array', `问题 #${index}: 'sub_questions' 应该是数组`));
        }

        if (typeof item.created_at !== 'string') {
            errors.push(this.createError(index, item.id, 'created_at', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'created_at' 字段`));
        }

        if (typeof item.updated_at !== 'string') {
            errors.push(this.createError(index, item.id, 'updated_at', 'missing_field', 'string', `问题 #${index}: 缺少或无效的 'updated_at' 字段`));
        }

        return errors;
    }

    /**
     * 检测单个 SubQuestion 的错误
     * 只检查字段存在性和基本类型，不验证业务规则
     */
    detectSubQuestionErrors(item: any, index: number): ItemError[] {
        const errors: ItemError[] = [];

        if (typeof item !== 'object' || item === null) {
            errors.push({
                itemIndex: index,
                field: '_root',
                errorType: 'invalid_type',
                currentValue: item,
                expectedFormat: 'object',
                message: `子问题 #${index}: 不是有效的对象`,
            });
            return errors;
        }

        if (typeof item.id !== 'string') {
            errors.push(this.createError(index, item.id, 'id', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'id' 字段`));
        }

        if (typeof item.parent_id !== 'string') {
            errors.push(this.createError(index, item.id, 'parent_id', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'parent_id' 字段`));
        }

        if (typeof item.title !== 'string') {
            errors.push(this.createError(index, item.id, 'title', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'title' 字段`));
        }

        if (typeof item.status !== 'string') {
            errors.push(this.createError(index, item.id, 'status', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'status' 字段`));
        }

        if (!Array.isArray(item.answers)) {
            errors.push(this.createError(index, item.id, 'answers', 'missing_field', 'array', `子问题 #${index}: 'answers' 应该是数组`));
        }

        if (typeof item.created_at !== 'string') {
            errors.push(this.createError(index, item.id, 'created_at', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'created_at' 字段`));
        }

        if (typeof item.updated_at !== 'string') {
            errors.push(this.createError(index, item.id, 'updated_at', 'missing_field', 'string', `子问题 #${index}: 缺少或无效的 'updated_at' 字段`));
        }

        return errors;
    }

    /**
     * 检测单个 TimelineAnswer 的错误
     * 只检查字段存在性和基本类型，不验证业务规则
     */
    detectTimelineAnswerErrors(item: any, index: number): ItemError[] {
        const errors: ItemError[] = [];

        if (typeof item !== 'object' || item === null) {
            errors.push({
                itemIndex: index,
                field: '_root',
                errorType: 'invalid_type',
                currentValue: item,
                expectedFormat: 'object',
                message: `答案 #${index}: 不是有效的对象`,
            });
            return errors;
        }

        if (typeof item.id !== 'string') {
            errors.push(this.createError(index, item.id, 'id', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'id' 字段`));
        }

        if (typeof item.question_id !== 'string') {
            errors.push(this.createError(index, item.id, 'question_id', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'question_id' 字段`));
        }

        if (typeof item.content !== 'string') {
            errors.push(this.createError(index, item.id, 'content', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'content' 字段`));
        }

        if (typeof item.timestamp !== 'string') {
            errors.push(this.createError(index, item.id, 'timestamp', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'timestamp' 字段`));
        }

        if (typeof item.created_at !== 'string') {
            errors.push(this.createError(index, item.id, 'created_at', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'created_at' 字段`));
        }

        if (typeof item.updated_at !== 'string') {
            errors.push(this.createError(index, item.id, 'updated_at', 'missing_field', 'string', `答案 #${index}: 缺少或无效的 'updated_at' 字段`));
        }

        return errors;
    }

    /**
     * 检测单个 Resource 的错误
     * 只检查字段存在性和基本类型，不验证业务规则
     */
    detectResourceErrors(item: any, index: number): ItemError[] {
        const errors: ItemError[] = [];

        if (typeof item !== 'object' || item === null) {
            errors.push({
                itemIndex: index,
                field: '_root',
                errorType: 'invalid_type',
                currentValue: item,
                expectedFormat: 'object',
                message: `资源 #${index}: 不是有效的对象`,
            });
            return errors;
        }

        const requiredStringFields = ['id', 'title', 'url', 'type', 'cover', 'platform', 'category', 'author', 'recommendation'];

        for (const field of requiredStringFields) {
            if (typeof item[field] !== 'string') {
                errors.push(this.createError(index, item.id, field, 'missing_field', 'string', `资源 #${index}: 缺少或无效的 '${field}' 字段`));
            }
        }

        if (!Array.isArray(item.content_tags)) {
            errors.push(this.createError(index, item.id, 'content_tags', 'missing_field', 'array', `资源 #${index}: 'content_tags' 应该是数组`));
        }

        if (typeof item.metadata !== 'object' || item.metadata === null) {
            errors.push(this.createError(index, item.id, 'metadata', 'missing_field', 'object', `资源 #${index}: 缺少或无效的 'metadata' 字段`));
        }

        if (typeof item.created_at !== 'string') {
            errors.push(this.createError(index, item.id, 'created_at', 'missing_field', 'string', `资源 #${index}: 缺少或无效的 'created_at' 字段`));
        }

        if (typeof item.updated_at !== 'string') {
            errors.push(this.createError(index, item.id, 'updated_at', 'missing_field', 'string', `资源 #${index}: 缺少或无效的 'updated_at' 字段`));
        }

        return errors;
    }

    /**
     * 检测 Metadata 的错误
     * 只检查字段存在性和基本类型，不验证业务规则
     */
    detectMetadataErrors(item: any, index: number): ItemError[] {
        const errors: ItemError[] = [];

        if (typeof item !== 'object' || item === null) {
            errors.push({
                itemIndex: index,
                field: '_root',
                errorType: 'invalid_type',
                currentValue: item,
                expectedFormat: 'object',
                message: 'Metadata: 不是有效的对象',
            });
            return errors;
        }

        if (typeof item.version !== 'string') {
            errors.push(this.createError(index, undefined, 'version', 'missing_field', 'string', 'Metadata: 缺少或无效的 \'version\' 字段'));
        }

        if (typeof item.lastSync !== 'string') {
            errors.push(this.createError(index, undefined, 'lastSync', 'missing_field', 'string', 'Metadata: 缺少或无效的 \'lastSync\' 字段'));
        }

        if (typeof item.owner !== 'string') {
            errors.push(this.createError(index, undefined, 'owner', 'missing_field', 'string', 'Metadata: 缺少或无效的 \'owner\' 字段'));
        }

        return errors;
    }

    /**
     * 创建错误对象的辅助方法
     */
    private createError(
        itemIndex: number,
        itemId: string | undefined,
        field: string,
        errorType: ErrorType,
        expectedFormat: string,
        message: string
    ): ItemError {
        return {
            itemIndex,
            itemId,
            field,
            errorType,
            currentValue: undefined,
            expectedFormat,
            message,
        };
    }

    /**
     * 生成错误摘要
     */
    private generateSummary(errorsByType: Record<DataType, ItemError[]>): ErrorSummary {
        const errorsByCategory: Record<ErrorType, number> = {
            missing_field: 0,
            invalid_type: 0,
            invalid_value: 0,
            invalid_format: 0,
        };

        let totalErrors = 0;
        const errorsByTypeCount: Record<DataType, number> = {
            questions: 0,
            subQuestions: 0,
            answers: 0,
            resources: 0,
            metadata: 0,
        };

        // 统计各类错误
        for (const [dataType, errors] of Object.entries(errorsByType)) {
            errorsByTypeCount[dataType as DataType] = errors.length;
            totalErrors += errors.length;

            for (const error of errors) {
                errorsByCategory[error.errorType]++;
            }
        }

        // 估算可自动修复的错误数量
        // missing_field 和 invalid_value 通常可以自动修复
        const autoRepairableErrors =
            errorsByCategory.missing_field +
            errorsByCategory.invalid_value;

        // critical errors 是那些可能导致数据完全不可用的错误
        const criticalErrors = errorsByCategory.invalid_type;

        return {
            totalErrors,
            errorsByType: errorsByTypeCount,
            errorsByCategory,
            criticalErrors,
            autoRepairableErrors,
        };
    }
}

// 导出单例实例
export const dataDetector = new DataDetector();
