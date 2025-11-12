/**
 * 数据验证工具
 * 验证从 Gist 加载的数据格式，防止注入攻击和数据损坏
 */

import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { GistData, GistMetadata } from '@/types/gist';

/**
 * 验证资源数据
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
        data.content_tags.every((tag: any) => typeof tag === 'string') &&
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
        ['unsolved', 'solving', 'solved'].includes(data.status) &&
        typeof data.category === 'string' &&
        typeof data.summary === 'string' &&
        Array.isArray(data.sub_questions) &&
        data.sub_questions.every((id: any) => typeof id === 'string') &&
        typeof data.created_at === 'string' &&
        typeof data.updated_at === 'string'
    );
}

/**
 * 验证小问题数据
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
        ['unsolved', 'solving', 'solved'].includes(data.status) &&
        Array.isArray(data.answers) &&
        data.answers.every((id: any) => typeof id === 'string') &&
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
 * 验证完整的 Gist 数据
 * @param data - 要验证的数据
 * @returns 是否为有效的 Gist 数据
 */
export function validateGistData(data: any): data is GistData {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    // 验证 resources 数组
    if (!Array.isArray(data.resources)) {
        return false;
    }
    if (!data.resources.every(validateResource)) {
        return false;
    }

    // 验证 questions 数组
    if (!Array.isArray(data.questions)) {
        return false;
    }
    if (!data.questions.every(validateBigQuestion)) {
        return false;
    }

    // 验证 subQuestions 数组
    if (!Array.isArray(data.subQuestions)) {
        return false;
    }
    if (!data.subQuestions.every(validateSubQuestion)) {
        return false;
    }

    // 验证 answers 数组
    if (!Array.isArray(data.answers)) {
        return false;
    }
    if (!data.answers.every(validateTimelineAnswer)) {
        return false;
    }

    // 验证 metadata
    if (!validateGistMetadata(data.metadata)) {
        return false;
    }

    return true;
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
