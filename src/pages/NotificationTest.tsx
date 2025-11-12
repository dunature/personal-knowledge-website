import React, { useState } from 'react';
import { ToastContainer, ConfirmDialog } from '../components/common';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';

/**
 * 通知系统测试页面
 */
const NotificationTest: React.FC = () => {
    const {
        toasts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        hideToast,
        clearAll,
    } = useToast();

    const { isOpen, confirmOptions, confirm, handleConfirm, handleCancel } = useConfirm();

    const [loadingToastId, setLoadingToastId] = useState<string | null>(null);
    const [confirmResult, setConfirmResult] = useState<string>('');

    const handleShowLoading = () => {
        const id = showLoading('正在处理...');
        setLoadingToastId(id);

        // 模拟异步操作
        setTimeout(() => {
            if (id) {
                hideToast(id);
                showSuccess('操作完成！');
                setLoadingToastId(null);
            }
        }, 3000);
    };

    const handleConfirmAction = async () => {
        const result = await confirm({
            title: '确认删除',
            message: '您确定要删除这个项目吗？此操作无法撤销。',
            confirmText: '删除',
            cancelText: '取消',
            confirmButtonType: 'danger',
        });

        if (result) {
            setConfirmResult('用户点击了"删除"');
            showSuccess('项目已删除');
        } else {
            setConfirmResult('用户点击了"取消"');
            showInfo('操作已取消');
        }
    };

    const handleSaveConfirm = async () => {
        const result = await confirm({
            title: '保存更改',
            message: '您有未保存的更改，是否要保存？',
            confirmText: '保存',
            cancelText: '不保存',
        });

        if (result) {
            setConfirmResult('用户选择保存');
            showSuccess('更改已保存');
        } else {
            setConfirmResult('用户选择不保存');
            showWarning('更改未保存');
        }
    };

    return (
        <div className="min-h-screen bg-background-secondary p-xl">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-h1 text-text mb-lg">通知系统测试</h1>

                {/* Toast 测试 */}
                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">1. Toast 通知测试</h2>
                    <p className="text-body text-secondary mb-md">
                        点击按钮显示不同类型的Toast通知
                    </p>

                    <div className="grid grid-cols-2 gap-md mb-lg">
                        <button
                            onClick={() => showSuccess('操作成功！')}
                            className="px-lg py-sm bg-success text-white rounded-medium hover:bg-success/80 transition-colors"
                        >
                            成功提示 (2秒)
                        </button>

                        <button
                            onClick={() => showError('操作失败，请重试')}
                            className="px-lg py-sm bg-error text-white rounded-medium hover:bg-error/80 transition-colors"
                        >
                            错误提示 (3秒)
                        </button>

                        <button
                            onClick={() => showWarning('请注意：这是一个警告信息')}
                            className="px-lg py-sm bg-warning text-white rounded-medium hover:bg-warning/80 transition-colors"
                        >
                            警告提示 (3秒)
                        </button>

                        <button
                            onClick={() => showInfo('这是一条信息提示')}
                            className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                        >
                            信息提示 (3秒)
                        </button>

                        <button
                            onClick={handleShowLoading}
                            disabled={loadingToastId !== null}
                            className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            加载提示 (3秒后自动完成)
                        </button>

                        <button
                            onClick={clearAll}
                            className="px-lg py-sm bg-secondary text-white rounded-medium hover:bg-secondary/80 transition-colors"
                        >
                            清除所有通知
                        </button>
                    </div>

                    <div className="bg-background-secondary p-md rounded-medium">
                        <p className="text-small text-secondary">
                            当前显示的Toast数量: <span className="font-semibold">{toasts.length}</span>
                        </p>
                    </div>
                </section>

                {/* 多个Toast测试 */}
                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">2. 多个Toast测试</h2>
                    <p className="text-body text-secondary mb-md">
                        测试同时显示多个Toast通知
                    </p>

                    <button
                        onClick={() => {
                            showSuccess('第一条消息');
                            setTimeout(() => showInfo('第二条消息'), 200);
                            setTimeout(() => showWarning('第三条消息'), 400);
                            setTimeout(() => showError('第四条消息'), 600);
                        }}
                        className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                    >
                        显示4条连续消息
                    </button>
                </section>

                {/* 确认对话框测试 */}
                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">3. 确认对话框测试</h2>
                    <p className="text-body text-secondary mb-md">
                        测试不同类型的确认对话框
                    </p>

                    <div className="grid grid-cols-2 gap-md mb-lg">
                        <button
                            onClick={handleConfirmAction}
                            className="px-lg py-sm bg-error text-white rounded-medium hover:bg-error/80 transition-colors"
                        >
                            危险操作确认（删除）
                        </button>

                        <button
                            onClick={handleSaveConfirm}
                            className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                        >
                            保存确认
                        </button>
                    </div>

                    {confirmResult && (
                        <div className="bg-primary-light p-md rounded-medium">
                            <p className="text-body text-primary">
                                上次确认结果: <span className="font-semibold">{confirmResult}</span>
                            </p>
                        </div>
                    )}
                </section>

                {/* 自定义时长测试 */}
                <section className="bg-white rounded-card shadow-card p-xl mb-lg">
                    <h2 className="text-h2 text-text mb-md">4. 自定义时长测试</h2>
                    <p className="text-body text-secondary mb-md">
                        测试不同持续时间的Toast
                    </p>

                    <div className="grid grid-cols-3 gap-md">
                        <button
                            onClick={() => showSuccess('1秒后消失', 1000)}
                            className="px-lg py-sm bg-success text-white rounded-medium hover:bg-success/80 transition-colors"
                        >
                            1秒
                        </button>

                        <button
                            onClick={() => showInfo('5秒后消失', 5000)}
                            className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                        >
                            5秒
                        </button>

                        <button
                            onClick={() => showWarning('10秒后消失', 10000)}
                            className="px-lg py-sm bg-warning text-white rounded-medium hover:bg-warning/80 transition-colors"
                        >
                            10秒
                        </button>
                    </div>
                </section>

                {/* 长文本测试 */}
                <section className="bg-white rounded-card shadow-card p-xl">
                    <h2 className="text-h2 text-text mb-md">5. 长文本测试</h2>
                    <p className="text-body text-secondary mb-md">
                        测试Toast显示长文本的效果
                    </p>

                    <button
                        onClick={() =>
                            showInfo(
                                '这是一条很长的消息，用于测试Toast组件在显示长文本时的表现。消息应该能够正确换行并保持良好的可读性。'
                            )
                        }
                        className="px-lg py-sm bg-primary text-white rounded-medium hover:bg-primary-hover transition-colors"
                    >
                        显示长文本消息
                    </button>
                </section>
            </div>

            {/* Toast容器 */}
            <ToastContainer toasts={toasts} onClose={hideToast} />

            {/* 确认对话框 */}
            {confirmOptions && (
                <ConfirmDialog
                    isOpen={isOpen}
                    title={confirmOptions.title}
                    message={confirmOptions.message}
                    confirmText={confirmOptions.confirmText}
                    cancelText={confirmOptions.cancelText}
                    confirmButtonType={confirmOptions.confirmButtonType}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default NotificationTest;
