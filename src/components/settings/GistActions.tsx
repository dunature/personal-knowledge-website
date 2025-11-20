/**
 * Gist 操作按钮组件
 * 提供生成分享链接和断开连接功能
 * 使用 React.memo 优化性能
 */

import React, { useState } from 'react';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import { gistService } from '@/services/gistService';
import { cacheService, STORAGE_KEYS } from '@/services/cacheService';
import { validateGistDataDetailed } from '@/utils/dataValidation';
import { useToast } from '@/hooks/useToast';
import { permissionService } from '@/services/permissionService';

interface GistActionsProps {
    gistId: string | null;
    mode: 'visitor' | 'owner';
    onDisconnect: () => void;
    onGenerateShareLink: () => void;
}

const GistActions: React.FC<GistActionsProps> = ({
    gistId,
    mode,
    onDisconnect,
    onGenerateShareLink,
}) => {
    const { showToast } = useToast();
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

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

    const handleSync = async () => {
        if (!gistId) {
            showToast('error', '没有连接的 Gist');
            return;
        }

        setIsSyncing(true);
        setSyncProgress(0);

        try {
            if (mode === 'visitor') {
                // 访客模式：只从 Gist 拉取数据
                setSyncProgress(20);
                const gistData = await gistService.getGist(gistId);

                setSyncProgress(40);
                const validationResult = validateGistDataDetailed(gistData);
                if (!validationResult.valid) {
                    throw new Error(
                        validationResult.errors
                            ? `数据验证失败：\n${validationResult.errors.join('\n')}`
                            : '数据格式无效'
                    );
                }

                setSyncProgress(60);
                await cacheService.saveData(STORAGE_KEYS.RESOURCES, gistData.resources);
                await cacheService.saveData(STORAGE_KEYS.QUESTIONS, gistData.questions);
                await cacheService.saveData(STORAGE_KEYS.SUB_QUESTIONS, gistData.subQuestions);
                await cacheService.saveData(STORAGE_KEYS.ANSWERS, gistData.answers);
                await cacheService.saveData(STORAGE_KEYS.METADATA, gistData.metadata);

                setSyncProgress(100);
                showToast('success', '数据同步成功');

                // 刷新页面以显示新数据
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                // 拥有者模式：双向同步
                setSyncProgress(20);
                const result = await syncService.syncNow();
                setSyncProgress(100);

                if (result.success) {
                    showToast('success', '数据同步成功');
                    // 刷新页面以显示新数据
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    throw new Error(result.error || '同步失败');
                }
            }
        } catch (error) {
            console.error('同步失败:', error);
            if (error instanceof Error) {
                showToast('error', `同步失败: ${error.message}`);
            } else {
                showToast('error', '同步失败，请稍后重试');
            }
        } finally {
            setIsSyncing(false);
            setSyncProgress(0);
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

    const canSync = permissionService.canSync();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">操作</h3>

            {/* 同步按钮 */}
            {canSync && (
                <div>
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSyncing ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                同步中... {syncProgress}%
                            </>
                        ) : (
                            <>
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                {mode === 'visitor' ? '从 Gist 拉取数据' : '同步数据'}
                            </>
                        )}
                    </button>
                    {mode === 'visitor' && (
                        <p className="text-xs text-gray-500 mt-1">
                            访客模式下只能从 Gist 拉取最新数据
                        </p>
                    )}
                </div>
            )}

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
