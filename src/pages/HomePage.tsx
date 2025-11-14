/**
 * 主页组件
 * 整合资源导航区域和问答板区域
 */

import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ResourceSection } from '@/components/layout/ResourceSection';
import { QASection } from '@/components/layout/QASection';
import LoadingState from '@/components/common/LoadingState';
import Toast from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { useResources } from '@/contexts/ResourceContext';
import { useQA } from '@/contexts/QAContext';
import { useAuth } from '@/contexts/AuthContext';
import { ModeIndicator } from '@/components/common/ModeIndicator';
import { SyncIndicator } from '@/components/sync/SyncIndicator';
import { ShareButton } from '@/components/share/ShareButton';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { Category } from '@/components/resource/CategoryFilter';

// 懒加载大型组件以优化初始加载性能
const QuestionModalWithEdit = lazy(() => import('@/components/qa/QuestionModalWithEdit').then(module => ({ default: module.QuestionModalWithEdit })));
const EditorDrawer = lazy(() => import('@/components/editor/EditorDrawer').then(module => ({ default: module.EditorDrawer })));
const EditorForm = lazy(() => import('@/components/editor/EditorForm').then(module => ({ default: module.EditorForm })));

// 分类配置
const categories: Category[] = [
    { id: '', name: '全部' },
    { id: 'AI学习', name: 'AI学习' },
    { id: '编程', name: '编程' },
    { id: '设计', name: '设计' },
];

