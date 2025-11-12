/**
 * 主页组件
 * 整合资源导航区域和问答板区域
 */

import React, { useState, lazy, Suspense } from 'react';
import { ResourceSection } from '@/components/layout/ResourceSection';
import { QASection } from '@/components/layout/QASection';
import LoadingState from '@/components/common/LoadingState';
import Toast from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { ResourceProvider } from '@/contexts/ResourceContext';
import { QAProvider } from '@/contexts/QAContext';
import type { Resource } from '@/types/resource';
import type { BigQuestion, SubQuestion, TimelineAnswer } from '@/types/question';
import type { Category } from '@/components/resource/CategoryFilter';
import { generatePlaceholder, PLACEHOLDER_COLORS } from '@/utils/placeholderUtils';

// 懒加载大型组件以优化初始加载性能
const QuestionModalWithEdit = lazy(() => import('@/components/qa/QuestionModalWithEdit').then(module => ({ default: module.QuestionModalWithEdit })));
const EditorDrawer = lazy(() => import('@/components/editor/EditorDrawer').then(module => ({ default: module.EditorDrawer })));
const EditorForm = lazy(() => import('@/components/editor/EditorForm').then(module => ({ default: module.EditorForm })));

// 示例数据
const sampleResources: Resource[] = [
    {
        id: 'res_001',
        title: 'Deep Dive into React Hooks',
        url: 'https://youtube.com/watch?v=example',
        type: 'youtube_video',
        cover: generatePlaceholder({ backgroundColor: PLACEHOLDER_COLORS.blue, text: 'React Hooks' }),
        platform: 'YouTube',
        content_tags: ['Fundamentals', 'Tutorial', 'Deep Dive'],
        category: '编程',
        author: 'Tech Channel',
        recommendation: '深入讲解React Hooks的最佳实践',
        metadata: { duration: '45:30' },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: 'res_002',
        title: 'TypeScript Best Practices',
        url: 'https://blog.example.com/typescript',
        type: 'blog',
        cover: generatePlaceholder({ backgroundColor: PLACEHOLDER_COLORS.green, text: 'TypeScript' }),
        platform: 'Medium',
        content_tags: ['Fundamentals', 'Best Practices'],
        category: '编程',
        author: 'John Doe',
        recommendation: 'TypeScript开发必读文章',
        metadata: { read_time: 10 },
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
    },
    {
        id: 'res_003',
        title: 'Awesome React Components',
        url: 'https://github.com/example/awesome-react',
        type: 'github',
        cover: generatePlaceholder({ backgroundColor: PLACEHOLDER_COLORS.orange, text: 'GitHub Repo' }),
        platform: 'GitHub',
        content_tags: ['Library', 'Framework'],
        category: '编程',
        author: 'awesome-react',
        recommendation: '精选React组件库集合',
        metadata: { stars: 15000, language: 'TypeScript' },
        created_at: '2024-01-05T10:00:00Z',
        updated_at: '2024-01-05T10:00:00Z',
    },
];

const categories: Category[] = [
    { id: '', name: '全部' },
    { id: 'AI学习', name: 'AI学习' },
    { id: '编程', name: '编程' },
    { id: '设计', name: '设计' },
];

