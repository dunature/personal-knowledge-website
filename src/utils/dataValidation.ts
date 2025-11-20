/**
 * 数据验证工具
 * 验证从 Gist 加载的数据格式，防止注入攻击和数据损坏
 */

import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { GistData, GistMetadata } from '@/types/gist';

/**
 * Validation result interface
 */
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}

/**
 * 验证资源数据
 * 只检查字段存在性和基本类型，不验证业务规则
 * @param data - 要验证的数据
 * @returns 是否为有效的资源数据
 */
export function validateResource(data: any): data is Resource {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.url === 'string' &&
        typeof data.type === 'string' &&
        typeof data.cover === 'string' &&
        typeof data.platform === 'string' &&
        Array.isArray(data.content_tags) &&
        typeof data.category === 'string' &&
        typeof data.author === 'string' &&
        typeof data.recommendation === 'string' &&
        typeof data.metadata === 'object' &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
    );
}

/**
 * 验证大问题数据
 * 只检查字段存在性和基本类型，不验证业务规则
 * @param data - 要验证的数据
 * @returns 是否为有效的大问题数据
 */
export function validateBigQuestion(data: any): data is BigQuestion {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        typeof data.status === 'string' &&
        typeof data.category === 'string' &&
        typeof data.summary === 'string' &&
        Array.isArray(data.sub_questions) &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
    );
}

/**
 * 验证大问题数据并返回详细错误
 * 只检查字段存在性和基本类型，不验证业务规则
 * @param data - 要验证的数据
 * @param index - 数据项索引（用于错误消息）
 * @returns 错误消息数组，如果有效则返回空数组
 */
export function validateBigQuestionDetailed(data: any, index: number): string[] {
    const errors: string[] = [];

    if (typeof data !== 'object' || data === null) {
        errors.push(`问题 #${index}: 不是有效的对象`);
        return errors;
    }

    if (typeof data.id !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'id' 字段`);
    if (typeof data.title !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'title' 字段`);
    if (typeof data.description !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'description' 字段`);
    if (typeof data.status !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'status' 字段`);
    if (typeof data.category !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'category' 字段`);
    if (typeof data.summary !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'summary' 字段`);
    if (!Array.isArray(data.sub_questions)) {
        errors.push(`问题 #${index}: 'sub_questions' 应该是数组`);
    }
    if (typeof data.created_at !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'created_at' 字段`);
    if (typeof data.updated_at !== 'string') errors.push(`问题 #${index}: 缺少或无效的 'updated_at' 字段`);

    return errors;
}

/**
 * 验证小问题数据
 * 只检查字段存在性和基本类型，不验证业务规则
 * @param data - 要验证的数据
 * @returns 是否为有效的小问题数据
 */
export function validateSubQuestion(data: any): data is SubQuestion {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.parent_id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.status === 'string' &&
        Array.isArray(data.answers) &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
    );
}

/**
 * 验证时间线回答数据
 * @param data - 要验证的数据
 * @returns 是否为有效的时间线回答数据
 */
export function validateTimelineAnswer(data: any): data is TimelineAnswer {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.question_id === 'string' &&
        typeof data.content === 'string' &&
        typeof data.timestamp === 'string' &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
    );
}

/**
 * 验证 Gist 元数据
 * @param data - 要验证的数据
 * @returns 是否为有效的元数据
 */
export function validateGistMetadata(data: any): data is GistMetadata {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.version === 'string' &&
        typeof data.lastSync === 'string' &&
        typeof data.owner === 'string'
    );
}

/**
 * 验证完整的 Gist 数据（返回布尔值，向后兼容）
 * @param data - 要验证的数据
 * @returns 是否为有效的 Gist 数据
 */
export function validateGistData(data: any): data is GistData {
    const result = validateGistDataDetailed(data);
    if (!result.valid && result.errors) {
        result.errors.forEach(error => console.error(error));
    }
    return result.valid;
}

