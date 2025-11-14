/**
 * 版本历史组件
 * 显示 Gist 的版本历史列表，支持预览和恢复历史版本
 */

import { useState, useEffect } from 'react';
import { gistService } from '@/services/gistService';
import type { GistVersion, GistData } from '@/types/gist';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/common/LoadingState';
import ErrorMessage from '@/components/common/ErrorMessage';
import { formatRelativeTime } from '@/utils/dateUtils';

interface VersionHistoryProps {
    gistId: string;
    onRestore?: (data: GistData) => void;
}

export function VersionHistory({ gistId, onRestore }: VersionHistoryProps) {
    const { getToken } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [versions, setVersions] = useState<GistVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<GistData | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    useEffect(() => {
        const initToken = async () => {
            const t = await getToken();
            setToken(t);
        };
        initToken();
    }, [getToken]);

    useEffect(() => {
        if (token !== null) {
            loadVersionHistory();
        }
    }, [gistId, token]);

    const loadVersionHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const history = await gistService.getGistHistory(gistId, token || undefined);
            setVersions(history);
        } catch (err) {
            console.error('加载版本历史失败:', err);
            setError(err instanceof Error ? err.message : '加载版本历史失败');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (version: string) => {
        try {
            setLoadingPreview(true);
            setSelectedVersion(version);
            const data = await gistService.getGistVersion(gistId, version, token || undefined);
            setPreviewData(data);
        } catch (err) {
            console.error('加载版本预览失败:', err);
            setError(err instanceof Error ? err.message : '加载版本预览失败');
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleRestore = () => {
        if (previewData && onRestore) {
            onRestore(previewData);
        }
    };

    if (loading) {
        return <LoadingState message="加载版本历史..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadVersionHistory} />;
    }

    if (versions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                暂无版本历史
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">版本历史</h3>
                <span className="text-sm text-gray-500">共 {versions.length} 个版本</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 版本列表 */}
                <div className="space-y-2">
                    {versions.map((version) => (
                        <div
                            key={version.version}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedVersion === version.version
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => handlePreview(version.version)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatRelativeTime(new Date(version.committedAt))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(version.committedAt).toLocaleString('zh-CN')}
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="text-green-600">
                                        +{version.changeStats.additions}
                                    </span>
                                    <span className="text-red-600">
                                        -{version.changeStats.deletions}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 预览面板 */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    {!selectedVersion && (
                        <div className="text-center py-8 text-gray-500">
                            选择一个版本查看详情
                        </div>
                    )}

                    {loadingPreview && (
                        <LoadingState message="加载预览..." />
                    )}

                    {selectedVersion && !loadingPreview && previewData && (
                        <div className="space-y-4">
                            <h4 className="font-semibold">版本详情</h4>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">资源数量:</span>
                                    <span className="font-medium">{previewData.resources.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">大问题数量:</span>
                                    <span className="font-medium">{previewData.questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">小问题数量:</span>
                                    <span className="font-medium">{previewData.subQuestions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">回答数量:</span>
                                    <span className="font-medium">{previewData.answers.length}</span>
                                </div>
                            </div>

                            {onRestore && (
                                <button
                                    onClick={handleRestore}
                                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    恢复到此版本
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