const sampleQuestions: BigQuestion[] = [
    {
        id: 'q_001',
        title: '如何搭建个人博客',
        description: '我想搭建一个个人博客用于记录学习笔记，需要考虑哪些技术栈？',
        status: 'solving',
        category: '技术',
        summary: '最终选择了Hugo + GitHub Pages方案，简单高效。',
        sub_questions: ['sq_001', 'sq_002'],
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: 'q_002',
        title: 'React性能优化最佳实践',
        description: '在大型React应用中，如何进行性能优化？',
        status: 'solved',
        category: '技术',
        summary: '通过React.memo、useMemo、useCallback等方法成功优化。',
        sub_questions: ['sq_003'],
        created_at: '2023-12-20T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
    },
    {
        id: 'q_003',
        title: 'TypeScript类型系统深入理解',
        description: 'TypeScript的高级类型如何使用？',
        status: 'unsolved',
        category: '技术',
        summary: '',
        sub_questions: [],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
];

const sampleSubQuestions: SubQuestion[] = [
    {
        id: 'sq_001',
        parent_id: 'q_001',
        title: '选择什么技术栈',
        status: 'solved',
        answers: ['ans_001', 'ans_002'],
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-05T10:00:00Z',
    },
    {
        id: 'sq_002',
        parent_id: 'q_001',
        title: '如何部署到GitHub Pages',
        status: 'solving',
        answers: ['ans_003'],
        created_at: '2024-01-05T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
    },
];

const sampleAnswers: TimelineAnswer[] = [
    {
        id: 'ans_001',
        question_id: 'sq_001',
        content: '考虑了Jekyll、Hugo、Hexo三个静态网站生成器。',
        timestamp: '2024-01-02T10:00:00Z',
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
    },
    {
        id: 'ans_002',
        question_id: 'sq_001',
        content: '最终选择了Hugo，因为构建速度快，主题丰富。',
        timestamp: '2024-01-05T10:00:00Z',
        created_at: '2024-01-05T10:00:00Z',
        updated_at: '2024-01-05T10:00:00Z',
    },
    {
        id: 'ans_003',
        question_id: 'sq_002',
        content: '使用GitHub Actions自动部署，配置workflow文件。',
        timestamp: '2024-01-10T10:00:00Z',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
    },
];

export const HomePage: React.FC = () => {
    // Toast通知系统
    const { toasts, showToast } = useToast();

    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<BigQuestion[]>(sampleQuestions);
    const [subQuestions, setSubQuestions] = useState<SubQuestion[]>(sampleSubQuestions);
    const [answers, setAnswers] = useState<TimelineAnswer[]>(sampleAnswers);
    const [resources, setResources] = useState<Resource[]>(sampleResources);

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

        setQuestions(prev => prev.map(q =>
            q.id === selectedQuestionId
                ? { ...q, ...updates, updated_at: new Date().toISOString() }
                : q
        ));
    };

    // 更新问题状态
    const handleStatusChange = (status: string) => {
        if (!selectedQuestionId) return;

        setQuestions(prev => prev.map(q =>
            q.id === selectedQuestionId
                ? { ...q, status: status as any, updated_at: new Date().toISOString() }
                : q
        ));
    };

    // 保存小问题
    const handleSaveSubQuestion = async (id: string, updates: Partial<SubQuestion>) => {
        setSubQuestions(prev => prev.map(sq =>
            sq.id === id
                ? { ...sq, ...updates, updated_at: new Date().toISOString() }
                : sq
        ));
    };

    // 创建新小问题
    const handleCreateSubQuestion = async (data: { title: string; status: any }) => {
        if (!selectedQuestionId) return;

        const newSubQuestion: SubQuestion = {
            id: `sq_${Date.now()}`,
            parent_id: selectedQuestionId,
            title: data.title,
            status: data.status,
            answers: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setSubQuestions(prev => [...prev, newSubQuestion]);

        // 更新大问题的sub_questions数组
        setQuestions(prev => prev.map(q =>
            q.id === selectedQuestionId
                ? { ...q, sub_questions: [...q.sub_questions, newSubQuestion.id] }
                : q
        ));
    };

    // 保存回答
    const handleSaveAnswer = async (id: string, content: string) => {
        setAnswers(prev => prev.map(ans =>
            ans.id === id
                ? { ...ans, content, updated_at: new Date().toISOString() }
                : ans
        ));
    };

    // 创建新回答
    const handleCreateAnswer = async (subQuestionId: string, content: string) => {
        const newAnswer: TimelineAnswer = {
            id: `ans_${Date.now()}`,
            question_id: subQuestionId,
            content,
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setAnswers(prev => [...prev, newAnswer]);

        // 更新小问题的answers数组
        setSubQuestions(prev => prev.map(sq =>
            sq.id === subQuestionId
                ? { ...sq, answers: [...sq.answers, newAnswer.id] }
                : sq
        ));
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
    const handleDeleteResource = (id: string) => {
        if (confirm('确定要删除这个资源吗？')) {
            setResources(prev => prev.filter(r => r.id !== id));
            showToast('success', '资源已删除');
        }
    };

    // 保存资源
    const handleSaveResource = () => {
        if (!editorData.title || !editorData.url) {
            showToast('error', '请填写标题和链接');
            return;
        }

        if (editingId) {
            // 更新现有资源
            setResources(prev => prev.map(r =>
                r.id === editingId
                    ? {
                        ...r,
                        title: editorData.title,
                        url: editorData.url,
                        cover: editorData.cover || r.cover,
                        category: editorData.category || r.category,
                        author: editorData.author || r.author,
                        recommendation: editorData.recommendation || r.recommendation,
                        content_tags: editorData.tags || r.content_tags,
                        updated_at: new Date().toISOString(),
                    }
                    : r
            ));
            showToast('success', '资源已更新');
        } else {
            // 创建新资源
            const newResource: Resource = {
                id: `res_${Date.now()}`,
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
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setResources(prev => [...prev, newResource]);
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
    const handleDeleteQuestion = (id: string) => {
        if (confirm('确定要删除这个大问题吗？相关的小问题和回答也会被删除。')) {
            setQuestions(prev => prev.filter(q => q.id !== id));
            setSubQuestions(prev => prev.filter(sq => sq.parent_id !== id));
            // 删除相关回答
            const subQuestionIds = subQuestions
                .filter(sq => sq.parent_id === id)
                .map(sq => sq.id);
            setAnswers(prev => prev.filter(a => !subQuestionIds.includes(a.question_id)));

            // 如果当前打开的就是这个问题，关闭弹窗
            if (selectedQuestionId === id) {
                setSelectedQuestionId(null);
            }

            showToast('success', '问题已删除');
        }
    };

    // 保存大问题
    const handleSaveQuestion = () => {
        if (!editorData.title) {
            showToast('error', '请填写问题标题');
            return;
        }

        if (editingId) {
            // 更新现有问题
            setQuestions(prev => prev.map(q =>
                q.id === editingId
                    ? {
                        ...q,
                        title: editorData.title,
                        description: editorData.description || q.description,
                        category: editorData.category || q.category,
                        status: editorData.status || q.status,
                        updated_at: new Date().toISOString(),
                    }
                    : q
            ));
            showToast('success', '问题已更新');
        } else {
            // 创建新问题
            const newQuestion: BigQuestion = {
                id: `q_${Date.now()}`,
                title: editorData.title,
                description: editorData.description || '',
                status: editorData.status || 'unsolved',
                category: editorData.category || '技术',
                summary: '',
                sub_questions: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setQuestions(prev => [...prev, newQuestion]);
            showToast('success', '问题已添加');
        }

        setIsEditorOpen(false);
    };

    // ========== 小问题删除功能 ==========

    const handleDeleteSubQuestion = (id: string) => {
        if (confirm('确定要删除这个小问题吗？相关的回答也会被删除。')) {
            const subQuestion = subQuestions.find(sq => sq.id === id);
            setSubQuestions(prev => prev.filter(sq => sq.id !== id));

            // 从父问题的sub_questions数组中移除
            if (subQuestion) {
                setQuestions(prev => prev.map(q =>
                    q.id === subQuestion.parent_id
                        ? {
                            ...q,
                            sub_questions: q.sub_questions.filter(sqId => sqId !== id),
                            updated_at: new Date().toISOString(),
                        }
                        : q
                ));
            }

            // 删除相关回答
            setAnswers(prev => prev.filter(a => a.question_id !== id));
            showToast('success', '小问题已删除');
        }
    };

    // ========== 回答删除功能 ==========

    const handleDeleteAnswer = (id: string) => {
        if (confirm('确定要删除这个回答吗？')) {
            const answer = answers.find(a => a.id === id);
            setAnswers(prev => prev.filter(a => a.id !== id));

            // 从小问题的answers数组中移除
            if (answer) {
                setSubQuestions(prev => prev.map(sq =>
                    sq.id === answer.question_id
                        ? { ...sq, answers: sq.answers.filter(aId => aId !== id) }
                        : sq
                ));
            }
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
        <ResourceProvider initialResources={sampleResources}>
            <QAProvider
                initialQuestions={sampleQuestions}
                initialSubQuestions={sampleSubQuestions}
                initialAnswers={sampleAnswers}
            >
                <div className="min-h-screen bg-white">
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
            </QAProvider>
        </ResourceProvider>
    );
};

export default HomePage;
