import { useState, useCallback } from 'react';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonType?: 'primary' | 'danger';
}

interface UseConfirmReturn {
    isOpen: boolean;
    confirmOptions: ConfirmOptions | null;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    handleConfirm: () => void;
    handleCancel: () => void;
}

/**
 * useConfirm Hook
 * 管理确认对话框状态
 */
export const useConfirm = (): UseConfirmReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        setConfirmOptions(options);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(true);
        }
        setIsOpen(false);
        setConfirmOptions(null);
        setResolvePromise(null);
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(false);
        }
        setIsOpen(false);
        setConfirmOptions(null);
        setResolvePromise(null);
    }, [resolvePromise]);

    return {
        isOpen,
        confirmOptions,
        confirm,
        handleConfirm,
        handleCancel,
    };
};

export default useConfirm;
