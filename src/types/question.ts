/**
 * 问答板类型定义
 * 支持大问题 → 小问题 → 时间线回答的层级结构
 */

/**
 * 问题状态
 */
export type QuestionStatus = 'unsolved' | 'solving' | 'solved';

/**
 * 状态标签配色
 */
export const STATUS_COLORS: Record<QuestionStatus, { bg: string; text: string; label: string }> = {
    'unsolved': {
        bg: '#FFF3E0',
        text: '#E65100',
        label: '未解决'
    },
    'solving': {
        bg: '#FFF9C4',
        text: '#F57F17',
        label: '解决中'
    },
    'solved': {
        bg: '#E8F5E9',
        text: '#2E7D32',
        label: '已解决'
    },
};

/**
 * 大问题数据结构
 */
export interface BigQuestion {
    id: string;
    title: string;
    description: string;              // Markdown格式的描述/背景说明
    cover?: string;                   // 封面图片URL（可选）
    status: QuestionStatus;
    category: string;                 // 分类，如 "技术"、"生活"
    summary: string;                  // THE END 最终总结（Markdown格式）
    sub_questions: string[];          // 小问题ID数组
    created_at: string;               // 创建时间 ISO 8601格式
    updated_at: string;               // 更新时间 ISO 8601格式
}

/**
 * 小问题数据结构
 */
export interface SubQuestion {
    id: string;
    parent_id: string;                // 所属大问题ID
    title: string;
    status: QuestionStatus;
    answers: string[];                // 回答ID数组（时间线）
    created_at: string;
    updated_at: string;
}

/**
 * 时间线回答数据结构
 */
export interface TimelineAnswer {
    id: string;
    question_id: string;              // 所属小问题ID
    content: string;                  // Markdown格式的回答内容
    timestamp: string;                // 回答时间戳 ISO 8601格式
    created_at: string;
    updated_at: string;
}

/**
 * 大问题创建/更新的输入类型
 */
export type BigQuestionInput = Omit<BigQuestion, 'id' | 'created_at' | 'updated_at' | 'sub_questions'>;

/**
 * 小问题创建/更新的输入类型
 */
export type SubQuestionInput = Omit<SubQuestion, 'id' | 'created_at' | 'updated_at' | 'answers'>;

/**
 * 时间线回答创建/更新的输入类型
 */
export type TimelineAnswerInput = Omit<TimelineAnswer, 'id' | 'created_at' | 'updated_at'>;

/**
 * 问题筛选条件
 */
export interface QuestionFilter {
    status?: QuestionStatus;          // 按状态筛选
    category?: string;                // 按分类筛选
    search?: string;                  // 搜索关键词
}

/**
 * 问题排序选项
 */
export type QuestionSortOption = 'newest' | 'oldest';

/**
 * 完整的问题数据（包含子问题和回答）
 */
export interface QuestionWithDetails extends BigQuestion {
    subQuestionsData: SubQuestion[];
    answersData: Record<string, TimelineAnswer[]>;  // key为小问题ID
}