/**
 * 验证完整的 Gist 数据（返回详细结果）
 * @param data - 要验证的数据
 * @returns 验证结果，包含错误详情
 */
export function validateGistDataDetailed(data: any): ValidationResult {
    const errors: string[] = [];

    // 基础类型检查
    if (typeof data !== 'object' || data === null) {
        errors.push('数据格式错误：数据不是有效的对象');
        return { valid: false, errors };
    }

    // 检查必需的文件/字段
    const requiredFields = ['resources', 'questions', 'subQuestions', 'answers', 'metadata'];
    const missingFields = requiredFields.filter(field => !(field in data));

    if (missingFields.length > 0) {
        errors.push(`缺少必需的数据字段：${missingFields.join(', ')}`);
        return { valid: false, errors };
    }

    // 验证 resources 数组
    if (!Array.isArray(data.resources)) {
        errors.push('数据结构错误：resources 应该是数组类型');
    } else {
        const invalidResources = data.resources.filter((r: any) => !validateResource(r));
        if (invalidResources.length > 0) {
            errors.push(`发现 ${invalidResources.length} 个无效的资源数据项（resources 数组中的数据格式不正确）`);
        }
    }

    // 验证 questions 数组
    if (!Array.isArray(data.questions)) {
        errors.push('数据结构错误：questions 应该是数组类型');
    } else {
        // 使用详细验证检查每个问题
        data.questions.forEach((q: any, index: number) => {
            const questionErrors = validateBigQuestionDetailed(q, index);
            errors.push(...questionErrors);
        });
    }

    // 验证 subQuestions 数组
    if (!Array.isArray(data.subQuestions)) {
        errors.push('数据结构错误：subQuestions 应该是数组类型');
    } else {
        const invalidSubQuestions = data.subQuestions.filter((sq: any) => !validateSubQuestion(sq));
        if (invalidSubQuestions.length > 0) {
            errors.push(`发现 ${invalidSubQuestions.length} 个无效的子问题数据项（subQuestions 数组中的数据格式不正确）`);
        }
    }

    // 验证 answers 数组
    if (!Array.isArray(data.answers)) {
        errors.push('数据结构错误：answers 应该是数组类型');
    } else {
        const invalidAnswers = data.answers.filter((a: any) => !validateTimelineAnswer(a));
        if (invalidAnswers.length > 0) {
            errors.push(`发现 ${invalidAnswers.length} 个无效的答案数据项（answers 数组中的数据格式不正确）`);
        }
    }

    // 验证 metadata
    if (!data.metadata) {
        errors.push('缺少必需的字段：metadata');
    } else if (!validateGistMetadata(data.metadata)) {
        errors.push('数据结构错误：metadata 格式不正确（应包含 version, lastSync, owner 字段）');
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
}

/**
 * 清理和验证 URL
 * 防止 XSS 攻击
 * @param url - 要验证的 URL
 * @returns 清理后的 URL，如果无效则返回空字符串
 */
export function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        // 只允许 http 和 https 协议
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return '';
        }
        return parsed.toString();
    } catch {
        return '';
    }
}

/**
 * 验证 ISO 8601 日期字符串
 * @param dateString - 要验证的日期字符串
 * @returns 是否为有效的日期
 */
export function isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString();
}

/**
 * 清理数据中的危险内容
 * 移除或转义可能导致 XSS 的内容
 * @param data - 要清理的数据
 * @returns 清理后的数据
 */
export function sanitizeGistData(data: GistData): GistData {
    return {
        resources: data.resources.map((resource) => ({
            ...resource,
            url: sanitizeUrl(resource.url),
            cover: sanitizeUrl(resource.cover),
            author_url: resource.author_url ? sanitizeUrl(resource.author_url) : undefined,
            platform_logo: resource.platform_logo ? sanitizeUrl(resource.platform_logo) : undefined,
        })),
        questions: data.questions,
        subQuestions: data.subQuestions,
        answers: data.answers,
        metadata: data.metadata,
    };
}
