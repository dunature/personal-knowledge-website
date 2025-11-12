/**
 * 编辑器表单组件
 * 根据类型动态显示不同的表单字段
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';
import { MarkdownEditor } from './MarkdownEditor';
import { EditorToolbar } from './EditorToolbar';
import { ImageUploader } from './ImageUploader';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';

export type EditorType = 'resource' | 'question' | 'subQuestion' | 'answer' | 'summary';

export interface EditorFormData {
    // 通用字段
    title?: string;
    content?: string;

    // 资源特定字段
    url?: string;
    category?: string;
    tags?: string[];
    author?: string;
    recommendation?: string;

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

    // 分类选项
    const categoryOptions: DropdownOption[] = categories.map(cat => ({
        value: cat,
        label: cat,
    }));

    // 更新字段
    const updateField = (field: keyof EditorFormData, value: any) => {
        onChange({ ...data, [field]: value });
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

    // 渲染资源表单
    const renderResourceForm = () => (
        <div className="space-y-4 p-4">
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
