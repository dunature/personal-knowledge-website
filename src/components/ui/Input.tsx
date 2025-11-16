/**
 * Input组件
 * 支持文本输入、搜索框等
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseStyles = 'px-4 py-3 text-body border rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = hasError
        ? 'border-error bg-error-light focus:ring-error/20 focus:border-error'
        : 'border-gray-300 bg-background hover:border-gray-400 focus:border-primary';

    const widthStyles = fullWidth ? 'w-full' : '';
    const paddingStyles = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    const combinedClassName = `${baseStyles} ${errorStyles} ${widthStyles} ${paddingStyles} ${className}`.trim();

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-small font-medium text-text mb-1"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={combinedClassName}
                    aria-invalid={hasError}
                    aria-describedby={
                        error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                    }
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1 text-small text-[#E65100]"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p
                    id={`${inputId}-helper`}
                    className="mt-1 text-small text-secondary"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};
