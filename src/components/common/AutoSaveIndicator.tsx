/**
 * 自动保存指示器组件
 * 显示"已自动保存"通知
 */

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export interface AutoSaveIndicatorProps {
    isSaving: boolean;
    lastSaved: Date | null;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
    isSaving,
    lastSaved,
}) => {
    const [showNotification, setShowNotification] = useState(false);

    // 显示保存成功通知
    useEffect(() => {
        if (lastSaved && !isSaving) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [lastSaved, isSaving]);

    // 格式化时间
    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    if (!showNotification && !isSaving) return null;

    return (
        <div
            className="
                fixed bottom-4 right-4
                px-4 py-2 rounded-lg
                flex items-center gap-2
                shadow-lg
                animate-fadeIn
                z-50
            "
            style={{
                backgroundColor: isSaving ? '#FFF9E6' : '#2E7D32',
                color: isSaving ? '#666' : 'white',
            }}
        >
            {isSaving ? (
                <>
                    <div className="w-4 h-4 border-2 border-[#666] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">保存中...</span>
                </>
            ) : (
                <>
                    <Check size={16} />
                    <span className="text-sm font-medium">
                        已自动保存 {lastSaved && `(${formatTime(lastSaved)})`}
                    </span>
                </>
            )}
        </div>
    );
};
