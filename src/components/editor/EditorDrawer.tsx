/**
 * 编辑器抽屉组件
 * 从右侧滑入的全屏编辑器，支持上下分屏布局
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { iconButtonStyles } from '@/styles/buttonStyles';

export interface EditorDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
    hasUnsavedChanges?: boolean;
}

export const EditorDrawer: React.FC<EditorDrawerProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    onCancel,
    isSaving = false,
    hasUnsavedChanges = false,
}) => {
    // 阻止背景滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ESC键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, hasUnsavedChanges]);

    // 处理关闭
    const handleClose = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('有未保存的修改，确定要关闭吗？');
            if (!confirmed) return;
        }
        onClose();
    };

    // 处理取消
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* 遮罩层 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
                style={{ animation: 'fadeIn 300ms ease-out' }}
                onClick={handleClose}
            />

            {/* 抽屉内容 */}
            <div
                className="
                    absolute right-0 top-0 bottom-0
                    w-[60%] bg-white
                    shadow-2xl
                    flex flex-col
                    transition-transform duration-300 ease-out
                "
                style={{
                    animation: 'slideInRight 300ms ease-out',
                }}
            >
                {/* 顶部栏 */}
                <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0] bg-white">
                    {/* 标题 */}
                    <h2 className="text-xl font-semibold text-[#333]">
                        {title}
                    </h2>

                    {/* 右侧按钮组 */}
                    <div className="flex items-center gap-3">
                        {onCancel && (
                            <Button
                                variant="outline"
                                size="small"
                                onClick={handleCancel}
                            >
                                取消
                            </Button>
                        )}
                        {onSave && (
                            <Button
                                variant="primary"
                                size="small"
                                onClick={onSave}
                                loading={isSaving}
                                disabled={isSaving}
                            >
                                {isSaving ? '保存中...' : '保存'}
                            </Button>
                        )}
                        <button
                            onClick={handleClose}
                            className={iconButtonStyles}
                            aria-label="关闭"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
};
