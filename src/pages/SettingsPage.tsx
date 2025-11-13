/**
 * 设置页面
 * 显示和管理应用配置、用户信息、同步状态等
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncService } from '@/services/syncService';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/hooks/useToast';

export default function SettingsPage() {
    const { user, mode, gistId, clearAll } = useAuth();
    const { showToast } = useToast();
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [cacheInfo, setCacheInfo] = useState<{
        size: string;
        resourceCount: number;
        questionCount: number;
    } | null>(null);
    const [pendingChanges, setPendingChanges] = useState(0);

    // 加载设置信息
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            // 获取最后同步时间
            const syncTime = await syncService.getLastSyncTime();
            setLastSyncTime(syncTime);

            // 获取缓存信息
            const size = await cacheService.getFormattedSize();
            const resources = (await cacheService.getData<any[]>('pkw_resources')) || [];
            const questions = (await cacheService.getData<any[]>('pkw_questions')) || [];

            setCacheInfo({
                size,
                resourceCount: resources.length,
                questionCount: questions.length,
            });

            // 获取待同步变更数量
            const count = await syncService.getPendingChangesCount();
            setPendingChanges(count);
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    };

    const handleManualSync = async () => {
        try {
            showToast('info', '开始同步...');
            const result = await syncService.syncNow();

            if (result.success) {
                showToast('success', '同步成功');
                await loadSettings();
            } else {
                showToast('error', `同步失败: ${result.error}`);
            }
        } catch (error) {
            showToast('error', '同步失败');
        }
    };

    const handleClearCache = async () => {
        if (!confirm('确定要清除所有缓存数据吗？这将删除本地存储的所有资源和问答数据。')) {
            return;
        }

        try {
            await cacheService.clearAll();
            showToast('success', '缓存已清除');
            await loadSettings();
        } catch (error) {
            showToast('error', '清除缓存失败');
        }
    };

    const handleLogout = async () => {
        if (!confirm('确定要退出登录吗？这将清除所有本地数据和配置。')) {
            return;
        }

        try {
            await clearAll();
            showToast('success', '已退出登录');
            // 重新加载页面以返回初始状态
            window.location.href = '/';
        } catch (error) {
            showToast('error', '退出登录失败');
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '从未同步';

        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes} 分钟前`;
        if (hours < 24) return `${hours} 小时前`;
        if (days < 7) return `${days} 天前`;

        return date.toLocaleDateString('zh-CN');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">设置</h1>

                {/* 用户信息 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">用户信息</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">模式</span>
                            <span className="font-medium text-gray-900">
                                {mode === 'owner' ? '拥有者模式' : '访客模式'}
                            </span>
                        </div>

                        {user && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">用户名</span>
                                <span className="font-medium text-gray-900">{user.username}</span>
                            </div>
                        )}

                        {gistId && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Gist ID</span>
                                <span className="font-mono text-sm text-gray-900">{gistId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 同步状态 */}
                {mode === 'owner' && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">同步状态</h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">最后同步时间</span>
                                <span className="font-medium text-gray-900">
                                    {formatDate(lastSyncTime)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">待同步变更</span>
                                <span className="font-medium text-gray-900">
                                    {pendingChanges} 个
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleManualSync}
                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            立即同步
                        </button>
                    </div>
                )}

                {/* 存储使用情况 */}
                {cacheInfo && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">存储使用情况</h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">缓存大小</span>
                                <span className="font-medium text-gray-900">{cacheInfo.size}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">资源数量</span>
                                <span className="font-medium text-gray-900">
                                    {cacheInfo.resourceCount} 个
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">问题数量</span>
                                <span className="font-medium text-gray-900">
                                    {cacheInfo.questionCount} 个
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleClearCache}
                            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            清除缓存
                        </button>
                    </div>
                )}

                {/* 账户操作 */}
                {mode === 'owner' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">账户操作</h2>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            退出登录
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
