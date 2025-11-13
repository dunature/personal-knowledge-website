/**
 * 问答Context
 * 管理大问题、小问题、回答列表和筛选排序状态
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { syncService } from '@/services/syncService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { useAuth } from './AuthContext';
import type { BigQuestion, SubQuestion, TimelineAnswer, QuestionStatus } from '@/types/question';
import type { QuestionSortOption } from '@/components/qa/QuestionFilter';
import type { SyncStatus } from '@/types/sync';

interface QAContextState {
    // 数据
    questions: BigQuestion[];
    subQuestions: SubQuestion[];
    answers: TimelineAnswer[];

    // 筛选和排序状态
    selectedStatus: QuestionStatus | 'all';
    selectedCategory: string;
    sortOption: QuestionSortOption;

    // 大问题方法
    setQuestions: (questions: BigQuestion[]) => void;
    addQuestion: (question: BigQuestion) => Promise<void>;
    updateQuestion: (id: string, updates: Partial<BigQuestion>) => Promise<void>;
    deleteQuestion: (id: string) => Promise<void>;

    // 小问题方法
    setSubQuestions: (subQuestions: SubQuestion[]) => void;
    addSubQuestion: (subQuestion: SubQuestion) => Promise<void>;
    updateSubQuestion: (id: string, updates: Partial<SubQuestion>) => Promise<void>;
    deleteSubQuestion: (id: string) => Promise<void>;

    // 回答方法
    setAnswers: (answers: TimelineAnswer[]) => void;
    addAnswer: (answer: TimelineAnswer) => Promise<void>;
    updateAnswer: (id: string, updates: Partial<TimelineAnswer>) => Promise<void>;
    deleteAnswer: (id: string) => Promise<void>;

    // 筛选和排序方法
    setSelectedStatus: (status: QuestionStatus | 'all') => void;
    setSelectedCategory: (category: string) => void;
    setSortOption: (option: QuestionSortOption) => void;

    // 计算属性
    filteredQuestions: BigQuestion[];
    categories: string[];
    getSubQuestionsByParent: (parentId: string) => SubQuestion[];
    getAnswersByQuestion: (questionId: string) => TimelineAnswer[];
    getSubQuestionCount: (questionId: string) => number;

    // 同步相关
    syncStatus: SyncStatus;
    syncNow: () => Promise<void>;
    lastSyncTime: string | null;
}

const QAContext = createContext<QAContextState | undefined>(undefined);

interface QAProviderProps {
    children: ReactNode;
    initialQuestions?: BigQuestion[];
    initialSubQuestions?: SubQuestion[];
    initialAnswers?: TimelineAnswer[];
}

export const QAProvider: React.FC<QAProviderProps> = ({
    children,
    initialQuestions = [],
    initialSubQuestions = [],
    initialAnswers = [],
}) => {
    const [questions, setQuestions] = useState<BigQuestion[]>(initialQuestions);
    const [subQuestions, setSubQuestions] = useState<SubQuestion[]>(initialSubQuestions);
    const [answers, setAnswers] = useState<TimelineAnswer[]>(initialAnswers);

    const [selectedStatus, setSelectedStatus] = useState<QuestionStatus | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<QuestionSortOption>('newest');

    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const { isAuthenticated, mode } = useAuth();

    // 初始化时加载缓存数据
    useEffect(() => {
        const loadData = async () => {
            try {
                // 从缓存加载数据
                const cachedQuestions = await cacheService.getData<BigQuestion[]>(STORAGE_KEYS.QUESTIONS);
                const cachedSubQuestions = await cacheService.getData<SubQuestion[]>(STORAGE_KEYS.SUB_QUESTIONS);
                const cachedAnswers = await cacheService.getData<TimelineAnswer[]>(STORAGE_KEYS.ANSWERS);

                if (cachedQuestions && cachedQuestions.length > 0) {
                    setQuestions(cachedQuestions);
                }
                if (cachedSubQuestions && cachedSubQuestions.length > 0) {
                    setSubQuestions(cachedSubQuestions);
                }
                if (cachedAnswers && cachedAnswers.length > 0) {
                    setAnswers(cachedAnswers);
                }

                // 获取最后同步时间
                const lastSync = await syncService.getLastSyncTime();
                setLastSyncTime(lastSync);
            } catch (error) {
                console.error('Failed to load QA data:', error);
            }
        };
        loadData();
    }, []);

    // 监听同步状态变化
    useEffect(() => {
        const unsubscribe = syncService.onSyncStatusChange((status) => {
            setSyncStatus(status);
        });
        return unsubscribe;
    }, []);

    // 当数据变化时保存到缓存
    useEffect(() => {
        const saveToCache = async () => {
            if (questions.length > 0) {
                await cacheService.saveData(STORAGE_KEYS.QUESTIONS, questions);
            }
        };
        saveToCache();
    }, [questions]);

    useEffect(() => {
        const saveToCache = async () => {
            if (subQuestions.length > 0) {
                await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, subQuestions);
            }
        };
        saveToCache();
    }, [subQuestions]);

    useEffect(() => {
        const saveToCache = async () => {
            if (answers.length > 0) {
                await cacheService.saveData(STORAGE_KEYS.ANSWERS, answers);
            }
        };
        saveToCache();
    }, [answers]);

    // 获取所有分类
    const categories = React.useMemo(() => {
        const cats = new Set(questions.map(q => q.category));
        return Array.from(cats);
    }, [questions]);

    // 添加大问题
    const addQuestion = useCallback(async (question: BigQuestion) => {
        setQuestions(prev => [...prev, question]);
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'create',
                entity: 'question',
                id: question.id,
                data: question,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 更新大问题
    const updateQuestion = useCallback(async (id: string, updates: Partial<BigQuestion>) => {
        setQuestions(prev =>
            prev.map(q => (q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q))
        );
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'update',
                entity: 'question',
                id,
                data: updates,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 删除大问题
    const deleteQuestion = useCallback(async (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        // 同时删除相关的小问题
        setSubQuestions(prev => prev.filter(sq => sq.parent_id !== id));
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'delete',
                entity: 'question',
                id,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 添加小问题
    const addSubQuestion = useCallback(async (subQuestion: SubQuestion) => {
        setSubQuestions(prev => [...prev, subQuestion]);
        // 更新父问题的sub_questions数组
        setQuestions(prev =>
            prev.map(q =>
                q.id === subQuestion.parent_id
                    ? { ...q, sub_questions: [...q.sub_questions, subQuestion.id], updated_at: new Date().toISOString() }
                    : q
            )
        );
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'create',
                entity: 'subQuestion',
                id: subQuestion.id,
                data: subQuestion,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 更新小问题
    const updateSubQuestion = useCallback(async (id: string, updates: Partial<SubQuestion>) => {
        setSubQuestions(prev =>
            prev.map(sq => (sq.id === id ? { ...sq, ...updates, updated_at: new Date().toISOString() } : sq))
        );
        // 更新父问题的updated_at
        const subQuestion = subQuestions.find(sq => sq.id === id);
        if (subQuestion) {
            setQuestions(prev =>
                prev.map(q =>
                    q.id === subQuestion.parent_id
                        ? { ...q, updated_at: new Date().toISOString() }
                        : q
                )
            );
        }
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'update',
                entity: 'subQuestion',
                id,
                data: updates,
                timestamp: new Date().toISOString(),
            });
        }
    }, [subQuestions, isAuthenticated, mode]);

    // 删除小问题
    const deleteSubQuestion = useCallback(async (id: string) => {
        const subQuestion = subQuestions.find(sq => sq.id === id);
        setSubQuestions(prev => prev.filter(sq => sq.id !== id));
        // 从父问题的sub_questions数组中移除
        if (subQuestion) {
            setQuestions(prev =>
                prev.map(q =>
                    q.id === subQuestion.parent_id
                        ? {
                            ...q,
                            sub_questions: q.sub_questions.filter(sqId => sqId !== id),
                            updated_at: new Date().toISOString(),
                        }
                        : q
                )
            );
        }
        // 删除相关的回答
        setAnswers(prev => prev.filter(a => a.question_id !== id));
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'delete',
                entity: 'subQuestion',
                id,
                timestamp: new Date().toISOString(),
            });
        }
    }, [subQuestions, isAuthenticated, mode]);

    // 添加回答
    const addAnswer = useCallback(async (answer: TimelineAnswer) => {
        setAnswers(prev => [...prev, answer]);
        // 更新小问题的answers数组
        setSubQuestions(prev =>
            prev.map(sq =>
                sq.id === answer.question_id
                    ? { ...sq, answers: [...sq.answers, answer.id], updated_at: new Date().toISOString() }
                    : sq
            )
        );
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'create',
                entity: 'answer',
                id: answer.id,
                data: answer,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 更新回答
    const updateAnswer = useCallback(async (id: string, updates: Partial<TimelineAnswer>) => {
        setAnswers(prev =>
            prev.map(a => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a))
        );
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'update',
                entity: 'answer',
                id,
                data: updates,
                timestamp: new Date().toISOString(),
            });
        }
    }, [isAuthenticated, mode]);

    // 删除回答
    const deleteAnswer = useCallback(async (id: string) => {
        const answer = answers.find(a => a.id === id);
        setAnswers(prev => prev.filter(a => a.id !== id));
        // 从小问题的answers数组中移除
        if (answer) {
            setSubQuestions(prev =>
                prev.map(sq =>
                    sq.id === answer.question_id
                        ? { ...sq, answers: sq.answers.filter(aId => aId !== id) }
                        : sq
                )
            );
        }
        // 如果是拥有者模式且已认证，触发同步
        if (isAuthenticated && mode === 'owner') {
            await syncService.addPendingChange({
                type: 'delete',
                entity: 'answer',
                id,
                timestamp: new Date().toISOString(),
            });
        }
    }, [answers, isAuthenticated, mode]);

    // 根据父ID获取小问题
    const getSubQuestionsByParent = useCallback(
        (parentId: string) => {
            return subQuestions.filter(sq => sq.parent_id === parentId);
        },
        [subQuestions]
    );

    // 根据问题ID获取回答
    const getAnswersByQuestion = useCallback(
        (questionId: string) => {
            return answers.filter(a => a.question_id === questionId);
        },
        [answers]
    );

    // 获取小问题数量
    const getSubQuestionCount = useCallback(
        (questionId: string) => {
            return subQuestions.filter(sq => sq.parent_id === questionId).length;
        },
        [subQuestions]
    );

    // 筛选和排序问题
    const filteredQuestions = React.useMemo(() => {
        let filtered = questions;

        // 状态筛选
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(q => q.status === selectedStatus);
        }

        // 分类筛选
        if (selectedCategory) {
            filtered = filtered.filter(q => q.category === selectedCategory);
        }

        // 排序
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sorted;
    }, [questions, selectedStatus, selectedCategory, sortOption]);

    // 手动同步
    const syncNow = useCallback(async () => {
        if (isAuthenticated && mode === 'owner') {
            const result = await syncService.syncNow();
            if (result.success) {
                const newLastSync = await syncService.getLastSyncTime();
                setLastSyncTime(newLastSync);
            }
        }
    }, [isAuthenticated, mode]);

    const value: QAContextState = {
        questions,
        subQuestions,
        answers,
        selectedStatus,
        selectedCategory,
        sortOption,
        setQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        setSubQuestions,
        addSubQuestion,
        updateSubQuestion,
        deleteSubQuestion,
        setAnswers,
        addAnswer,
        updateAnswer,
        deleteAnswer,
        setSelectedStatus,
        setSelectedCategory,
        setSortOption,
        filteredQuestions,
        categories,
        getSubQuestionsByParent,
        getAnswersByQuestion,
        getSubQuestionCount,
        syncStatus,
        syncNow,
        lastSyncTime,
    };

    return <QAContext.Provider value={value}>{children}</QAContext.Provider>;
};

// Hook to use QAContext
export const useQA = (): QAContextState => {
    const context = useContext(QAContext);
    if (!context) {
        throw new Error('useQA must be used within a QAProvider');
    }
    return context;
};
