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
import { ModeSwitcherModal } from '@/components/mode/ModeSwitcherModal';
import { generatePlaceholder } from '@/utils/placeholderUtils';
import { getVideoThumbnail } from '@/utils/videoThumbnailUtils';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { Category } from '@/components/resource/CategoryFilter';

// 懒加载大型组件以优化初始加载性能
const QuestionModalWithEdit = lazy(() => import('@/components/qa/QuestionModalWithEdit').then(module => ({ default: module.QuestionModalWithEdit })));
const EditorDrawer = lazy(() => import('@/components/editor/EditorDrawer').then(module => ({ default: module.EditorDrawer })));
const EditorForm = lazy(() => import('@/components/editor/EditorForm').then(module => ({ default: module.EditorForm })));

export const HomePage: React.FC = () => {
    // Toast通知系统
    const { toasts, showToast } = useToast();

    // 使用 Context 获取真实数据
    const { resources, categories: resourceCategories, addResource, updateResource, deleteResource } = useResources();
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
    const { mode, switchMode } = useAuth();

    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

    // 模式切换弹窗状态
    const [isModeSwitcherOpen, setIsModeSwitcherOpen] = useState(false);

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

        const now = new Date().toISOString();
        const newSubQuestion: SubQuestion = {
            id: `subquestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            parent_id: selectedQuestionId,
            title: data.title,
            status: data.status,
            answers: [],
            created_at: now,
            updated_at: now,
        };

        await addSubQuestion(newSubQuestion);
    };

    // 保存回答
    const handleSaveAnswer = async (id: string, content: string) => {
        await updateAnswer(id, { content });
    };

    // 创建新回答
    const handleCreateAnswer = async (subQuestionId: string, content: string) => {
        const now = new Date().toISOString();
        const newAnswer: TimelineAnswer = {
            id: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            question_id: subQuestionId,
            content,
            timestamp: now,
            created_at: now,
            updated_at: now,
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
            category: resourceCategories[0] || '',
            author: '',
            recommendation: '',
            isWandering: false,
        });
        setIsEditorOpen(true);
    };

    // 将动态分类转换为 Category[] 格式
    const categories: Category[] = React.useMemo(() => {
        return [
            { id: '', name: '全部' },
            ...resourceCategories.map(cat => ({ id: cat, name: cat }))
        ];
    }, [resourceCategories]);

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
            isWandering: resource.isWandering || false,
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
                    isWandering: editorData.isWandering !== undefined ? editorData.isWandering : resource.isWandering,
                });
                showToast('success', '资源已更新');
            }
        } else {
            // 创建新资源
            // 如果是视频类型且没有封面，自动获取缩略图
            let cover = editorData.cover;
            if (!cover && editorData.type && (editorData.type === 'youtube_video' || editorData.type === 'bilibili_video') && editorData.url) {
                cover = getVideoThumbnail(editorData.url, editorData.type);
            }

            const now = new Date().toISOString();
            const newResource: Resource = {
                id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: editorData.title,
                url: editorData.url,
                type: editorData.type || 'blog', // 使用用户选择的类型
                cover: cover || generatePlaceholder({
                    backgroundColor: '#0047AB',
                    textColor: '#FFFFFF',
                    text: 'New Resource'
                }),
                platform: 'Web',
                content_tags: editorData.tags || [],
                category: editorData.category || '其他',
                author: editorData.author || '未知',
                recommendation: editorData.recommendation || '',
                metadata: {},
                isWandering: editorData.isWandering || false,
                created_at: now,
                updated_at: now,
            };
            console.log('[HomePage] 准备添加资源:', {
                title: newResource.title,
                category: newResource.category,
                isWandering: newResource.isWandering,
                editorData
            });
            await addResource(newResource);
            console.log('[HomePage] 资源已添加');
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
            const now = new Date().toISOString();
            const newQuestion: BigQuestion = {
                id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: editorData.title,
                description: editorData.description || '',
                status: editorData.status || 'unsolved',
                category: editorData.category || '技术',
                summary: '',
                sub_questions: [],
                created_at: now,
                updated_at: now,
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

    // ========== 模式切换功能 ==========

    const handleModeChange = async (newMode: typeof mode) => {
        try {
            await switchMode(newMode);
            showToast('success', `已切换到${newMode === 'owner' ? '拥有者' : '访客'}模式`);
        } catch (error) {
            console.error('模式切换失败:', error);
            showToast('error', '模式切换失败，请重试');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部栏 - 统一背景色 */}
            <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ModeIndicator onClick={() => setIsModeSwitcherOpen(true)} />
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
                            className="text-text-secondary hover:text-primary transition-colors duration-200"
                        >
                            设置
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero 区域 - 统一背景色 */}
            <header className="bg-gray-50 text-primary py-12 md:py-16 px-5 md:px-10">
                <div className="max-w-[1400px] mx-auto">
                    {/* 主标题 - 大号加粗蓝色文字，左对齐，带描边效果 */}
                    <h1
                        className="text-5xl md:text-7xl font-bold mb-6"
                        style={{
                            WebkitTextStroke: '2px #0033FF',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        流浪日记
                    </h1>

                    {/* 副标题/描述区域 */}
                    <div className="text-base md:text-lg font-bold mb-6">
                        <p className="mb-2">
                            a collection of the best resources for learning
                        </p>
                        <p className="mb-2">
                            from the Internet, hand-picked and curated by{' '}
                            <a
                                href="https://github.com/dunature/personal-knowledge-website"
                                className="underline hover:text-primary-hover transition-colors duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                dunature
                            </a>
                            .
                        </p>
                    </div>

                    {/* 关键特性列表 */}
                    <div className="text-base md:text-lg font-bold">
                        <p className="mb-3">this all :</p>
                        <ul className="space-y-2">
                            <li>- The Collector</li>
                            <li>- The Journalist</li>
                            <li>- The Craftsman</li>
                            <li>- The Storyteller</li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* 渐变分割线 */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            {/* 主内容区域 - 统一背景色 */}
            <main className="bg-gray-50 max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16 space-y-12 md:space-y-16">
                {/* 资源导航区域 */}
                <section>
                    <ResourceSection
                        resources={resources}
                        categories={categories}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                        onAdd={handleAddResource}
                        onTagClick={(tag) => console.log(`点击标签: ${tag}`)}
                    />
                </section>

                {/* 渐变分割线 */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                {/* 问答板区域 */}
                <section>
                    <QASection
                        questions={questions}
                        subQuestionCounts={subQuestionCounts}
                        onQuestionClick={(id) => setSelectedQuestionId(id)}
                        onAddQuestion={handleAddQuestion}
                    />
                </section>
            </main>

            {/* 渐变分割线 */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            {/* 页脚 - 统一背景色 */}
            <footer className="bg-gray-50 text-center py-6 text-sm text-text-secondary">
                <p>© 2025 流浪日记. All rights reserved.</p>
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
                        categories={resourceCategories}
                    />
                </EditorDrawer>
            </Suspense>

            {/* 模式切换弹窗 */}
            <ModeSwitcherModal
                isOpen={isModeSwitcherOpen}
                onClose={() => setIsModeSwitcherOpen(false)}
                currentMode={mode}
                onModeChange={handleModeChange}
            />

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