export const HomePage: React.FC = () => {
    // Toast通知系统
    const { toasts, showToast } = useToast();

    // 使用 Context 获取真实数据
    const { resources, addResource, updateResource, deleteResource } = useResources();
    const {
        questions,
        subQuestions,
        answers,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addSubQuestion,
        updateSubQuestion,
        deleteSubQuestion,
        addAnswer,
        updateAnswer,
        deleteAnswer,
    } = useQA();
    const { mode } = useAuth();

    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

    // 编辑器抽屉状态
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorType, setEditorType] = useState<'resource' | 'question' | 'subQuestion' | 'answer' | 'summary'>('resource');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editorData, setEditorData] = useState<any>({});

    // 小问题数量统计
    const subQuestionCounts = questions.reduce((acc, q) => {
        acc[q.id] = q.sub_questions.length;
        return acc;
    }, {} as Record<string, number>);

    // 获取选中问题的详细信息
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
    const selectedSubQuestions = selectedQuestion
        ? subQuestions.filter(sq => selectedQuestion.sub_questions.includes(sq.id))
        : [];
    const answersMap: Record<string, TimelineAnswer[]> = {};
    selectedSubQuestions.forEach(sq => {
        answersMap[sq.id] = answers.filter(ans => ans.question_id === sq.id);
    });

    // 更新问题
    const handleUpdateQuestion = async (updates: Partial<BigQuestion>) => {
        if (!selectedQuestionId) return;
        await updateQuestion(selectedQuestionId, updates);
    };

    // 更新问题状态
    const handleStatusChange = async (status: string) => {
        if (!selectedQuestionId) return;
        await updateQuestion(selectedQuestionId, { status: status as any });
    };

    // 保存小问题
    const handleSaveSubQuestion = async (id: string, updates: Partial<SubQuestion>) => {
        await updateSubQuestion(id, updates);
    };

    // 创建新小问题
    const handleCreateSubQuestion = async (data: { title: string; status: any }) => {
        if (!selectedQuestionId) return;

        const newSubQuestion: Omit<SubQuestion, 'id' | 'created_at' | 'updated_at'> = {
            parent_id: selectedQuestionId,
            title: data.title,
            status: data.status,
            answers: [],
        };

        await addSubQuestion(newSubQuestion);
    };

    // 保存回答
    const handleSaveAnswer = async (id: string, content: string) => {
        await updateAnswer(id, { content });
    };

    // 创建新回答
    const handleCreateAnswer = async (subQuestionId: string, content: string) => {
        const newAnswer: Omit<TimelineAnswer, 'id' | 'created_at' | 'updated_at'> = {
            question_id: subQuestionId,
            content,
            timestamp: new Date().toISOString(),
        };

        await addAnswer(newAnswer);
    };

    // ========== 资源CRUD功能 ==========

    // 添加资源
    const handleAddResource = () => {
        setEditorType('resource');
        setEditingId(null);
        setEditorData({
            title: '',
            url: '',
            category: categories[1]?.id || '',
            author: '',
            recommendation: '',
        });
        setIsEditorOpen(true);
    };

    // 编辑资源
    const handleEditResource = (id: string) => {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;

        setEditorType('resource');
        setEditingId(id);
        setEditorData({
            title: resource.title,
            url: resource.url,
            cover: resource.cover,
            category: resource.category,
            author: resource.author,
            recommendation: resource.recommendation,
            tags: resource.content_tags,
        });
        setIsEditorOpen(true);
    };

    // 删除资源
    const handleDeleteResource = async (id: string) => {
        if (confirm('确定要删除这个资源吗？')) {
            await deleteResource(id);
            showToast('success', '资源已删除');
        }
    };

    // 保存资源
    const handleSaveResource = async () => {
        if (!editorData.title || !editorData.url) {
            showToast('error', '请填写标题和链接');
            return;
        }

        if (editingId) {
            // 更新现有资源
            const resource = resources.find(r => r.id === editingId);
            if (resource) {
                await updateResource(editingId, {
                    title: editorData.title,
                    url: editorData.url,
                    cover: editorData.cover || resource.cover,
                    category: editorData.category || resource.category,
                    author: editorData.author || resource.author,
                    recommendation: editorData.recommendation || resource.recommendation,
                    content_tags: editorData.tags || resource.content_tags,
                });
                showToast('success', '资源已更新');
            }
        } else {
            // 创建新资源
            const newResource: Omit<Resource, 'id' | 'created_at' | 'updated_at'> = {
                title: editorData.title,
                url: editorData.url,
                type: 'blog', // 默认类型
                cover: editorData.cover || 'https://via.placeholder.com/320x180/0047AB/FFFFFF?text=New+Resource',
                platform: 'Web',
                content_tags: editorData.tags || [],
                category: editorData.category || '其他',
                author: editorData.author || '未知',
                recommendation: editorData.recommendation || '',
                metadata: {},
            };
            await addResource(newResource);
            showToast('success', '资源已添加');
        }

        setIsEditorOpen(false);
    };

    // ========== 大问题CRUD功能 ==========

    // 添加大问题
    const handleAddQuestion = () => {
        setEditorType('question');
        setEditingId(null);
        setEditorData({
            title: '',
            description: '',
            category: '技术',
            status: 'unsolved',
        });
        setIsEditorOpen(true);
    };

    // 编辑大问题
    const handleEditQuestion = (id: string) => {
        const question = questions.find(q => q.id === id);
        if (!question) return;

        setEditorType('question');
        setEditingId(id);
        setEditorData({
            title: question.title,
            description: question.description,
            category: question.category,
            status: question.status,
        });
        setIsEditorOpen(true);
    };

    // 删除大问题
    const handleDeleteQuestion = async (id: string) => {
        if (confirm('确定要删除这个大问题吗？相关的小问题和回答也会被删除。')) {
            await deleteQuestion(id);

            // 如果当前打开的就是这个问题，关闭弹窗
            if (selectedQuestionId === id) {
                setSelectedQuestionId(null);
            }

            showToast('success', '问题已删除');
        }
    };

    // 保存大问题
    const handleSaveQuestion = async () => {
        if (!editorData.title) {
            showToast('error', '请填写问题标题');
            return;
        }

        if (editingId) {
            // 更新现有问题
            await updateQuestion(editingId, {
                title: editorData.title,
                description: editorData.description,
                category: editorData.category,
                status: editorData.status,
            });
            showToast('success', '问题已更新');
        } else {
            // 创建新问题
            const newQuestion: Omit<BigQuestion, 'id' | 'created_at' | 'updated_at'> = {
                title: editorData.title,
                description: editorData.description || '',
                status: editorData.status || 'unsolved',
                category: editorData.category || '技术',
                summary: '',
                sub_questions: [],
            };
            await addQuestion(newQuestion);
            showToast('success', '问题已添加');
        }

        setIsEditorOpen(false);
    };

    // ========== 小问题删除功能 ==========

    const handleDeleteSubQuestion = async (id: string) => {
        if (confirm('确定要删除这个小问题吗？相关的回答也会被删除。')) {
            await deleteSubQuestion(id);
            showToast('success', '小问题已删除');
        }
    };

    // ========== 回答删除功能 ==========

    const handleDeleteAnswer = async (id: string) => {
        if (confirm('确定要删除这个回答吗？')) {
            await deleteAnswer(id);
            showToast('success', '回答已删除');
        }
    };

    // ========== 编辑器保存功能 ==========

    const handleEditorSave = () => {
        switch (editorType) {
            case 'resource':
                handleSaveResource();
                break;
            case 'question':
                handleSaveQuestion();
                break;
            default:
                setIsEditorOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 顶部栏 */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-[#0047AB]">个人知识管理</h1>
                        <ModeIndicator />
                    </div>
                    <div className="flex items-center gap-4">
                        {mode === 'owner' && (
                            <>
                                <SyncIndicator />
                                <ShareButton showText={false} className="!px-3 !py-2" />
                            </>
                        )}
                        <Link
                            to="/settings"
                            className="text-gray-600 hover:text-[#0047AB] transition-colors"
                        >
                            设置
                        </Link>
                    </div>
                </div>
            </div>

            {/* 页面标题 */}
            <header className="bg-[#0047AB] text-white text-center py-10">
                <h1 className="text-4xl font-bold mb-2">
                    个人知识管理系统
                </h1>
                <p className="text-lg opacity-90">
                    记录学习、整理知识、持续成长
                </p>
            </header>

            {/* 主内容区域 */}
            <main className="max-w-[1400px] mx-auto px-5 py-10">
                {/* 资源导航区域 */}
                <section className="mb-16">
                    <ResourceSection
                        resources={resources}
                        categories={categories}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                        onAdd={handleAddResource}
                        onTagClick={(tag) => console.log(`点击标签: ${tag}`)}
                    />
                </section>

                {/* 问答板区域 */}
                <section className="mb-16">
                    <QASection
                        questions={questions}
                        subQuestionCounts={subQuestionCounts}
                        onQuestionClick={(id) => setSelectedQuestionId(id)}
                        onAddQuestion={handleAddQuestion}
                    />
                </section>
            </main>

            {/* 页脚 */}
            <footer className="bg-[#F5F5F5] text-center py-6 text-sm text-[#666]">
                <p>© 2024 个人知识管理系统. All rights reserved.</p>
            </footer>

            {/* 问题详情弹窗（带编辑功能） - 使用Suspense包裹懒加载组件 */}
            {selectedQuestion && (
                <Suspense fallback={<LoadingState message="加载中..." />}>
                    <QuestionModalWithEdit
                        question={selectedQuestion}
                        subQuestions={selectedSubQuestions}
                        answers={answersMap}
                        isOpen={!!selectedQuestionId}
                        onClose={() => setSelectedQuestionId(null)}
                        onSave={handleUpdateQuestion}
                        onStatusChange={handleStatusChange}
                        onEdit={() => handleEditQuestion(selectedQuestionId!)}
                        onDelete={() => handleDeleteQuestion(selectedQuestionId!)}
                        onSaveSubQuestion={handleSaveSubQuestion}
                        onCreateSubQuestion={handleCreateSubQuestion}
                        onDeleteSubQuestion={handleDeleteSubQuestion}
                        onSaveAnswer={handleSaveAnswer}
                        onCreateAnswer={handleCreateAnswer}
                        onDeleteAnswer={handleDeleteAnswer}
                    />
                </Suspense>
            )}

            {/* 编辑器抽屉 - 使用Suspense包裹懒加载组件 */}
            <Suspense fallback={<LoadingState message="加载编辑器..." />}>
                <EditorDrawer
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleEditorSave}
                    title={
                        editorType === 'resource'
                            ? editingId ? '编辑资源' : '添加资源'
                            : editingId ? '编辑大问题' : '添加大问题'
                    }
                >
                    <EditorForm
                        type={editorType}
                        data={editorData}
                        onChange={setEditorData}
                        categories={categories.map(c => c.id).filter(id => id)}
                    />
                </EditorDrawer>
            </Suspense>

            {/* Toast通知容器 */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={toast.onClose}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
