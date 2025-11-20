/**
 * Repair Progress Modal
 * 修复进度模态框 - 显示修复和同步的实时进度
 */

import { Modal } from '@/components/ui/Modal';

export interface ProgressStep {
    id: string;
    label: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    progress?: number;
    message?: string;
}

interface RepairProgressModalProps {
    isOpen: boolean;
    steps: ProgressStep[];
    currentStep: number;
    overallProgress: number;
    canCancel?: boolean;
    onCancel?: () => void;
    onClose?: () => void;
}

export function RepairProgressModal({
    isOpen,
    steps,
    overallProgress,
    canCancel = false,
    onCancel,
    onClose
}: RepairProgressModalProps) {
    const isComplete = overallProgress >= 100;
    const hasError = steps.some(step => step.status === 'error');

    return (
        <Modal
            isOpen={isOpen}
            onClose={isComplete && onClose ? onClose : () => { }}
            title={isComplete ? (hasError ? '修复完成（有错误）' : '修复完成') : '正在修复数据'}
        >
            <div className="space-y-6">
                {/* 总体进度 */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">总体进度</span>
                        <span className="text-sm font-semibold text-blue-600">{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${hasError ? 'bg-red-500' : 'bg-blue-600'
                                }`}
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>

                {/* 步骤列表 */}
                <div className="space-y-3">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`p-4 rounded-lg border ${step.status === 'completed' ? 'bg-green-50 border-green-200' :
                                step.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                                    step.status === 'error' ? 'bg-red-50 border-red-200' :
                                        'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* 状态图标 */}
                                <div className="flex-shrink-0">
                                    {step.status === 'completed' && (
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {step.status === 'in_progress' && (
                                        <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    )}
                                    {step.status === 'error' && (
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {step.status === 'pending' && (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                    )}
                                </div>

                                {/* 步骤信息 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-medium ${step.status === 'completed' ? 'text-green-900' :
                                            step.status === 'in_progress' ? 'text-blue-900' :
                                                step.status === 'error' ? 'text-red-900' :
                                                    'text-gray-600'
                                            }`}>
                                            {step.label}
                                        </h4>
                                        {step.progress !== undefined && step.status === 'in_progress' && (
                                            <span className="text-sm font-medium text-blue-600">
                                                {Math.round(step.progress)}%
                                            </span>
                                        )}
                                    </div>
                                    {step.message && (
                                        <p className={`text-sm mt-1 ${step.status === 'error' ? 'text-red-700' : 'text-gray-600'
                                            }`}>
                                            {step.message}
                                        </p>
                                    )}
                                    {step.progress !== undefined && step.status === 'in_progress' && (
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                                                style={{ width: `${step.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t">
                    {!isComplete && canCancel && onCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                    )}
                    {isComplete && onClose && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            完成
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
