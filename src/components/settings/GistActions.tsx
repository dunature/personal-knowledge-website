/**
 * Gist 操作按钮组件
 * 提供生成分享链接和断开连接功能
 * 使用 React.memo 优化性能
 */

import React, { useState } from 'react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';

interface GistActionsProps {
    gistId: string | null;
    mode: 'visitor' | 'owner';
    onDisconnect: () => void;
    onGenerateShareLink: () => void;
}

const GistActions: React.FC<GistActionsProps> = ({
    gistId,
    // mode, // 保留以备将来使用
    onDisconnect,
    onGenerateShareLink,
}) => {
    const { showToast } = useToast();
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    if (!gistId) {
        return null;
    }

    const handleGenerateShareLink = async () => {
        try {
            const shareLink = authService.generateShareLink();

            if (!shareLink) {
                showToast('error', '无法生成分享链接');
                return;
            }

            // 复制到剪贴板
            await navigator.clipboard.writeText(shareLink);
            showToast('success', '分享链接已复制到剪贴板');
            onGenerateShareLink();
        } catch (error) {
            console.error('生成分享链接失败:', error);
            showToast('error', '复制失败，请手动复制链接');
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            authService.clearGistId();
            showToast('success', '已断开 Gist 连接');
            setShowDisconnectConfirm(false);
            onDisconnect();

            // 刷新页面以更新 UI
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('断开连接失败:', error);
            showToast('error', '断开连接失败');
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">操作</h3>

            {/* 生成分享链接 */}
            <button
                onClick={handleGenerateShareLink}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
                生成分享链接
            </button>

            {/* 断开连接 */}
            {!showDisconnectConfirm ? (
                <button
                    onClick={() => setShowDisconnectConfirm(true)}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                    </svg>
                    断开连接
                </button>
            ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-3">
                        确定要断开 Gist 连接吗？本地缓存数据将保留。
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDisconnect}
                            disabled={isDisconnecting}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDisconnecting ? '断开中...' : '确认断开'}
                        </button>
                        <button
                            onClick={() => setShowDisconnectConfirm(false)}
                            disabled={isDisconnecting}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            {/* 提示信息 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                    💡 断开连接后，你可以连接到其他 Gist 或继续使用本地数据
                </p>
            </div>
        </div>
    );
};

// 使用 React.memo 优化性能
export default React.memo(GistActions);
