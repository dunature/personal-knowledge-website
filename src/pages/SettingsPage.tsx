/**
 * 设置页面
 * 显示和管理应用配置、用户信息、同步状态等
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncService } from '@/services/syncService';
import { cacheService } from '@/services/cacheService';
import { authService } from '@/services/authService';
import { gistService } from '@/services/gistService';
import { useToast } from '@/hooks/useToast';
import { DataExport } from '@/components/settings/DataExport';
import { DataImport } from '@/components/settings/DataImport';

export default function SettingsPage() {
    const { user, mode, gistId, clearAll, setToken } = useAuth();
    const { showToast } = useToast();
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [cacheInfo, setCacheInfo] = useState<{
        size: string;
        resourceCount: number;
        questionCount: number;
    } | null>(null);
    const [pendingChanges, setPendingChanges] = useState(0);
    const [hasToken, setHasToken] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [newToken, setNewToken] = useState('');

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

            // 检查是否有 Token
            const token = await authService.getToken();
            setHasToken(!!token);
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    };

    const handleUpdateToken = async () => {
        if (!newToken.trim()) {
            showToast('error', '请输入 Token');
            return;
        }

        try {
            // 验证 Token
            const validation = await gistService.validateToken(newToken);

            if (!validation.valid) {
                showToast('error', validation.error || 'Token 无效');
                return;
            }

            // 保存 Token
            const success = await setToken(newToken);

            if (success) {
                showToast('success', 'Token 已更新');
                setNewToken('');
                setShowTokenInput(false);
                await loadSettings();
            } else {
                showToast('error', 'Token 保存失败');
            }
        } catch (error) {
            showToast('error', 'Token 更新失败');
        }
    };

    const handleDeleteToken = async () => {
        if (!confirm('确定要删除 Token 吗？删除后将无法同步数据到 Gist。')) {
            return;
        }

        try {
            await authService.clearToken();
            showToast('success', 'Token 已删除');
            await loadSettings();
        } catch (error) {
            showToast('error', 'Token 删除失败');
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

    const handleForceSync = async () => {
        if (!confirm('强制同步将上传所有本地数据到 Gist，覆盖云端数据。确定继续吗？')) {
            return;
        }

        try {
            showToast('info', '开始强制同步...');

            // 清除待同步变更，强制完整同步
            await syncService.clearAllPendingChanges();
            const result = await syncService.syncNow();

            if (result.success) {
                showToast('success', '强制同步成功');
                await loadSettings();
            } else {
                showToast('error', `强制同步失败: ${result.error}`);
            }
        } catch (error) {
            showToast('error', '强制同步失败');
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

                {/* Token 管理 */}
                {mode === 'owner' && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Token 管理</h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Token 状态</span>
                                <span
                                    className={`font-medium ${hasToken ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {hasToken ? '已配置' : '未配置'}
                                </span>
                            </div>
                        </div>

                        {!showTokenInput ? (
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={() => setShowTokenInput(true)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {hasToken ? '更新 Token' : '配置 Token'}
                                </button>

                                {hasToken && (
                                    <button
                                        onClick={handleDeleteToken}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        删除 Token
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GitHub Personal Access Token
                                    </label>
                                    <input
                                        type="password"
                                        value={newToken}
                                        onChange={(e) => setNewToken(e.target.value)}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        需要 <code className="bg-gray-100 px-1 rounded">gist</code>{' '}
                                        权限
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdateToken}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        保存
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowTokenInput(false);
                                            setNewToken('');
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        取消
                                    </button>
                                </div>

                                <a
                                    href="https://github.com/settings/tokens/new?scopes=gist&description=Personal%20Knowledge%20Website"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    如何获取 Token？
                                </a>
                            </div>
                        )}
                    </div>
                )}

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

                        <div className="mt-4 space-y-2">
                            <button
                                onClick={handleManualSync}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                立即同步
                            </button>
                            <button
                                onClick={handleForceSync}
                                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                强制完整同步
                            </button>
                            <p className="text-xs text-gray-500">
                                💡 如果导入数据后同步没有上传，请使用"强制完整同步"
                            </p>
                        </div>
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

                {/* 数据管理 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">数据管理</h2>

                    <div className="space-y-6">
                        {/* 数据导出 */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">导出数据</h3>
                            <DataExport />
                        </div>

                        {/* 数据导入 */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">导入数据</h3>
                            <DataImport />
                        </div>
                    </div>
                </div>

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
