/**
 * 用户信息调试页面
 * 用于诊断用户头像和用户名显示问题
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export const UserInfoDebugPage: React.FC = () => {
    const { mode, user, isAuthenticated } = useAuth();
    const [localStorageData, setLocalStorageData] = useState<any>({});
    const [tokenInfo, setTokenInfo] = useState<string>('');

    useEffect(() => {
        // 读取 LocalStorage 数据
        const data = {
            mode: localStorage.getItem('pkw_mode'),
            gistId: localStorage.getItem('pkw_gist_id'),
            user: localStorage.getItem('pkw_user'),
            token: localStorage.getItem('pkw_github_token'),
        };
        setLocalStorageData(data);

        // 检查 token
        authService.getToken().then(token => {
            setTokenInfo(token ? `Token 存在 (长度: ${token.length})` : 'Token 不存在');
        });
    }, [mode, user]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">用户信息调试</h1>

                {/* Context 状态 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">AuthContext 状态</h2>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <span className="font-medium">模式:</span>
                            <span className={mode === 'owner' ? 'text-blue-600' : 'text-gray-600'}>
                                {mode}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">已认证:</span>
                            <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                                {isAuthenticated ? '是' : '否'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">用户名:</span>
                            <span>{user?.username || '未设置'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">头像URL:</span>
                            <span className="text-sm break-all">{user?.avatarUrl || '未设置'}</span>
                        </div>
                        {user?.avatarUrl && (
                            <div className="flex gap-2 items-center">
                                <span className="font-medium">头像预览:</span>
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                                />
                            </div>
                        )}
                        <div className="flex gap-2">
                            <span className="font-medium">Gist ID:</span>
                            <span className="text-sm">{user?.gistId || '未设置'}</span>
                        </div>
                    </div>
                </div>

                {/* LocalStorage 数据 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">LocalStorage 数据</h2>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <span className="font-medium">模式:</span>
                            <span>{localStorageData.mode || '未设置'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">Gist ID:</span>
                            <span className="text-sm">{localStorageData.gistId || '未设置'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">用户信息:</span>
                            <span className="text-sm break-all">
                                {localStorageData.user || '未设置'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium">Token:</span>
                            <span className="text-sm">{tokenInfo}</span>
                        </div>
                    </div>
                </div>

                {/* 用户信息 JSON */}
                {user && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">用户对象 (JSON)</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                )}

                {/* 诊断建议 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900">诊断建议</h2>
                    <div className="space-y-2 text-sm text-blue-800">
                        {mode === 'visitor' && (
                            <p>✓ 当前是访客模式，不会显示用户信息</p>
                        )}
                        {mode === 'owner' && !isAuthenticated && (
                            <p>⚠️ 拥有者模式但未认证，请检查 Token</p>
                        )}
                        {mode === 'owner' && isAuthenticated && !user && (
                            <p>⚠️ 已认证但用户信息为空，可能是初始化问题</p>
                        )}
                        {mode === 'owner' && isAuthenticated && user && !user.username && (
                            <p>⚠️ 用户对象存在但缺少用户名</p>
                        )}
                        {mode === 'owner' && isAuthenticated && user && !user.avatarUrl && (
                            <p>⚠️ 用户对象存在但缺少头像URL</p>
                        )}
                        {mode === 'owner' && isAuthenticated && user && user.username && user.avatarUrl && (
                            <p>✓ 用户信息完整，应该正常显示</p>
                        )}
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">操作</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            刷新页面
                        </button>
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            刷新用户信息
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('确定要清除所有数据吗？')) {
                                    authService.clearAll();
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            清除所有数据
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoDebugPage;
