/**
 * 大问题详情弹窗组件（带编辑功能）
 * 支持在弹窗内直接编辑，无需打开抽屉
 */

import React, { useState } from 'react';
import type { BigQuestion, SubQuestion, TimelineAnswer, QuestionStatus } from '@/types/question';
import { STATUS_COLORS } from '@/types/question';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { SubQuestion as SubQuestionComponent } from './SubQuestion';
import { useAutoSave } from '@/hooks/useAutoSave';
import { AutoSaveIndicator } from '@/components/common/AutoSaveIndicator';

interface QuestionModalWithEditProps {
    question: BigQuestion;
    subQuestions?: SubQuestion[];
    answers?: Record<string, TimelineAnswer[]>;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (updates: Partial<BigQuestion>) => Promise<void>;
    onEdit?: () => void;
    onDelete?: () => void;
    onStatusChange?: (status: QuestionStatus) => void;
    onEditSubQuestion?: (id: string) => void;
    onDeleteSubQuestion?: (id: string) => void;
    onAddAnswer?: (subQuestionId: string) => void;
    onEditAnswer?: (answerId: string) => void;
    onDeleteAnswer?: (answerId: string) => void;
    onAddSubQuestion?: () => void;
    onSaveSubQuestion?: (id: string, updates: Partial<SubQuestion>) => Promise<void>;
    onSaveAnswer?: (id: string, content: string) => Promise<void>;
    onCreateSubQuestion?: (data: { title: string; status: QuestionStatus }) => Promise<void>;
    onCreateAnswer?: (subQuestionId: string, content: string) => Promise<void>;
}

type EditMode = 'view' | 'description' | 'summary' | 'subQuestion' | 'answer' | 'newSubQuestion' | 'newAnswer';

interface EditingData {
    subQuestionId?: string;
    answerId?: string;
    title?: string;
    content?: string;
    status?: QuestionStatus;
}

