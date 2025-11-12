/**
 * Drawer组件
 * 从右侧滑出的抽屉，用于编辑器等
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = '60%',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = '',
}) => {
    // 阻止背景滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ESC键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const drawerVariants = {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* 遮罩层 */}
                    <motion.div
                        className="absolute inset-0 bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        onClick={handleOverlayClick}
                    />

                    {/* 抽屉内容 */}
                    <motion.div
                        className={`ml-auto relative bg-white h-full shadow-modal overflow-hidden flex flex-col ${className}`}
                        style={{ width }}
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'drawer-title' : undefined}
                    >
                        {/* 标题栏 */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-divider flex-shrink-0">
                                {title && (
                                    <h2 id="drawer-title" className="text-h2 font-semibold text-text">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-background-secondary transition-fast focus:outline-none focus:ring-2 focus:ring-primary ml-auto"
                                        aria-label="关闭抽屉"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* 内容区 */}
                        <div className="flex-1 overflow-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
