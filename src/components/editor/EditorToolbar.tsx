/**
 * Markdown编辑器工具栏组件
 * 提供常用Markdown语法快捷按钮
 */

import React, { useState } from 'react';
import {
    Bold,
    Italic,
    Heading,
    List,
    ListOrdered,
    Code,
    Link,
    Image,
} from 'lucide-react';

export interface EditorToolbarProps {
    onInsert: (syntax: string, cursorOffset?: number) => void;
    onImageClick: () => void;
}

interface ToolbarButton {
    icon: React.ReactNode;
    label: string;
    syntax: string;
    cursorOffset?: number;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    onInsert,
    onImageClick,
}) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const buttons: ToolbarButton[] = [
        {
            icon: <Bold size={18} />,
            label: '粗体',
            syntax: '**文本**',
            cursorOffset: -3,
        },
        {
            icon: <Italic size={18} />,
            label: '斜体',
            syntax: '*文本*',
            cursorOffset: -2,
        },
        {
            icon: <Heading size={18} />,
            label: '标题',
            syntax: '## 标题',
            cursorOffset: -2,
        },
        {
            icon: <List size={18} />,
            label: '无序列表',
            syntax: '- 列表项',
            cursorOffset: -3,
        },
        {
            icon: <ListOrdered size={18} />,
            label: '有序列表',
            syntax: '1. 列表项',
            cursorOffset: -3,
        },
        {
            icon: <Code size={18} />,
            label: '代码块',
            syntax: '```\n代码\n```',
            cursorOffset: -5,
        },
        {
            icon: <Link size={18} />,
            label: '链接',
            syntax: '[链接文本](url)',
            cursorOffset: -4,
        },
    ];

    const handleButtonClick = (button: ToolbarButton) => {
        onInsert(button.syntax, button.cursorOffset);
    };

    return (
        <div className="flex items-center gap-1 p-2 border-b border-[#E0E0E0] bg-[#F5F5F5]">
            {buttons.map((button) => (
                <div key={button.label} className="relative">
                    <button
                        type="button"
                        onClick={() => handleButtonClick(button)}
                        onMouseEnter={() => setHoveredButton(button.label)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="
                            p-2 rounded
                            text-[#666] hover:text-[#0047AB] hover:bg-white
                            transition-fast
                            focus:outline-none focus:ring-2 focus:ring-[#0047AB]
                        "
                        aria-label={button.label}
                    >
                        {button.icon}
                    </button>

                    {/* Tooltip */}
                    {hoveredButton === button.label && (
                        <div className="
                            absolute top-full left-1/2 -translate-x-1/2 mt-1
                            px-2 py-1 rounded
                            bg-[#333] text-white text-xs whitespace-nowrap
                            z-10 animate-fadeIn
                        ">
                            {button.label}
                        </div>
                    )}
                </div>
            ))}

            {/* 分隔线 */}
            <div className="w-px h-6 bg-[#E0E0E0] mx-1" />

            {/* 图片按钮 */}
            <div className="relative">
                <button
                    type="button"
                    onClick={onImageClick}
                    onMouseEnter={() => setHoveredButton('图片')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="
                        p-2 rounded
                        text-[#666] hover:text-[#0047AB] hover:bg-white
                        transition-fast
                        focus:outline-none focus:ring-2 focus:ring-[#0047AB]
                    "
                    aria-label="插入图片"
                >
                    <Image size={18} />
                </button>

                {/* Tooltip */}
                {hoveredButton === '图片' && (
                    <div className="
                        absolute top-full left-1/2 -translate-x-1/2 mt-1
                        px-2 py-1 rounded
                        bg-[#333] text-white text-xs whitespace-nowrap
                        z-10 animate-fadeIn
                    ">
                        插入图片
                    </div>
                )}
            </div>
        </div>
    );
};
