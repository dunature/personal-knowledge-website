/**
 * Toast 测试页面
 * 测试全局 Toast 通知功能
 */

import React from 'react';
import { useToast } from '@/hooks/useToast';

const ToastTest: React.FC = () => {
    const { showSuccess, showError, showWarning, showInfo, showLoading, hideToast } = useToast();

    const handleShowSuccess = () => {
        showSuccess('操作成功！这是一条成功消息');
    };

    const handleShowError = () => {
        showError('操作失败！这是一条错误消息');
    };

    const handleShowWarning = () => {
        showWarning('警告！这是一条警告消息');
    };

    const handleShowInfo = () => {
        showInfo('提示：这是一条信息消息');
    };

    const handleShowLoading = () => {
        const id = showLoading('加载中...');
        // 3秒后隐藏
        setTimeout(() => {
            hideToast(id);
            showSuccess('加载完成！');
        }, 3000);
    };

    const handleShowShareLink = async () => {
        try {
            const shareLink = 'https://example.com/share/abc123';
            await navigator.clipboard.writeText(shareLink);
            showSuccess('分享链接已复制到剪贴板');
        } catch (error) {
            showError('复制失败，请手动复制链接');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Toast 通知测试</h1>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">测试不同类型的 Toast</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleShowSuccess}
                            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            显示成功消息
                        </button>

                        <button
                            onClick={handleShowError}
                            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            显示错误消息
                        </button>

                        <button
                            onClick={handleShowWarning}
                            className="bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            显示警告消息
                        </button>

                        <button
                            onClick={handleShowInfo}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            显示信息消息
                        </button>

                        <button
                            onClick={handleShowLoading}
                            className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            显示加载消息（3秒）
                        </button>

                        <button
                            onClick={handleShowShareLink}
                            className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            模拟分享链接复制
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">测试说明</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li>✅ Toast 通知会显示在页面右上角</li>
                        <li>✅ 成功消息会在 2 秒后自动消失</li>
                        <li>✅ 错误和警告消息会在 3 秒后自动消失</li>
                        <li>✅ 加载消息不会自动消失，需要手动关闭</li>
                        <li>✅ 可以点击关闭按钮手动关闭 Toast</li>
                        <li>✅ 多个 Toast 会堆叠显示</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ToastTest;
