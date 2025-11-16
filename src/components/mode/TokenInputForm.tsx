/**
 * TokenInputForm组件
 * 收集和验证GitHub Token
 */

import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import { getButtonStyles } from '@/styles/buttonStyles';

export interface TokenInputFormProps {
    token: string;
    onTokenChange: (token: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isValidating: boolean;
    error: string | null;
}

export const TokenInputForm: React.FC<TokenInputFormProps> = ({
    token,
    onTokenChange,
    onSubmit,
    onCancel,
    isValidating,
    error,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    输入 GitHub Token
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    切换到拥有者模式需要验证您的身份
                </p>
            </div>

            {/* Token输入框 */}
            <div>
                <label htmlFor="github-token" className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Token
                </label>
                <input
                    id="github-token"
                    type="password"
                    value={token}
                    onChange={(e) => onTokenChange(e.target.value)}
                    disabled={isValidating}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className={`
                        w-full px-4 py-3 border rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary/10
                        placeholder:text-gray-400
                        transition-all duration-200
                        ${error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }
                        ${isValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'token-error' : 'token-help'}
                />
            </div>

            {/* 错误提示 */}
            {error && (
                <div
                    id="token-error"
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                    role="alert"
                    aria-live="polite"
                >
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* 安全提示 */}
            <div
                id="token-help"
                className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
                <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                    Token 将被加密存储在本地，不会发送到任何服务器
                </p>
            </div>

            {/* 验证中状态 */}
            {isValidating && (
                <div className="py-2">
                    <LoadingState message="验证中..." />
                </div>
            )}

            {/* 按钮组 */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isValidating}
                    className={getButtonStyles('secondary', 'medium', false, 'flex-1')}
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={!token.trim() || isValidating}
                    className={getButtonStyles('primary', 'medium', false, 'flex-1')}
                >
                    {isValidating ? '验证中...' : '验证并切换'}
                </button>
            </div>
        </form>
    );
};
