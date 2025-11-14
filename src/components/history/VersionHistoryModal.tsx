/**
 * 版本历史模态框
 * 包含版本恢复确认对话框
 */

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { VersionHistory } from './VersionHistory';
import type { GistData } from '@/types/gist';
import { useToast } from '@/hooks/useToast';
import { syncService } from '@/services/syncService';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    gistId: string;
}

export function VersionHistoryModal({ isOpen, onClose, gistId }: VersionHistoryModalProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedData, setSelectedData] = useState<GistData | null>(null);
    const [restoring, setRestoring] = useState(false);
    const { showToast } = useToast();

    const handleRestore = (data: GistData) => {
        setSelectedData(data);
        setShowConfirm(true);
    };

    const confirmRestore = async () => {
        if (!selectedData) return;

        try {
            setRestoring(true);

            // 使用 SyncService 恢复数据
            await syncService.restoreFromVersion(selectedData);

            showToast('success', '版本恢复成功');
            setShowConfirm(false);
            onClose();
        } catch (error) {
            console.error('恢复版本失败:', error);
            showToast(
                'error',
                error instanceof Error ? error.message : '恢复版本失败'
            );
        } finally {
            setRestoring(false);
        }
    };

    const cancelRestore = () => {
        setShowConfirm(false);
        setSelectedData(null);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="版本历史"
            >
                <div className="p-6">
                    <VersionHistory gistId={gistId} onRestore={handleRestore} />
                </div>
            </Modal>

            {/* 确认对话框 */}
            <Modal
                isOpen={showConfirm}
                onClose={cancelRestore}
                title="确认恢复版本"
            >
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        确定要恢复到此版本吗？当前的数据将被替换。
                    </p>

                    {selectedData && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">资源数量:</span>
                                <span className="font-medium">{selectedData.resources.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">大问题数量:</span>
                                <span className="font-medium">{selectedData.questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">小问题数量:</span>
                                <span className="font-medium">{selectedData.subQuestions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">回答数量:</span>
                                <span className="font-medium">{selectedData.answers.length}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={cancelRestore}
                            disabled={restoring}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            取消
                        </button>
                        <button
                            onClick={confirmRestore}
                            disabled={restoring}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {restoring ? '恢复中...' : '确认恢复'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
