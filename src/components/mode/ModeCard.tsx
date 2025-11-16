/**
 * ModeCard组件
 * 展示单个模式的信息卡片
 */

import React from 'react';
import { Check } from 'lucide-react';

export interface ModeCardProps {
    mode: 'visitor' | 'owner';
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    isActive: boolean;
    isSelected: boolean;
    onSelect: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
    title,
    description,
    icon,
    features,
    isActive,
    isSelected,
    onSelect,
}) => {
    return (
        <button
            onClick={onSelect}
            className={`
                relative w-full p-6 rounded-xl border-2 text-left transition-all
                ${isActive
                    ? 'border-blue-500 bg-blue-50'
                    : isSelected
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-selected={isSelected}
            role="option"
        >
            {/* 当前激活标识 */}
            {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-blue-600">
                    <Check size={14} />
                    <span>当前模式</span>
                </div>
            )}

            {/* 图标 */}
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 text-blue-600">
                {icon}
            </div>

            {/* 标题和描述 */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            {/* 功能列表 */}
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* 选择按钮 */}
            {!isActive && (
                <div className="mt-6">
                    <div
                        className={`
                            w-full py-2 px-4 rounded-lg text-center font-medium transition-colors
                            ${isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 group-hover:bg-blue-100'
                            }
                        `}
                    >
                        {isSelected ? '已选择' : '选择此模式'}
                    </div>
                </div>
            )}
        </button>
    );
};
