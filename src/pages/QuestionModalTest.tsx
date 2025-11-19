/**
 * QuestionModalWithEdit 测试页面
 * 用于测试问题弹窗的所有功能
 */

import React, { useState } from 'react';
import { QuestionModalWithEdit } from '@/components/qa/QuestionModalWithEdit';
import { Button } from '@/components/ui/Button';
import type { BigQuestion, SubQuestion, TimelineAnswer, QuestionStatus } from '@/types/question';

const testQuestion: BigQuestion = {
    id: 'test_q_001',
    title: '测试大问题：如何学习React',
    description: '我想系统学习React框架，应该从哪里开始？需要掌握哪些前置知识？',
    status: 'solving',
    category: '技术',
    summary: '通过官方文档和实践项目，逐步掌握React核心概念。',
    sub_questions: ['test_sq_001', 'test_sq_002'],
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
};

const testSubQuestions: SubQuestion[] = [
    {
        id: 'test_sq_001',
        parent_id: 'test_q_001',
        title: 'React的核心概念有哪些？',
        status: 'solved',
        answers: ['test_ans_001', 'test_ans_002'],
        created_at: '2025-01-01T10:00:00Z',
        updated_at: '2025-01-05T10:00:00Z',
    },
    {
        id: 'test_sq_002',
        parent_id: 'test_q_001',
        title: '如何搭建React开发环境？',
        status: 'solving',
        answers: ['test_ans_003'],
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-10T10:00:00Z',
    },
];

const testAnswers: TimelineAnswer[] = [
    {
        id: 'test_ans_001',
        question_id: 'test_sq_001',
        content: 'React的核心概念包括：组件、Props、State、生命周期、Hooks等。',
        timestamp: '2025-01-02T10:00:00Z',
        created_at: '2025-01-02T10:00:00Z',
        updated_at: '2025-01-02T10:00:00Z',
    },
    {
        id: 'test_ans_002',
        question_id: 'test_sq_001',
        content: '最重要的是理解**组件化思想**和**单向数据流**。',
        timestamp: '2025-01-05T10:00:00Z',
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-05T10:00:00Z',
    },
    {
        id: 'test_ans_003',
        question_id: 'test_sq_002',
        content: '推荐使用Vite创建项目：`npm create vite@latest my-app -- --template react-ts`',
        timestamp: '2025-01-10T10:00:00Z',
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-10T10:00:00Z',
    },
];

