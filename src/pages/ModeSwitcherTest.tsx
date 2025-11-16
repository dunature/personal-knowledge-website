/**
 * 模式切换功能测试页面
 */

import React, { useState } from 'react';
import { ModeSwitcherModal } from '@/components/mode/ModeSwitcherModal';
import { ModeIndicator } from '@/components/common/ModeIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';

export const ModeSwitcherTest: React.FC = () => {
    const { mode, switchMode, user, isAuthenticated } = useAuth();
    const { toasts, showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModeChange = async (newMode: typeof mode) => {
        try {
            await switchMode(newMode);
            showToast('success', `已切换到${newMode === 'owner' ? '拥有者' : '访客'}模式`);
        } catch (error) {
            console.error('模式切换失败:', error);
            showToast('error', '模式切换失败，请重试');
        }
    };

    const handleClearLocalStorage = () => {
        if (confirm('确定要清除所有LocalStorage数据吗？这将重置所有设置。')) {
            localStorage.clear();
            showToast('success', 'LocalStorage已清除，请刷新页面');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    模式切换功能测试
                </h1>

                {/* 当前状态 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        当前状态
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600 font-medium w-32">当前模式:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${mode === 'owner'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {mode === 'owner' ? '拥有者模式' : '访客模式'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600 font-medium w-32">认证状态:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAuthenticated
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {isAuthenticated ? '已认证' : '未认证'}
                            </span>
                        </div>
                        {user && (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600 font-medium w-32">用户名:</span>
                                    <span className="text-gray-900">{user.username}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600 font-medium w-32">头像:</span>
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                                {user.gistId && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600 font-medium w-32">Gist ID:</span>
                                        <span className="text-gray-900 font-mono text-sm">{user.gistId}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ModeIndicator 测试 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        ModeIndicator 组件
                    </h2>
                    <p className="text-gray-600 mb-4">
                        点击下面的模式指示器应该打开模式切换弹窗
                    </p>
                    <div className="flex items-center gap-4">
                        <ModeIndicator onClick={() => setIsModalOpen(true)} />
                        <span className="text-sm text-gray-500">← 点击这里</span>
                    </div>
                </div>

                {/* 测试按钮 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        测试操作
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            打开模式切换弹窗
                        </button>
                        <button
                            onClick={() => handleModeChange(mode === 'owner' ? 'visitor' : 'owner')}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            直接切换模式 (当前: {mode === 'owner' ? '拥有者' : '访客'})
                        </button>
                        <button
                            onClick={handleClearLocalStorage}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            清除 LocalStorage
                        </button>
                    </div>
                </div>

                {/* LocalStorage 内容 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        LocalStorage 内容
                    </h2>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <span className="text-gray-600 font-medium w-40">pkw_mode:</span>
                            <span className="text-gray-900 font-mono text-sm break-all">
                                {localStorage.getItem('pkw_mode') || '(未设置)'}
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-gray-600 font-medium w-40">pkw_github_token:</span>
                            <span className="text-gray-900 font-mono text-sm break-all">
                                {localStorage.getItem('pkw_github_token') ? '(已加密)' : '(未设置)'}
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-gray-600 font-medium w-40">pkw_user:</span>
                            <span className="text-gray-900 font-mono text-sm break-all">
                                {localStorage.getItem('pkw_user') || '(未设置)'}
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-gray-600 font-medium w-40">pkw_gist_id:</span>
                            <span className="text-gray-900 font-mono text-sm break-all">
                                {localStorage.getItem('pkw_gist_id') || '(未设置)'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 测试说明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        测试步骤
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                        <li>首次访问应该显示"访客模式"</li>
                        <li>点击ModeIndicator或"打开模式切换弹窗"按钮</li>
                        <li>在弹窗中选择"拥有者模式"</li>
                        <li>输入有效的GitHub Token</li>
                        <li>验证成功后应该切换到拥有者模式</li>
                        <li>刷新页面，应该保持拥有者模式</li>
                        <li>切换回访客模式，再刷新页面，应该保持访客模式</li>
                        <li>清除LocalStorage后刷新，应该回到默认的访客模式</li>
                    </ol>
                </div>
            </div>

            {/* 模式切换弹窗 */}
            <ModeSwitcherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentMode={mode}
                onModeChange={handleModeChange}
            />

            {/* Toast通知 */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={toast.onClose}
                    />
                ))}
            </div>
        </div>
    );
};

export default ModeSwitcherTest;
