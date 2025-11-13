/**
 * 数据迁移向导
 * 引导用户将本地数据迁移到 GitHub Gist
 */

import React, { useState, useEffect } from 'react';
import { migrationService, type LocalDataInfo } from '@/services/migrationService';
import LoadingState from '@/components/common/LoadingState';
import ErrorMessage from '@/components/common/ErrorMessage';

interface MigrationWizardProps {
    onComplete: (gistId: string) => void;
    onSkip: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onComplete, onSkip }) => {
    const [localData, setLocalData] = useState<LocalDataInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [migrating, setMigrating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadLocalData();
    }, []);

    const loadLocalData = async () => {
        try {
            setLoading(true);
            const data = await migrationService.detectLocalData();
            setLocalData(data);
        } catch (err) {
            setError('Failed to detect local data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMigrate = async () => {
        try {
            setMigrating(true);
            setError(null);

            const result = await migrationService.migrateToGist();

            if (result.success && result.gistId) {
                onComplete(result.gistId);
            } else {
                setError(result.error || 'Migration failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setMigrating(false);
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingState message="检测本地数据..." />
            </div>
        );
    }

    if (!localData) {
        return (
            <div className="p-6">
                <ErrorMessage message="无法检测本地数据" />
            </div>
        );
    }

    const hasData = localData.hasResources || localData.hasQuestions;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    数据迁移
                </h2>

                {hasData ? (
                    <>
                        <p className="text-gray-600 mb-6">
                            我们检测到您有本地数据。将数据迁移到 GitHub Gist 可以实现跨设备同步和数据备份。
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                本地数据统计
                            </h3>
                            <div className="space-y-2 text-sm">
                                {localData.resourceCount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">资源：</span>
                                        <span className="font-medium text-gray-900">
                                            {localData.resourceCount} 个
                                        </span>
                                    </div>
                                )}
                                {localData.questionCount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">大问题：</span>
                                        <span className="font-medium text-gray-900">
                                            {localData.questionCount} 个
                                        </span>
                                    </div>
                                )}
                                {localData.subQuestionCount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">小问题：</span>
                                        <span className="font-medium text-gray-900">
                                            {localData.subQuestionCount} 个
                                        </span>
                                    </div>
                                )}
                                {localData.answerCount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">回答：</span>
                                        <span className="font-medium text-gray-900">
                                            {localData.answerCount} 个
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                    <span className="text-gray-700">总大小：</span>
                                    <span className="font-medium text-gray-900">
                                        {formatBytes(localData.totalSize)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6">
                                <ErrorMessage message={error} />
                            </div>
                        )}

                        {migrating && (
                            <div className="mb-6">
                                <LoadingState message="正在迁移数据到 GitHub Gist..." />
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    这可能需要几秒钟，请稍候...
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleMigrate}
                                disabled={migrating}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {migrating ? '迁移中...' : '迁移到 Gist'}
                            </button>
                            <button
                                onClick={onSkip}
                                disabled={migrating}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                            >
                                跳过
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            跳过后，您的本地数据将保留，但不会同步到云端
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">
                            您还没有本地数据。开始使用应用后，您可以随时在设置中迁移数据。
                        </p>
                        <button
                            onClick={onSkip}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            继续
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