export const QuestionModalWithEdit: React.FC<QuestionModalWithEditProps> = ({
    question,
    subQuestions = [],
    answers = {},
    isOpen,
    onClose,
    onSave,
    onEdit,
    onDelete,
    onStatusChange,
    // onEditSubQuestion,
    onDeleteSubQuestion,
    // onAddAnswer,
    // onEditAnswer,
    onDeleteAnswer,
    // onAddSubQuestion,
    onSaveSubQuestion,
    onSaveAnswer,
    onCreateSubQuestion,
    onCreateAnswer,
}) => {
    const [editMode, setEditMode] = useState<EditMode>('view');
    const [editingData, setEditingData] = useState<EditingData>({});
    const [editedDescription, setEditedDescription] = useState(question.description);
    const [editedSummary, setEditedSummary] = useState(question.summary || '');
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<'description' | 'summary'>('description');

    // 自动保存
    const { isSaving, lastSaved } = useAutoSave({
        data: { description: editedDescription, summary: editedSummary },
        onSave: async () => {
            if (onSave) {
                await onSave({
                    description: editedDescription,
                    summary: editedSummary,
                });
            }
        },
        delay: 3000,
        enabled: editMode !== 'view',
    });

    const statusOptions: DropdownOption[] = [
        { value: 'unsolved', label: STATUS_COLORS.unsolved.label },
        { value: 'solving', label: STATUS_COLORS.solving.label },
        { value: 'solved', label: STATUS_COLORS.solved.label },
    ];

    // 开始编辑描述
    const startEditDescription = () => {
        setEditedDescription(question.description);
        setEditMode('description');
    };

    // 开始编辑总结
    const startEditSummary = () => {
        setEditedSummary(question.summary || '');
        setEditMode('summary');
    };

    // 保存并退出编辑模式
    const saveAndExitEdit = async () => {
        if (onSave) {
            await onSave({
                description: editedDescription,
                summary: editedSummary,
            });
        }
        setEditMode('view');
    };

    // 取消编辑
    const cancelEdit = () => {
        const hasChanges =
            editedDescription !== question.description ||
            editedSummary !== (question.summary || '');

        if (hasChanges) {
            const confirmed = window.confirm('有未保存的修改，确定要取消吗？');
            if (!confirmed) return;
        }

        setEditedDescription(question.description);
        setEditedSummary(question.summary || '');
        setEditMode('view');
        setEditingData({});
    };

    // 开始编辑小问题
    const startEditSubQuestion = (subQuestion: SubQuestion) => {
        setEditingData({
            subQuestionId: subQuestion.id,
            title: subQuestion.title,
            status: subQuestion.status,
        });
        setEditMode('subQuestion');
    };

    // 开始添加新小问题
    const startAddSubQuestion = () => {
        setEditingData({
            title: '',
            status: 'unsolved',
        });
        setEditMode('newSubQuestion');
    };

    // 保存小问题
    const saveSubQuestion = async () => {
        if (editMode === 'newSubQuestion') {
            if (onCreateSubQuestion && editingData.title) {
                await onCreateSubQuestion({
                    title: editingData.title,
                    status: editingData.status || 'unsolved',
                });
            }
        } else if (editMode === 'subQuestion' && editingData.subQuestionId) {
            if (onSaveSubQuestion) {
                await onSaveSubQuestion(editingData.subQuestionId, {
                    title: editingData.title,
                    status: editingData.status,
                });
            }
        }
        setEditMode('view');
        setEditingData({});
    };

    // 开始编辑回答
    const startEditAnswer = (answer: TimelineAnswer) => {
        setEditingData({
            answerId: answer.id,
            content: answer.content,
            subQuestionId: answer.question_id,
        });
        setCurrentEditField('description');
        setEditMode('answer');
    };

    // 开始添加新回答
    const startAddAnswer = (subQuestionId: string) => {
        setEditingData({
            subQuestionId,
            content: '',
        });
        setCurrentEditField('description');
        setEditMode('newAnswer');
    };

    // 保存回答
    const saveAnswer = async () => {
        if (editMode === 'newAnswer' && editingData.subQuestionId && editingData.content) {
            if (onCreateAnswer) {
                await onCreateAnswer(editingData.subQuestionId, editingData.content);
            }
        } else if (editMode === 'answer' && editingData.answerId && editingData.content) {
            if (onSaveAnswer) {
                await onSaveAnswer(editingData.answerId, editingData.content);
            }
        }
        setEditMode('view');
        setEditingData({});
    };

    // 取消小问题/回答编辑
    const cancelSubQuestionOrAnswerEdit = () => {
        const hasChanges = editingData.title || editingData.content;
        if (hasChanges) {
            const confirmed = window.confirm('有未保存的修改，确定要取消吗？');
            if (!confirmed) return;
        }
        setEditMode('view');
        setEditingData({});
    };

    // 插入Markdown语法
    const handleInsert = (syntax: string, cursorOffset?: number) => {
        // 如果在编辑回答，使用editingData.content
        if (editMode === 'answer' || editMode === 'newAnswer') {
            const content = editingData.content || '';
            const textarea = document.querySelector(`textarea[data-field="description"]`) as HTMLTextAreaElement;

            if (!textarea) {
                setEditingData(prev => ({ ...prev, content: content + syntax }));
                return;
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + syntax + content.substring(end);

            setEditingData(prev => ({ ...prev, content: newContent }));

            setTimeout(() => {
                const newPosition = start + syntax.length + (cursorOffset || 0);
                textarea.focus();
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
            return;
        }

        // 原有的问题描述和总结编辑逻辑
        const content = currentEditField === 'description' ? editedDescription : editedSummary;
        const textarea = document.querySelector(`textarea[data-field="${currentEditField}"]`) as HTMLTextAreaElement;

        if (!textarea) {
            if (currentEditField === 'description') {
                setEditedDescription(content + syntax);
            } else {
                setEditedSummary(content + syntax);
            }
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + syntax + content.substring(end);

        if (currentEditField === 'description') {
            setEditedDescription(newContent);
        } else {
            setEditedSummary(newContent);
        }

        setTimeout(() => {
            const newPosition = start + syntax.length + (cursorOffset || 0);
            textarea.focus();
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    // 插入图片
    const handleImageInsert = (markdown: string) => {
        // 如果在编辑回答
        if (editMode === 'answer' || editMode === 'newAnswer') {
            setEditingData(prev => ({ ...prev, content: (prev.content || '') + '\n' + markdown + '\n' }));
            return;
        }

        // 原有的问题描述和总结编辑逻辑
        if (currentEditField === 'description') {
            setEditedDescription(prev => prev + '\n' + markdown + '\n');
        } else {
            setEditedSummary(prev => prev + '\n' + markdown + '\n');
        }
    };

    // 渲染问题描述区域
    const renderDescriptionSection = () => {
        if (editMode === 'description') {
            return (
                <section className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] border-b border-[#E0E0E0]">
                        <h3 className="text-lg font-semibold text-[#333]">编辑问题描述</h3>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="small"
                                onClick={cancelEdit}
                            >
                                取消
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={saveAndExitEdit}
                                loading={isSaving}
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                    <EditorToolbar
                        onInsert={(syntax, offset) => {
                            setCurrentEditField('description');
                            handleInsert(syntax, offset);
                        }}
                        onImageClick={() => {
                            setCurrentEditField('description');
                            setShowImageUploader(true);
                        }}
                    />
                    <div style={{ height: '400px' }}>
                        <MarkdownEditor
                            value={editedDescription}
                            onChange={setEditedDescription}
                            dataField="description"
                            autoFocus
                        />
                    </div>
                    <div className="p-4 bg-[#F5F5F5] border-t border-[#E0E0E0]">
                        <h4 className="text-sm font-semibold text-[#666] mb-2">预览</h4>
                        <div className="bg-white p-4 rounded border border-[#E0E0E0] max-h-[200px] overflow-auto">
                            <MarkdownPreview content={editedDescription} />
                        </div>
                    </div>
                </section>
            );
        }

        return (
            <section className="bg-white p-6 rounded-lg border border-[#E0E0E0]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#333]">问题描述</h3>
                    <Button
                        variant="text"
                        size="small"
                        onClick={startEditDescription}
                        className="text-[#0047AB]"
                    >
                        编辑
                    </Button>
                </div>
                <MarkdownPreview content={question.description} />
            </section>
        );
    };

    // 渲染总结区域
    const renderSummarySection = () => {
        if (editMode === 'summary') {
            return (
                <section className="bg-[#FFF9E6] rounded-lg border-2 border-[#FFD700] overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-[#FFF9E6] border-b border-[#FFD700]">
                        <h3 className="text-lg font-semibold text-[#333]">编辑最终总结</h3>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="small"
                                onClick={cancelEdit}
                            >
                                取消
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={saveAndExitEdit}
                                loading={isSaving}
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                    <EditorToolbar
                        onInsert={(syntax, offset) => {
                            setCurrentEditField('summary');
                            handleInsert(syntax, offset);
                        }}
                        onImageClick={() => {
                            setCurrentEditField('summary');
                            setShowImageUploader(true);
                        }}
                    />
                    <div style={{ height: '400px' }}>
                        <MarkdownEditor
                            value={editedSummary}
                            onChange={setEditedSummary}
                            dataField="summary"
                            autoFocus
                        />
                    </div>
                    <div className="p-4 bg-[#FFF9E6] border-t border-[#FFD700]">
                        <h4 className="text-sm font-semibold text-[#666] mb-2">预览</h4>
                        <div className="bg-white p-4 rounded border border-[#FFD700] max-h-[200px] overflow-auto">
                            <MarkdownPreview content={editedSummary} />
                        </div>
                    </div>
                </section>
            );
        }

        return (
            <section className="bg-[#FFF9E6] p-6 rounded-lg border-2 border-[#FFD700]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#333]">
                        THE END - 最终总结
                    </h3>
                    <Button
                        variant="text"
                        size="small"
                        onClick={startEditSummary}
                        className="text-[#0047AB]"
                    >
                        编辑
                    </Button>
                </div>
                <MarkdownPreview content={question.summary || '暂无总结'} />
            </section>
        );
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                fullScreen={true}
                title=""
            >
                <div className="h-full flex flex-col">
                    {/* 顶部栏 */}
                    <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] bg-white sticky top-0 z-10">
                        {/* 左侧：返回按钮 */}
                        <Button
                            variant="text"
                            onClick={onClose}
                            className="text-[#0047AB] hover:text-[#003580]"
                        >
                            ← 返回
                        </Button>

                        {/* 中间：标题 */}
                        <h2 className="text-2xl font-bold text-[#333] flex-1 text-center px-8">
                            {question.title}
                        </h2>

                        {/* 右侧：编辑、删除、状态、关闭按钮 */}
                        <div className="flex items-center gap-3">
                            {editMode !== 'view' && (
                                <span className="text-sm text-[#666]">
                                    编辑模式
                                </span>
                            )}

                            {editMode === 'view' && onEdit && (
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={onEdit}
                                >
                                    编辑
                                </Button>
                            )}

                            {editMode === 'view' && onDelete && (
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={onDelete}
                                    className="text-[#E65100] border-[#E65100] hover:bg-[#FFF3E0]"
                                >
                                    删除
                                </Button>
                            )}

                            <Dropdown
                                options={statusOptions}
                                value={question.status}
                                onChange={(value) => onStatusChange?.(value as QuestionStatus)}
                            />

                            <Button
                                variant="text"
                                onClick={onClose}
                                className="text-[#666] hover:text-[#333] text-xl"
                            >
                                ×
                            </Button>
                        </div>
                    </div>

                    {/* 内容区域 - 可独立滚动 */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* 大问题描述 */}
                            {renderDescriptionSection()}

                            {/* THE END 最终总结 */}
                            {renderSummarySection()}

                            {/* 编辑小问题表单 */}
                            {(editMode === 'subQuestion' || editMode === 'newSubQuestion') && (
                                <section className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] border-b border-[#E0E0E0]">
                                        <h3 className="text-lg font-semibold text-[#333]">
                                            {editMode === 'newSubQuestion' ? '添加小问题' : '编辑小问题'}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={cancelSubQuestionOrAnswerEdit}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={saveSubQuestion}
                                                disabled={!editingData.title}
                                            >
                                                保存
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#333] mb-2">
                                                小问题标题
                                            </label>
                                            <input
                                                type="text"
                                                value={editingData.title || ''}
                                                onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="输入小问题标题..."
                                                className="w-full px-4 py-2 border border-[#E0E0E0] rounded focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#333] mb-2">
                                                状态
                                            </label>
                                            <div className="w-full">
                                                <Dropdown
                                                    options={statusOptions}
                                                    value={editingData.status || 'unsolved'}
                                                    onChange={(value) => setEditingData(prev => ({ ...prev, status: value as QuestionStatus }))}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 编辑回答表单 */}
                            {(editMode === 'answer' || editMode === 'newAnswer') && (
                                <section className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
                                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] border-b border-[#E0E0E0]">
                                        <h3 className="text-lg font-semibold text-[#333]">
                                            {editMode === 'newAnswer' ? '添加回答' : '编辑回答'}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={cancelSubQuestionOrAnswerEdit}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={saveAnswer}
                                                disabled={!editingData.content}
                                            >
                                                保存
                                            </Button>
                                        </div>
                                    </div>
                                    <EditorToolbar
                                        onInsert={(syntax, offset) => {
                                            handleInsert(syntax, offset);
                                        }}
                                        onImageClick={() => {
                                            setShowImageUploader(true);
                                        }}
                                    />
                                    <div style={{ height: '300px' }}>
                                        <MarkdownEditor
                                            value={editingData.content || ''}
                                            onChange={(value) => setEditingData(prev => ({ ...prev, content: value }))}
                                            dataField="description"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="p-4 bg-[#F5F5F5] border-t border-[#E0E0E0]">
                                        <h4 className="text-sm font-semibold text-[#666] mb-2">预览</h4>
                                        <div className="bg-white p-4 rounded border border-[#E0E0E0] max-h-[200px] overflow-auto">
                                            <MarkdownPreview content={editingData.content || ''} />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 小问题列表 - 仅在查看模式显示 */}
                            {editMode === 'view' && (
                                <section>
                                    <h3 className="text-lg font-semibold text-[#333] mb-4">
                                        小问题列表
                                    </h3>
                                    <div className="space-y-3">
                                        {subQuestions.length === 0 ? (
                                            <div className="text-center py-8 bg-[#F5F5F5] rounded-lg">
                                                <p className="text-[#999]">暂无小问题</p>
                                            </div>
                                        ) : (
                                            subQuestions.map((subQuestion) => (
                                                <SubQuestionComponent
                                                    key={subQuestion.id}
                                                    subQuestion={subQuestion}
                                                    answers={answers[subQuestion.id] || []}
                                                    onEdit={() => startEditSubQuestion(subQuestion)}
                                                    onDelete={onDeleteSubQuestion}
                                                    onAddAnswer={() => startAddAnswer(subQuestion.id)}
                                                    onEditAnswer={(answerId) => {
                                                        const answer = answers[subQuestion.id]?.find(a => a.id === answerId);
                                                        if (answer) startEditAnswer(answer);
                                                    }}
                                                    onDeleteAnswer={onDeleteAnswer}
                                                />
                                            ))
                                        )}
                                    </div>

                                    {/* 添加小问题按钮 */}
                                    <div className="mt-4 flex justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={startAddSubQuestion}
                                        >
                                            + 添加小问题
                                        </Button>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* 自动保存指示器 */}
            {editMode !== 'view' && (
                <AutoSaveIndicator
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                />
            )}

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
