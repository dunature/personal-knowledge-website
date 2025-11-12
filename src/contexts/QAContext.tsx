/**
 * 问答Context
 * 管理大问题、小问题、回答列表和筛选排序状态
 */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { BigQuestion, SubQuestion, TimelineAnswer, QuestionStatus } from '@/types/question';
import type { QuestionSortOption } from '@/components/qa/QuestionFilter';

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
    addQuestion: (question: BigQuestion) => void;
    updateQuestion: (id: string, updates: Partial<BigQuestion>) => void;
    deleteQuestion: (id: string) => void;

    // 小问题方法
    setSubQuestions: (subQuestions: SubQuestion[]) => void;
    addSubQuestion: (subQuestion: SubQuestion) => void;
    updateSubQuestion: (id: string, updates: Partial<SubQuestion>) => void;
    deleteSubQuestion: (id: string) => void;

    // 回答方法
    setAnswers: (answers: TimelineAnswer[]) => void;
    addAnswer: (answer: TimelineAnswer) => void;
    updateAnswer: (id: string, updates: Partial<TimelineAnswer>) => void;
    deleteAnswer: (id: string) => void;

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

    // 获取所有分类
    const categories = React.useMemo(() => {
        const cats = new Set(questions.map(q => q.category));
        return Array.from(cats);
    }, [questions]);

    // 添加大问题
    const addQuestion = useCallback((question: BigQuestion) => {
        setQuestions(prev => [...prev, question]);
    }, []);

    // 更新大问题
    const updateQuestion = useCallback((id: string, updates: Partial<BigQuestion>) => {
        setQuestions(prev =>
            prev.map(q => (q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q))
        );
    }, []);

    // 删除大问题
    const deleteQuestion = useCallback((id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        // 同时删除相关的小问题
        setSubQuestions(prev => prev.filter(sq => sq.parent_id !== id));
    }, []);

    // 添加小问题
    const addSubQuestion = useCallback((subQuestion: SubQuestion) => {
        setSubQuestions(prev => [...prev, subQuestion]);
        // 更新父问题的sub_questions数组
        setQuestions(prev =>
            prev.map(q =>
                q.id === subQuestion.parent_id
                    ? { ...q, sub_questions: [...q.sub_questions, subQuestion.id], updated_at: new Date().toISOString() }
                    : q
            )
        );
    }, []);

    // 更新小问题
    const updateSubQuestion = useCallback((id: string, updates: Partial<SubQuestion>) => {
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
    }, [subQuestions]);

    // 删除小问题
    const deleteSubQuestion = useCallback((id: string) => {
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
    }, [subQuestions]);

    // 添加回答
    const addAnswer = useCallback((answer: TimelineAnswer) => {
        setAnswers(prev => [...prev, answer]);
        // 更新小问题的answers数组
        setSubQuestions(prev =>
            prev.map(sq =>
                sq.id === answer.question_id
                    ? { ...sq, answers: [...sq.answers, answer.id], updated_at: new Date().toISOString() }
                    : sq
            )
        );
    }, []);

    // 更新回答
    const updateAnswer = useCallback((id: string, updates: Partial<TimelineAnswer>) => {
        setAnswers(prev =>
            prev.map(a => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a))
        );
    }, []);

    // 删除回答
    const deleteAnswer = useCallback((id: string) => {
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
    }, [answers]);

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
