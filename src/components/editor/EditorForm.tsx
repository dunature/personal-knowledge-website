/**
 * 编辑器表单组件
 * 根据类型动态显示不同的表单字段
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { MarkdownEditor } from './MarkdownEditor';
import { EditorToolbar } from './EditorToolbar';
import { ImageUploader } from './ImageUploader';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import { generatePlaceholder } from '@/utils/placeholderUtils';
import { getVideoThumbnail, getYouTubeVideoInfo } from '@/utils/videoThumbnailUtils';
import { getBilibiliVideoInfo, getGitHubRepoInfo } from '@/utils/platformInfoUtils';

export type EditorType = 'resource' | 'question' | 'subQuestion' | 'answer' | 'summary';

export interface EditorFormData {
    // 通用字段
    title?: string;
    content?: string;

    // 资源特定字段
    url?: string;
    cover?: string;
    type?: string;
    category?: string;
    tags?: string[];
    author?: string;
    recommendation?: string;
    isWandering?: boolean;

    // 问题特定字段
    status?: string;
    description?: string;
    summary?: string;

    // 回答特定字段
    timestamp?: string;
}

export interface EditorFormProps {
    type: EditorType;
    data: EditorFormData;
    onChange: (data: EditorFormData) => void;
    categories?: string[];
}

export const EditorForm: React.FC<EditorFormProps> = ({
    type,
    data,
    onChange,
    categories = [],
}) => {
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [currentField, setCurrentField] = useState<'content' | 'description' | 'summary'>('content');

    // 状态选项
    const statusOptions: DropdownOption[] = [
        { value: 'unsolved', label: '未解决' },
        { value: 'solving', label: '解决中' },
        { value: 'solved', label: '已解决' },
    ];

    // 分类选项 - 添加"新建分类"选项
    const categoryOptions: DropdownOption[] = React.useMemo(() => {
        console.log('[EditorForm] 生成分类选项:', {
            categories,
            currentCategory: data.category,
            isNewCategory: data.category && !categories.includes(data.category)
        });

        return [
            ...categories.map(cat => ({
                value: cat,
                label: cat,
            })),
            // 如果当前选中的分类不在列表中，添加它
            ...(data.category && !categories.includes(data.category) ? [{
                value: data.category,
                label: `${data.category} (新)`,
            }] : []),
            { value: '__new__', label: '+ 新建分类' },
        ];
    }, [categories, data.category]);

    // 新建分类状态
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // 更新字段
    const updateField = (field: keyof EditorFormData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // 自动获取资源信息
    const handleAutoFetchCover = async () => {
        if (!data.url) {
            console.log('[EditorForm] 没有 URL');
            return;
        }

        console.log('[EditorForm] 开始获取资源信息:', { url: data.url, type: data.type });

        if (data.type === 'youtube_video') {
            // YouTube 视频
            const videoInfo = await getYouTubeVideoInfo(data.url);
            console.log('[EditorForm] YouTube 视频信息:', videoInfo);

            if (videoInfo) {
                const updates: Partial<EditorFormData> = {
                    cover: videoInfo.thumbnail,
                };

                if (!data.title || data.title.trim() === '') {
                    updates.title = videoInfo.title;
                    console.log('[EditorForm] 将更新标题:', videoInfo.title);
                }
                if (!data.author || data.author.trim() === '' || data.author === '未知') {
                    updates.author = videoInfo.author;
                    console.log('[EditorForm] 将更新作者:', videoInfo.author);
                }

                console.log('[EditorForm] 应用更新:', updates);
                onChange({ ...data, ...updates });
            } else {
                console.log('[EditorForm] API 失败，使用缩略图');
                const thumbnail = getVideoThumbnail(data.url, 'youtube_video');
                updateField('cover', thumbnail);
            }
        } else if (data.type === 'bilibili_video') {
            // Bilibili 视频
            const videoInfo = await getBilibiliVideoInfo(data.url);
            console.log('[EditorForm] Bilibili 视频信息:', videoInfo);

            if (videoInfo) {
                const updates: Partial<EditorFormData> = {};

                // 使用 API 返回的封面，如果为空则使用占位图
                if (videoInfo.thumbnail && videoInfo.thumbnail.trim() !== '') {
                    updates.cover = videoInfo.thumbnail;
                    console.log('[EditorForm] 将更新封面:', videoInfo.thumbnail);
                } else {
                    console.log('[EditorForm] API 返回的封面为空，使用占位图');
                    updates.cover = getVideoThumbnail(data.url, 'bilibili_video');
                }

                if (!data.title || data.title.trim() === '') {
                    updates.title = videoInfo.title;
                    console.log('[EditorForm] 将更新标题:', videoInfo.title);
                }
                if (!data.author || data.author.trim() === '' || data.author === '未知') {
                    updates.author = videoInfo.author;
                    console.log('[EditorForm] 将更新作者:', videoInfo.author);
                }

                console.log('[EditorForm] 应用更新:', updates);
                onChange({ ...data, ...updates });
            } else {
                console.log('[EditorForm] API 失败，使用占位图');
                const thumbnail = getVideoThumbnail(data.url, 'bilibili_video');
                updateField('cover', thumbnail);
            }
        } else if (data.type === 'github_repo') {
            // GitHub 仓库
            const repoInfo = await getGitHubRepoInfo(data.url);
            console.log('[EditorForm] GitHub 仓库信息:', repoInfo);

            if (repoInfo) {
                const updates: Partial<EditorFormData> = {};

                if (!data.title || data.title.trim() === '') {
                    updates.title = repoInfo.title;
                    console.log('[EditorForm] 将更新标题:', repoInfo.title);
                }
                if (!data.author || data.author.trim() === '' || data.author === '未知') {
                    updates.author = repoInfo.author;
                    console.log('[EditorForm] 将更新作者:', repoInfo.author);
                }
                if (!data.recommendation || data.recommendation.trim() === '') {
                    updates.recommendation = repoInfo.description;
                    console.log('[EditorForm] 将更新推荐语:', repoInfo.description);
                }

                console.log('[EditorForm] 应用更新:', updates);
                onChange({ ...data, ...updates });
            }
        }
    };

    // 插入Markdown语法
    const handleInsert = (syntax: string, cursorOffset?: number) => {
        const content = data[currentField] || '';
        const textarea = document.querySelector(`textarea[data-field="${currentField}"]`) as HTMLTextAreaElement;

        if (!textarea) {
            updateField(currentField, content + syntax);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + syntax + content.substring(end);

        updateField(currentField, newContent);

        // 设置光标位置
        setTimeout(() => {
            const newPosition = start + syntax.length + (cursorOffset || 0);
            textarea.focus();
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    // 插入图片
    const handleImageInsert = (markdown: string) => {
        const content = data[currentField] || '';
        updateField(currentField, content + '\n' + markdown + '\n');
    };

    // 资源类型选项
    const resourceTypeOptions: DropdownOption[] = [
        { value: 'blog', label: '博客文章' },
        { value: 'youtube_video', label: 'YouTube 视频' },
        { value: 'bilibili_video', label: 'Bilibili 视频' },
        { value: 'github_repo', label: 'GitHub 仓库' },
        { value: 'tool', label: '工具' },
        { value: 'reddit_post', label: 'Reddit 帖子' },
    ];

    // 渲染资源表单
    const renderResourceForm = () => (
        <div className="space-y-4 p-4">
            {/* 流浪状态复选框 - 放在第一行 */}
            <div className="flex items-start gap-3 p-4 bg-[#FFF9E6] border-2 border-[#FFD700] rounded-lg">
                <input
                    type="checkbox"
                    id="isWandering"
                    checked={data.isWandering || false}
                    onChange={(e) => updateField('isWandering', e.target.checked)}
                    className="mt-1.5 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isWandering" className="flex-1 cursor-pointer">
                    <div className="text-lg font-bold text-[#333]">去流浪</div>
                    <div className="text-xs text-[#666] mt-1">
                        仅最新6个流浪资源会在首页展示。超出的旧资源会自动取消流浪状态。
                    </div>
                </label>
            </div>

            <Input
                label="标题 *"
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="输入资源标题"
                fullWidth
            />
            <Input
                label="链接 *"
                value={data.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://example.com"
                fullWidth
            />
            <div>
                <label className="block text-sm font-medium text-[#333] mb-1">
                    类型
                </label>
                <Dropdown
                    options={resourceTypeOptions}
                    value={data.type || 'blog'}
                    onChange={(value) => updateField('type', value)}
                    placeholder="选择资源类型"
                    className="w-full"
                />
            </div>
            <div className="flex gap-2">
                <Input
                    label="封面图片URL"
                    value={data.cover || ''}
                    onChange={(e) => updateField('cover', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    fullWidth
                />
                {(data.type === 'youtube_video' || data.type === 'bilibili_video' || data.type === 'github_repo') && data.url && (
                    <div className="flex flex-col justify-end">
                        <Button
                            variant="secondary"
                            onClick={handleAutoFetchCover}
                            className="whitespace-nowrap h-10"
                            disabled={!data.url}
                            title="自动获取资源信息（标题、作者等）"
                        >
                            自动填充
                        </Button>
                    </div>
                )}
            </div>
            {data.cover && (
                <div className="border border-[#E0E0E0] rounded p-2">
                    <p className="text-xs text-[#666] mb-2">封面预览：</p>
                    <img
                        src={data.cover}
                        alt="封面预览"
                        className="w-full h-[180px] object-cover rounded"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = generatePlaceholder({
                                backgroundColor: '#E0E0E0',
                                textColor: '#666666',
                                text: '图片加载失败'
                            });
                        }}
                    />
                </div>
            )}
            {categoryOptions.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">
                        分类
                    </label>
                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="输入新分类名称"
                                fullWidth
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    if (newCategoryName.trim()) {
                                        updateField('category', newCategoryName.trim());
                                        setIsAddingCategory(false);
                                        setNewCategoryName('');
                                    }
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap"
                            >
                                确定
                            </button>
                            <button
                                onClick={() => {
                                    setIsAddingCategory(false);
                                    setNewCategoryName('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                                取消
                            </button>
                        </div>
                    ) : (
                        <Dropdown
                            options={categoryOptions}
                            value={data.category || ''}
                            onChange={(value) => {
                                if (value === '__new__') {
                                    setIsAddingCategory(true);
                                } else {
                                    updateField('category', value);
                                }
                            }}
                            placeholder="选择分类"
                            className="w-full"
                        />
                    )}
                </div>
            )}
            <Input
                label="作者"
                value={data.author || ''}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="作者名称"
                fullWidth
            />
            <Input
                label="推荐语"
                value={data.recommendation || ''}
                onChange={(e) => updateField('recommendation', e.target.value)}
                placeholder="为什么推荐这个资源？"
                fullWidth
            />
        </div>
    );

    // 渲染问题表单
    const renderQuestionForm = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 space-y-4 border-b border-[#E0E0E0]">
                <Input
                    label="问题标题 *"
                    value={data.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="输入问题标题"
                    fullWidth
                />
                {categoryOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-1">
                            分类
                        </label>
                        <Dropdown
                            options={categoryOptions}
                            value={data.category || ''}
                            onChange={(value) => updateField('category', value)}
                            placeholder="选择分类"
                            className="w-full"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">
                        状态
                    </label>
                    <Dropdown
                        options={statusOptions}
                        value={data.status || 'unsolved'}
                        onChange={(value) => updateField('status', value)}
                        placeholder="选择状态"
                        className="w-full"
                    />
                </div>
            </div>
            {renderMarkdownEditor('description', '问题描述')}
        </div>
    );

    // 渲染小问题表单
    const renderSubQuestionForm = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 space-y-4 border-b border-[#E0E0E0]">
                <Input
                    label="小问题标题 *"
                    value={data.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="输入小问题标题"
                    fullWidth
                />
                <div>
                    <label className="block text-sm font-medium text-[#333] mb-1">
                        状态
                    </label>
                    <Dropdown
                        options={statusOptions}
                        value={data.status || 'unsolved'}
                        onChange={(value) => updateField('status', value)}
                        placeholder="选择状态"
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );

    // 渲染回答表单
    const renderAnswerForm = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-[#E0E0E0]">
                <Input
                    label="时间戳"
                    type="datetime-local"
                    value={data.timestamp || new Date().toISOString().slice(0, 16)}
                    onChange={(e) => updateField('timestamp', e.target.value)}
                    fullWidth
                />
            </div>
            {renderMarkdownEditor('content', '回答内容')}
        </div>
    );

    // 渲染总结表单
    const renderSummaryForm = () => (
        <div className="h-full flex flex-col">
            {renderMarkdownEditor('summary', 'THE END - 最终总结')}
        </div>
    );

    // 渲染Markdown编辑器（上下分屏）
    const renderMarkdownEditor = (field: 'content' | 'description' | 'summary', label: string) => {
        const content = data[field] || '';

        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 编辑区（上半部分） */}
                <div className="flex-1 flex flex-col border-b border-[#E0E0E0]">
                    <div className="px-4 py-2 bg-[#F5F5F5] border-b border-[#E0E0E0]">
                        <h3 className="text-sm font-semibold text-[#333]">{label}</h3>
                    </div>
                    <EditorToolbar
                        onInsert={(syntax, offset) => {
                            setCurrentField(field);
                            handleInsert(syntax, offset);
                        }}
                        onImageClick={() => {
                            setCurrentField(field);
                            setShowImageUploader(true);
                        }}
                    />
                    <div className="flex-1 overflow-hidden">
                        <MarkdownEditor
                            value={content}
                            onChange={(value) => updateField(field, value)}
                            placeholder={`输入${label}...`}
                            dataField={field}
                        />
                    </div>
                </div>

                {/* 预览区（下半部分） */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 py-2 bg-[#F5F5F5] border-b border-[#E0E0E0]">
                        <h3 className="text-sm font-semibold text-[#333]">预览</h3>
                    </div>
                    <div className="flex-1 overflow-auto bg-white">
                        <MarkdownPreview content={content} />
                    </div>
                </div>
            </div>
        );
    };

    // 根据类型渲染表单
    const renderForm = () => {
        switch (type) {
            case 'resource':
                return renderResourceForm();
            case 'question':
                return renderQuestionForm();
            case 'subQuestion':
                return renderSubQuestionForm();
            case 'answer':
                return renderAnswerForm();
            case 'summary':
                return renderSummaryForm();
            default:
                return null;
        }
    };

    return (
        <>
            {renderForm()}

            {/* 图片上传对话框 */}
            {showImageUploader && (
                <ImageUploader
                    onInsert={handleImageInsert}
                    onClose={() => setShowImageUploader(false)}
                />
            )}
        </>
    );
};