export const QuestionModalTest: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState<BigQuestion>(testQuestion);
    const [subQuestions, setSubQuestions] = useState<SubQuestion[]>(testSubQuestions);
    const [answers, setAnswers] = useState<TimelineAnswer[]>(testAnswers);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
        console.log(message);
    };

    const answersMap: Record<string, TimelineAnswer[]> = {};
    subQuestions.forEach(sq => {
        answersMap[sq.id] = answers.filter(ans => ans.question_id === sq.id);
    });

    const handleSave = async (updates: Partial<BigQuestion>) => {
        addLog(`💾 保存问题更新: ${JSON.stringify(updates, null, 2)}`);
        setQuestion(prev => ({
            ...prev,
            ...updates,
            updated_at: new Date().toISOString(),
        }));
        addLog('✅ 问题更新成功');
    };

    const handleStatusChange = (status: QuestionStatus) => {
        addLog(`🔄 修改状态为: ${status}`);
        setQuestion(prev => ({
            ...prev,
            status,
            updated_at: new Date().toISOString(),
        }));
        addLog('✅ 状态更新成功');
    };

    const handleSaveSubQuestion = async (id: string, updates: Partial<SubQuestion>) => {
        addLog(`💾 保存小问题: ${id}, 更新: ${JSON.stringify(updates)}`);
        setSubQuestions(prev => prev.map(sq =>
            sq.id === id
                ? { ...sq, ...updates, updated_at: new Date().toISOString() }
                : sq
        ));
        addLog('✅ 小问题更新成功');
    };

    const handleCreateSubQuestion = async (data: { title: string; status: QuestionStatus }) => {
        addLog(`➕ 创建新小问题: ${data.title}, 状态: ${data.status}`);
        const newSubQuestion: SubQuestion = {
            id: `test_sq_${Date.now()}`,
            parent_id: question.id,
            title: data.title,
            status: data.status,
            answers: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setSubQuestions(prev => [...prev, newSubQuestion]);
        setQuestion(prev => ({
            ...prev,
            sub_questions: [...prev.sub_questions, newSubQuestion.id],
        }));
        addLog('✅ 小问题创建成功');
    };

    const handleSaveAnswer = async (id: string, content: string) => {
        addLog(`💾 保存回答: ${id}`);
        setAnswers(prev => prev.map(ans =>
            ans.id === id
                ? { ...ans, content, updated_at: new Date().toISOString() }
                : ans
        ));
        addLog('✅ 回答更新成功');
    };

    const handleCreateAnswer = async (subQuestionId: string, content: string) => {
        addLog(`➕ 创建新回答到小问题: ${subQuestionId}`);
        const newAnswer: TimelineAnswer = {
            id: `test_ans_${Date.now()}`,
            question_id: subQuestionId,
            content,
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setAnswers(prev => [...prev, newAnswer]);
        setSubQuestions(prev => prev.map(sq =>
            sq.id === subQuestionId
                ? { ...sq, answers: [...sq.answers, newAnswer.id] }
                : sq
        ));
        addLog('✅ 回答创建成功');
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-8">
            <div className="max-w-6xl mx-auto">
                {/* 标题 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-[#333] mb-2">
                        QuestionModalWithEdit 测试页面
                    </h1>
                    <p className="text-[#666]">
                        测试问题弹窗的所有功能，包括编辑、状态切换、小问题管理等
                    </p>
                </div>

                {/* 控制面板 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">控制面板</h2>
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setIsOpen(true);
                                addLog('🚀 打开问题弹窗');
                            }}
                        >
                            打开问题弹窗
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setLogs([]);
                                addLog('🧹 清空日志');
                            }}
                        >
                            清空日志
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setQuestion(testQuestion);
                                addLog('🔄 重置问题数据');
                            }}
                        >
                            重置数据
                        </Button>
                    </div>
                </div>

                {/* 当前问题状态 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">当前问题状态</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div>
                            <span className="text-[#666]">标题：</span>
                            <span className="text-[#333]">{question.title}</span>
                        </div>
                        <div>
                            <span className="text-[#666]">状态：</span>
                            <span className="text-[#333] font-semibold">{question.status}</span>
                        </div>
                        <div>
                            <span className="text-[#666]">描述长度：</span>
                            <span className="text-[#333]">{question.description.length} 字符</span>
                        </div>
                        <div>
                            <span className="text-[#666]">总结长度：</span>
                            <span className="text-[#333]">{question.summary?.length || 0} 字符</span>
                        </div>
                        <div>
                            <span className="text-[#666]">更新时间：</span>
                            <span className="text-[#333]">{new Date(question.updated_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* 操作日志 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">
                        操作日志 ({logs.length})
                    </h2>
                    <div className="bg-[#F5F5F5] rounded p-4 max-h-[400px] overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-[#999] text-center py-4">暂无日志</p>
                        ) : (
                            <div className="space-y-1 font-mono text-sm">
                                {logs.map((log, index) => (
                                    <div key={index} className="text-[#333]">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 测试说明 */}
                <div className="bg-[#E3F2FD] rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold text-[#0047AB] mb-4">测试说明</h2>
                    <div className="space-y-2 text-[#333]">
                        <p>✅ <strong>问题状态切换</strong>：点击弹窗右上角的状态下拉菜单</p>
                        <p>✅ <strong>编辑问题描述</strong>：点击"问题描述"区域的"编辑"按钮</p>
                        <p>✅ <strong>编辑最终总结</strong>：点击"THE END - 最终总结"区域的"编辑"按钮</p>
                        <p>⚠️ <strong>小问题功能</strong>：点击小问题的按钮会显示"功能开发中"提示</p>
                    </div>
                </div>
            </div>

            {/* 问题弹窗 */}
            <QuestionModalWithEdit
                question={question}
                subQuestions={subQuestions}
                answers={answersMap}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    addLog('❌ 关闭问题弹窗');
                }}
                onSave={handleSave}
                onStatusChange={handleStatusChange}
                onSaveSubQuestion={handleSaveSubQuestion}
                onCreateSubQuestion={handleCreateSubQuestion}
                onSaveAnswer={handleSaveAnswer}
                onCreateAnswer={handleCreateAnswer}
            />
        </div>
    );
};

export default QuestionModalTest;
