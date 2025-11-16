/**
 * ModeSwitcherModal组件
 * 展示模式选择界面的模态弹窗
 */

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ModeCard } from './ModeCard';
import { TokenInputForm } from './TokenInputForm';
import { MODE_CONFIG } from '@/constants/modeConfig';
import { authService } from '@/services/authService';
import { gistService } from '@/services/gistService';
import LoadingState from '@/components/common/LoadingState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { AppMode } from '@/types/auth';

export interface ModeSwitcherModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => Promise<void>;
}

export const ModeSwitcherModal: React.FC<ModeSwitcherModalProps> = ({
    isOpen,
    onClose,
    currentMode,
    onModeChange,
}) => {
    const [selectedMode, setSelectedMode] = useState<AppMode | null>(null);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [token, setToken] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogData, setConfirmDialogData] = useState<{
        gistId?: string;
        username?: string;
    }>({});

    // 重置状态
    const resetState = () => {
        setSelectedMode(null);
        setShowTokenInput(false);
        setToken('');
        setIsValidating(false);
        setValidationMessage('');
        setError(null);
        setShowConfirmDialog(false);
        setConfirmDialogData({});
    };

    // 处理关闭
    const handleClose = () => {
        resetState();
        onClose();
    };

    // 处理模式选择
    const handleModeSelect = async (mode: AppMode) => {
        setError(null);
        setSelectedMode(mode);

        // 如果选择的是当前模式，直接关闭
        if (mode === currentMode) {
            handleClose();
            return;
        }

        // 如果选择访客模式，直接切换
        if (mode === 'visitor') {
            try {
                await onModeChange(mode);
                handleClose();
            } catch (err) {
                setError(err instanceof Error ? err.message : '切换失败，请重试');
            }
            return;
        }

        // 如果选择拥有者模式，检查是否有Token
        if (mode === 'owner') {
            const existingToken = await authService.getToken();
            const currentGistId = authService.getGistId();

            if (existingToken) {
                // 有现有Token，需要验证Token和Gist拥有者权限
                setIsValidating(true);
                try {
                    // 1. 验证Token是否有效
                    setValidationMessage('正在验证 Token...');
                    const validation = await gistService.validateToken(existingToken);
                    if (!validation.valid) {
                        // Token无效，显示输入表单
                        setShowTokenInput(true);
                        setError('Token已失效，请重新输入');
                        return;
                    }

                    // 2. 如果有Gist ID，验证用户是否是拥有者
                    if (currentGistId) {
                        setValidationMessage('正在验证 Gist 拥有者权限...');
                        const ownershipCheck = await gistService.verifyGistOwnership(
                            currentGistId,
                            existingToken
                        );

                        if (!ownershipCheck.isOwner) {
                            setError(
                                `你不是当前 Gist 的拥有者${ownershipCheck.ownerUsername
                                    ? `（拥有者：${ownershipCheck.ownerUsername}）`
                                    : ''
                                }，无法切换到拥有者模式。\n\n如需编辑，请创建自己的副本。`
                            );
                            setSelectedMode(null);
                            return;
                        }
                    }

                    // 3. Token有效且有权限，显示确认对话框
                    setValidationMessage('');
                    setConfirmDialogData({
                        gistId: currentGistId || undefined,
                        username: validation.username,
                    });
                    setShowConfirmDialog(true);
                } catch (err) {
                    setError(err instanceof Error ? err.message : '验证失败，请重试');
                    setSelectedMode(null);
                } finally {
                    setIsValidating(false);
                    setValidationMessage('');
                }
            } else {
                // 没有Token，显示输入表单
                setShowTokenInput(true);
            }
        }
    };

    // 处理Token提交
    const handleTokenSubmit = async () => {
        if (!token.trim()) {
            setError('请输入Token');
            return;
        }

        setIsValidating(true);
        setError(null);

        try {
            // 验证Token
            const validation = await gistService.validateToken(token);
            if (!validation.valid) {
                throw new Error(validation.error || 'Token无效，请检查后重试');
            }

            // 设置Token
            const success = await authService.setToken(token);
            if (!success) {
                throw new Error('Token设置失败，请重试');
            }

            // 切换模式
            await onModeChange('owner');
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : '验证失败，请重试');
        } finally {
            setIsValidating(false);
        }
    };

    // 处理取消Token输入
    const handleTokenCancel = () => {
        setShowTokenInput(false);
        setToken('');
        setError(null);
        setSelectedMode(null);
    };

    // 处理确认切换模式
    const handleConfirmModeSwitch = async () => {
        setShowConfirmDialog(false);
        try {
            await onModeChange('owner');
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : '切换失败，请重试');
            setSelectedMode(null);
        }
    };

    // 处理取消切换模式
    const handleCancelModeSwitch = () => {
        setShowConfirmDialog(false);
        setSelectedMode(null);
        setConfirmDialogData({});
    };

    // 生成确认对话框的消息
    const getConfirmMessage = () => {
        const parts = ['切换后你将拥有完整的编辑权限，所有修改会自动同步到云端。'];

        if (confirmDialogData.username) {
            parts.unshift(`当前用户：${confirmDialogData.username}`);
        }

        if (confirmDialogData.gistId) {
            parts.push(`\nGist ID: ${confirmDialogData.gistId}`);
        }

        return parts.join('\n');
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={showTokenInput ? undefined : '选择访问模式'}
                showCloseButton={!isValidating}
                closeOnOverlayClick={!isValidating}
                className="max-w-4xl"
            >
                {isValidating && validationMessage ? (
                    // 验证状态显示
                    <div className="py-8">
                        <LoadingState message={validationMessage} />
                    </div>
                ) : showTokenInput ? (
                    // Token输入表单
                    <TokenInputForm
                        token={token}
                        onTokenChange={setToken}
                        onSubmit={handleTokenSubmit}
                        onCancel={handleTokenCancel}
                        isValidating={isValidating}
                        error={error}
                    />
                ) : (
                    <>
                        {/* 模式选择卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="listbox">
                            <ModeCard
                                mode="visitor"
                                title={MODE_CONFIG.visitor.title}
                                description={MODE_CONFIG.visitor.description}
                                icon={MODE_CONFIG.visitor.icon}
                                features={MODE_CONFIG.visitor.features}
                                isActive={currentMode === 'visitor'}
                                isSelected={selectedMode === 'visitor'}
                                onSelect={() => handleModeSelect('visitor')}
                            />
                            <ModeCard
                                mode="owner"
                                title={MODE_CONFIG.owner.title}
                                description={MODE_CONFIG.owner.description}
                                icon={MODE_CONFIG.owner.icon}
                                features={MODE_CONFIG.owner.features}
                                isActive={currentMode === 'owner'}
                                isSelected={selectedMode === 'owner'}
                                onSelect={() => handleModeSelect('owner')}
                            />
                        </div>

                        {/* 错误提示 */}
                        {error && !isValidating && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                            </div>
                        )}
                    </>
                )}
            </Modal>

            {/* 确认对话框 */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="确认切换到拥有者模式"
                message={getConfirmMessage()}
                confirmText="确认切换"
                cancelText="取消"
                confirmButtonType="primary"
                onConfirm={handleConfirmModeSwitch}
                onCancel={handleCancelModeSwitch}
            />
        </>
    );
};
