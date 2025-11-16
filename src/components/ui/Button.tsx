/**
 * Button组件
 * 支持主按钮、次按钮、文字链接等多种样式
 * 使用统一的设计系统按钮样式
 */

import React from 'react';
import { getButtonStyles, type ButtonVariant as StyleVariant, type ButtonSize as StyleSize } from '@/styles/buttonStyles';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled = false,
    icon,
    children,
    className = '',
    ...props
}) => {
    // 映射 variant 到样式系统
    const mapVariant = (v: ButtonVariant): StyleVariant => {
        if (v === 'text') return 'link';
        if (v === 'outline') return 'secondary';
        return v as StyleVariant;
    };

    const buttonStyles = getButtonStyles(
        mapVariant(variant),
        size as StyleSize,
        fullWidth,
        className
    );

    return (
        <button
            className={buttonStyles}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};
