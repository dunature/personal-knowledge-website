/**
 * Markdown编辑器组件
 * 支持Markdown语法输入和快捷键
 */

import React, { useRef, useEffect } from 'react';

export interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    onSave?: () => void;
    className?: string;
    dataField?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = '输入Markdown内容...',
    autoFocus = false,
    onSave,
    className = '',
    dataField,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 自动聚焦
    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    // 快捷键支持
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ctrl/Cmd + S 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            onSave?.();
        }

        // Tab键插入4个空格
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newValue = value.substring(0, start) + '    ' + value.substring(end);
            onChange(newValue);

            // 设置光标位置
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = start + 4;
                    textareaRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`h-full flex flex-col ${className}`}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                data-field={dataField}
                className="
                    flex-1 w-full p-4
                    text-sm leading-relaxed
                    font-mono
                    border border-[#E0E0E0] rounded
                    focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent
                    resize-none
                    bg-white
                "
                style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                }}
            />
        </div>
    );
};
