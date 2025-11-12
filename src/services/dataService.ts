/**
 * 数据服务
 * 负责加载、保存、更新和删除资源和问答数据
 */

import type {
    Resource,
    ResourceInput,
    BigQuestion,
    SubQuestion,
    TimelineAnswer,
    BigQuestionInput,
    SubQuestionInput,
    TimelineAnswerInput,
    Category,
} from '@/types';
import { ErrorType, createAppError } from '@/types';
import storageService from './storageService';

// 存储键名
const STORAGE_KEYS = {
    RESOURCES: 'pkw_resources',
    BIG_QUESTIONS: 'pkw_big_questions',
    SUB_QUESTIONS: 'pkw_sub_questions',
    ANSWERS: 'pkw_answers',
    CATEGORIES: 'pkw_categories',
} as const;

class DataService {
    private static instance: DataService;

    private constructor() { }

    /**
     * 获取单例实例
     */
    static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    /**
     * 生成唯一ID
     */
    private generateId(prefix: string): string {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 获取当前时间戳（ISO 8601格式）
     */
    private getCurrentTimestamp(): string {
        return new Date().toISOString();
    }

    // ==================== 资源相关方法 ====================

    /**
     * 加载所有资源
     */
    async loadResources(): Promise<Resource[]> {
        try {
            // 首先尝试从localStorage加载
            const stored = storageService.getItem<Resource[]>(STORAGE_KEYS.RESOURCES);
            if (stored && Array.isArray(stored)) {
                return stored;
            }

            // 如果localStorage没有数据，尝试从public/data加载
            const response = await fetch('/data/resources.json');
            if (response.ok) {
                const data = await response.json();
                const resources = data.resources || [];
                // 保存到localStorage
                storageService.setItem(STORAGE_KEYS.RESOURCES, resources);
                return resources;
            }

            // 如果都没有，返回空数组
            return [];
        } catch (error) {
            console.error('Failed to load resources:', error);
            throw createAppError(
                ErrorType.NETWORK_ERROR,
                '加载资源失败',
                error
            );
        }
    }

    /**
     * 保存资源
     */
    async saveResource(input: ResourceInput): Promise<Resource> {
        try {
            const resources = await this.loadResources();
            const timestamp = this.getCurrentTimestamp();

            const newResource: Resource = {
                ...input,
                id: this.generateId('res'),
                created_at: timestamp,
                updated_at: timestamp,
            };

            resources.push(newResource);
            storageService.setItem(STORAGE_KEYS.RESOURCES, resources);

            return newResource;
        } catch (error) {
            console.error('Failed to save resource:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                '保存资源失败',
                error
            );
        }
    }

    /**
     * 更新资源
     */
    async updateResource(id: string, updates: Partial<ResourceInput>): Promise<Resource> {
        try {
            const resources = await this.loadResources();
            const index = resources.findIndex(r => r.id === id);

            if (index === -1) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `资源 ${id} 不存在`
                );
            }

            const updatedResource: Resource = {
                ...resources[index],
                ...updates,
                updated_at: this.getCurrentTimestamp(),
            };

            resources[index] = updatedResource;
            storageService.setItem(STORAGE_KEYS.RESOURCES, resources);

            return updatedResource;
        } catch (error) {
            console.error('Failed to update resource:', error);
            throw error;
        }
    }

    /**
     * 删除资源
     */
    async deleteResource(id: string): Promise<void> {
        try {
            const resources = await this.loadResources();
            const filtered = resources.filter(r => r.id !== id);

            if (filtered.length === resources.length) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `资源 ${id} 不存在`
                );
            }

            storageService.setItem(STORAGE_KEYS.RESOURCES, filtered);
        } catch (error) {
            console.error('Failed to delete resource:', error);
            throw error;
        }
    }

    /**
     * 根据ID获取资源
     */
    async getResourceById(id: string): Promise<Resource | null> {
        try {
            const resources = await this.loadResources();
            return resources.find(r => r.id === id) || null;
        } catch (error) {
            console.error('Failed to get resource:', error);
            return null;
        }
    }

    // ==================== 问答相关方法 ====================

    /**
     * 加载所有大问题
     */
    async loadBigQuestions(): Promise<BigQuestion[]> {
        try {
            const stored = storageService.getItem<BigQuestion[]>(STORAGE_KEYS.BIG_QUESTIONS);
            if (stored && Array.isArray(stored)) {
                return stored;
            }

            const response = await fetch('/data/questions.json');
            if (response.ok) {
                const data = await response.json();
                const questions = data.bigQuestions || [];
                storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, questions);
                return questions;
            }

            return [];
        } catch (error) {
            console.error('Failed to load big questions:', error);
            throw createAppError(
                ErrorType.NETWORK_ERROR,
                '加载问题失败',
                error
            );
        }
    }

    /**
     * 加载所有小问题
     */
    async loadSubQuestions(): Promise<SubQuestion[]> {
        try {
            const stored = storageService.getItem<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS);
            if (stored && Array.isArray(stored)) {
                return stored;
            }

            const response = await fetch('/data/questions.json');
            if (response.ok) {
                const data = await response.json();
                const subQuestions = data.subQuestions || [];
                storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);
                return subQuestions;
            }

            return [];
        } catch (error) {
            console.error('Failed to load sub questions:', error);
            return [];
        }
    }

    /**
     * 加载所有回答
     */
    async loadAnswers(): Promise<TimelineAnswer[]> {
        try {
            const stored = storageService.getItem<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS);
            if (stored && Array.isArray(stored)) {
                return stored;
            }

            const response = await fetch('/data/questions.json');
            if (response.ok) {
                const data = await response.json();
                const answers = data.answers || [];
                storageService.setItem(STORAGE_KEYS.ANSWERS, answers);
                return answers;
            }

            return [];
        } catch (error) {
            console.error('Failed to load answers:', error);
            return [];
        }
    }

    /**
     * 保存大问题
     */
    async saveBigQuestion(input: BigQuestionInput): Promise<BigQuestion> {
        try {
            const questions = await this.loadBigQuestions();
            const timestamp = this.getCurrentTimestamp();

            const newQuestion: BigQuestion = {
                ...input,
                id: this.generateId('q'),
                sub_questions: [],
                created_at: timestamp,
                updated_at: timestamp,
            };

            questions.push(newQuestion);
            storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, questions);

            return newQuestion;
        } catch (error) {
            console.error('Failed to save big question:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                '保存问题失败',
                error
            );
        }
    }

    /**
     * 更新大问题
     */
    async updateBigQuestion(id: string, updates: Partial<BigQuestionInput>): Promise<BigQuestion> {
        try {
            const questions = await this.loadBigQuestions();
            const index = questions.findIndex(q => q.id === id);

            if (index === -1) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `问题 ${id} 不存在`
                );
            }

            const updatedQuestion: BigQuestion = {
                ...questions[index],
                ...updates,
                updated_at: this.getCurrentTimestamp(),
            };

            questions[index] = updatedQuestion;
            storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, questions);

            return updatedQuestion;
        } catch (error) {
            console.error('Failed to update big question:', error);
            throw error;
        }
    }

    /**
     * 删除大问题（级联删除小问题和回答）
     */
    async deleteBigQuestion(id: string): Promise<void> {
        try {
            const questions = await this.loadBigQuestions();
            const question = questions.find(q => q.id === id);

            if (!question) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `问题 ${id} 不存在`
                );
            }

            // 删除所有小问题和回答
            for (const subQuestionId of question.sub_questions) {
                await this.deleteSubQuestion(subQuestionId);
            }

            // 删除大问题
            const filtered = questions.filter(q => q.id !== id);
            storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, filtered);
        } catch (error) {
            console.error('Failed to delete big question:', error);
            throw error;
        }
    }

    /**
     * 保存小问题
     */
    async saveSubQuestion(parentId: string, input: SubQuestionInput): Promise<SubQuestion> {
        try {
            const subQuestions = await this.loadSubQuestions();
            const timestamp = this.getCurrentTimestamp();

            const newSubQuestion: SubQuestion = {
                ...input,
                id: this.generateId('sq'),
                parent_id: parentId,
                answers: [],
                created_at: timestamp,
                updated_at: timestamp,
            };

            subQuestions.push(newSubQuestion);
            storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);

            // 更新父问题的sub_questions数组
            const bigQuestions = await this.loadBigQuestions();
            const parentIndex = bigQuestions.findIndex(q => q.id === parentId);
            if (parentIndex !== -1) {
                bigQuestions[parentIndex].sub_questions.push(newSubQuestion.id);
                bigQuestions[parentIndex].updated_at = timestamp;
                storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, bigQuestions);
            }

            return newSubQuestion;
        } catch (error) {
            console.error('Failed to save sub question:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                '保存小问题失败',
                error
            );
        }
    }

    /**
     * 更新小问题
     */
    async updateSubQuestion(id: string, updates: Partial<SubQuestionInput>): Promise<SubQuestion> {
        try {
            const subQuestions = await this.loadSubQuestions();
            const index = subQuestions.findIndex(sq => sq.id === id);

            if (index === -1) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `小问题 ${id} 不存在`
                );
            }

            const updatedSubQuestion: SubQuestion = {
                ...subQuestions[index],
                ...updates,
                updated_at: this.getCurrentTimestamp(),
            };

            subQuestions[index] = updatedSubQuestion;
            storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);

            return updatedSubQuestion;
        } catch (error) {
            console.error('Failed to update sub question:', error);
            throw error;
        }
    }

    /**
     * 删除小问题（级联删除回答）
     */
    async deleteSubQuestion(id: string): Promise<void> {
        try {
            const subQuestions = await this.loadSubQuestions();
            const subQuestion = subQuestions.find(sq => sq.id === id);

            if (!subQuestion) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `小问题 ${id} 不存在`
                );
            }

            // 删除所有回答
            const answers = await this.loadAnswers();
            const filteredAnswers = answers.filter(a => !subQuestion.answers.includes(a.id));
            storageService.setItem(STORAGE_KEYS.ANSWERS, filteredAnswers);

            // 删除小问题
            const filtered = subQuestions.filter(sq => sq.id !== id);
            storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, filtered);

            // 从父问题中移除引用
            const bigQuestions = await this.loadBigQuestions();
            const parentIndex = bigQuestions.findIndex(q => q.id === subQuestion.parent_id);
            if (parentIndex !== -1) {
                bigQuestions[parentIndex].sub_questions = bigQuestions[parentIndex].sub_questions.filter(
                    sqId => sqId !== id
                );
                storageService.setItem(STORAGE_KEYS.BIG_QUESTIONS, bigQuestions);
            }
        } catch (error) {
            console.error('Failed to delete sub question:', error);
            throw error;
        }
    }

    /**
     * 保存回答
     */
    async saveAnswer(questionId: string, input: TimelineAnswerInput): Promise<TimelineAnswer> {
        try {
            const answers = await this.loadAnswers();
            const timestamp = this.getCurrentTimestamp();

            const newAnswer: TimelineAnswer = {
                ...input,
                id: this.generateId('ans'),
                question_id: questionId,
                created_at: timestamp,
                updated_at: timestamp,
            };

            answers.push(newAnswer);
            storageService.setItem(STORAGE_KEYS.ANSWERS, answers);

            // 更新小问题的answers数组
            const subQuestions = await this.loadSubQuestions();
            const questionIndex = subQuestions.findIndex(sq => sq.id === questionId);
            if (questionIndex !== -1) {
                subQuestions[questionIndex].answers.push(newAnswer.id);
                subQuestions[questionIndex].updated_at = timestamp;
                storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);
            }

            return newAnswer;
        } catch (error) {
            console.error('Failed to save answer:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                '保存回答失败',
                error
            );
        }
    }

    /**
     * 更新回答
     */
    async updateAnswer(id: string, updates: Partial<TimelineAnswerInput>): Promise<TimelineAnswer> {
        try {
            const answers = await this.loadAnswers();
            const index = answers.findIndex(a => a.id === id);

            if (index === -1) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `回答 ${id} 不存在`
                );
            }

            const updatedAnswer: TimelineAnswer = {
                ...answers[index],
                ...updates,
                updated_at: this.getCurrentTimestamp(),
            };

            answers[index] = updatedAnswer;
            storageService.setItem(STORAGE_KEYS.ANSWERS, answers);

            return updatedAnswer;
        } catch (error) {
            console.error('Failed to update answer:', error);
            throw error;
        }
    }

    /**
     * 删除回答
     */
    async deleteAnswer(id: string): Promise<void> {
        try {
            const answers = await this.loadAnswers();
            const answer = answers.find(a => a.id === id);

            if (!answer) {
                throw createAppError(
                    ErrorType.NOT_FOUND,
                    `回答 ${id} 不存在`
                );
            }

            // 删除回答
            const filtered = answers.filter(a => a.id !== id);
            storageService.setItem(STORAGE_KEYS.ANSWERS, filtered);

            // 从小问题中移除引用
            const subQuestions = await this.loadSubQuestions();
            const questionIndex = subQuestions.findIndex(sq => sq.id === answer.question_id);
            if (questionIndex !== -1) {
                subQuestions[questionIndex].answers = subQuestions[questionIndex].answers.filter(
                    aId => aId !== id
                );
                storageService.setItem(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);
            }
        } catch (error) {
            console.error('Failed to delete answer:', error);
            throw error;
        }
    }

    // ==================== 分类相关方法 ====================

    /**
     * 加载所有分类
     */
    async loadCategories(): Promise<Category[]> {
        try {
            const stored = storageService.getItem<Category[]>(STORAGE_KEYS.CATEGORIES);
            if (stored && Array.isArray(stored)) {
                return stored;
            }

            const response = await fetch('/data/categories.json');
            if (response.ok) {
                const data = await response.json();
                const categories = data.categories || [];
                storageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
                return categories;
            }

            // 返回默认分类
            const defaultCategories: Category[] = [
                { id: 'all', name: '全部', color: '#F5F5F5' },
                { id: 'ai-learning', name: 'AI学习', color: '#E3F2FD' },
                { id: 'programming', name: '编程', color: '#E8F5E9' },
                { id: 'design', name: '设计', color: '#FFF3E0' },
                { id: 'productivity', name: '效率工具', color: '#F3E5F5' },
            ];
            storageService.setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
            return defaultCategories;
        } catch (error) {
            console.error('Failed to load categories:', error);
            return [];
        }
    }
}

export default DataService.getInstance();
