/**
 * DataComparisonDialog 测试页面
 * 用于验证数据对比对话框是否正常工作
 */

import { useState } from 'react';
import { DataComparisonDialog } from '@/components/sync/DataComparisonDialog';
import type { DataComparisonResult } from '@/types/sync';

export default function DataComparisonDialogTest() {
    const [showDialog, setShowDialog] = useState(false);

    // 模拟数据对比结果
    const mockComparison: DataComparisonResult = {
        hasChanges: true,
        local: {
            resourceCount: 10,
            questionCount: 5,
            subQuestionCount: 8,
            answerCount: 15,
            lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
        },
        remote: {
            resourceCount: 12,
            questionCount: 6,
            subQuestionCount: 8,
            answerCount: 15,
            lastModified: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分钟前
        },
        differences: {
            resources: 2,
            questions: 1,
            subQuestions: 0,
            answers: 0,
        },
        recommendation: 'pull',
    };

    const handleConfirm = (action: 'sync' | 'skip' | 'auto') => {
        console.log('用户选择:', action);
        alert(`用户选择: ${action}`);
        setShowDialog(false);
    };

    const handleClose = () => {
        console.log('关闭对话框');
        setShowDialog(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    DataComparisonDialog 测试
                </h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试说明</h2>
                    <p className="text-gray-600 mb-4">
                        点击下面的按钮来测试数据对比对话框是否正常显示和工作。
                    </p>
                    <button
                        onClick={() => setShowDialog(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        显示数据对比对话框
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">模拟数据</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">本地数据</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>资源: {mockComparison.local.resourceCount}</li>
                                <li>问题: {mockComparison.local.questionCount}</li>
                                <li>子问题: {mockComparison.local.subQuestionCount}</li>
                                <li>答案: {mockComparison.local.answerCount}</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">云端数据</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>资源: {mockComparison.remote.resourceCount}</li>
                                <li>问题: {mockComparison.remote.questionCount}</li>
                                <li>子问题: {mockComparison.remote.subQuestionCount}</li>
                                <li>答案: {mockComparison.remote.answerCount}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded">
                        <p className="text-sm text-yellow-800">
                            <strong>差异:</strong> +{mockComparison.differences.resources} 个资源,
                            +{mockComparison.differences.questions} 个问题
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">预期行为</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✓ 对话框应该显示在屏幕中央</li>
                        <li>✓ 显示本地和云端的数据统计</li>
                        <li>✓ 高亮显示差异(绿色表示增加)</li>
                        <li>✓ 提供"立即同步"、"稍后"、"不再提示"选项</li>
                        <li>✓ 点击按钮后对话框应该关闭</li>
                    </ul>
                </div>
            </div>

            {/* 数据对比对话框 */}
            <DataComparisonDialog
                open={showDialog}
                comparison={mockComparison}
                onConfirm={handleConfirm}
                onClose={handleClose}
            />
        </div>
    );
}
