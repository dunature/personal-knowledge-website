/**
 * Data Repair Section
 * 设置页面中的数据修复部分
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataDetector } from '@/services/repair';
import type { DetectionResult } from '@/types/dataRepair';

interface DataRepairSectionProps {
    onStartRepair?: () => void;
}

export function DataRepairSection({ onStartRepair }: DataRepairSectionProps) {
    const navigate = useNavigate();
    const [lastValidation, setLastValidation] = useState<string | null>(null);
    const [dataHealth, setDataHealth] = useState<{
        status: 'unknown' | 'healthy' | 'warning' | 'error';
        totalErrors: number;
        autoRepairableErrors: number;
    }>({
        status: 'unknown',
        totalErrors: 0,
        autoRepairableErrors: 0
    });
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        // 从 localStorage 加载上次验证时间
        const lastCheck = localStorage.getItem('last_data_validation');
        if (lastCheck) {
            setLastValidation(lastCheck);
        }

        // 快速检查数据健康状况
        quickHealthCheck();
    }, []);

    const quickHealthCheck = async () => {
        try {
            // 尝试从 localStorage 获取数据
            const dataStr = localStorage.getItem('gist_data') || localStorage.getItem('cached_gist_data');
            if (!dataStr) {
                setDataHealth({
                    status: 'unknown',
                    totalErrors: 0,
                    autoRepairableErrors: 0
                });
                return;
            }

            const data = JSON.parse(dataStr);
            const result: DetectionResult = dataDetector.detectErrors(data);

            if (result.totalErrors === 0) {
                setDataHealth({
                    status: 'healthy',
                    totalErrors: 0,
                    autoRepairableErrors: 0
                });
            } else if (result.summary.autoRepairableErrors >= result.totalErrors * 0.8) {
                setDataHealth({
                    status: 'warning',
                    totalErrors: result.totalErrors,
                    autoRepairableErrors: result.summary.autoRepairableErrors
                });
            } else {
                setDataHealth({
                    status: 'error',
                    totalErrors: result.totalErrors,
                    autoRepairableErrors: result.summary.autoRepairableErrors
                });
            }
        } catch (error) {
            console.error('快速健康检查失败:', error);
            setDataHealth({
                status: 'unknown',
                totalErrors: 0,
                autoRepairableErrors: 0
            });
        }
    };

    const handleStartValidation = async () => {
        setIsChecking(true);
        try {
            await quickHealthCheck();
            const now = new Date().toISOString();
            localStorage.setItem('last_data_validation', now);
            setLastValidation(now);

            // 导航到数据修复页面
            if (onStartRepair) {
                onStartRepair();
            } else {
                navigate('/data-repair');
            }
        } finally {
            setIsChecking(false);
        }
    };

    const getStatusIcon = () => {
        switch (dataHealth.status) {
            case 'healthy':
                return (
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getStatusText = () => {
        switch (dataHealth.status) {
            case 'healthy':
                return '数据健康';
            case 'warning':
                return `发现 ${dataHealth.totalErrors} 个问题（${dataHealth.autoRepairableErrors} 个可自动修复）`;
            case 'error':
                return `发现 ${dataHealth.totalErrors} 个严重问题`;
            default:
                return '未检查';
        }
    };

    const getStatusColor = () => {
        switch (dataHealth.status) {
            case 'healthy':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'warning':
                return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'error':
                return 'text-red-700 bg-red-50 border-red-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins} 分钟前`;
        if (diffHours < 24) return `${diffHours} 小时前`;
        if (diffDays < 7) return `${diffDays} 天前`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">数据修复</h3>
                {lastValidation && (
                    <span className="text-sm text-gray-500">
                        上次检查: {formatDate(lastValidation)}
                    </span>
                )}
            </div>

            <p className="text-gray-600 text-sm mb-4">
                检测并修复 Gist 数据中的格式错误，确保数据完整性和一致性。
            </p>

            {/* 数据健康状态 */}
            <div className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}>
                <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div className="flex-1">
                        <h4 className="font-medium">数据状态</h4>
                        <p className="text-sm mt-1">{getStatusText()}</p>
                    </div>
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
                <button
                    onClick={handleStartValidation}
                    disabled={isChecking}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isChecking ? '检查中...' : '开始数据验证'}
                </button>
                {dataHealth.status !== 'healthy' && dataHealth.status !== 'unknown' && (
                    <button
                        onClick={quickHealthCheck}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        刷新状态
                    </button>
                )}
            </div>

            {/* 帮助提示 */}
            {dataHealth.status === 'warning' || dataHealth.status === 'error' ? (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">建议立即修复</p>
                            <p>点击"开始数据验证"查看详细错误信息并进行修复。</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
