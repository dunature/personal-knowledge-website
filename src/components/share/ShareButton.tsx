/**
 * 分享按钮组件
 * 生成并复制分享链接到剪贴板
 */

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { getButtonStyles } from '@/styles/buttonStyles';

interface ShareButtonProps {
    className?: string;
    showText?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    className = '',
    showText = true,
}) => {
    const { mode } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareLink = authService.generateShareLink();

        if (!shareLink) {
            alert('无法生成分享链接：未找到 Gist ID');
            return;
        }

        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);

            // 3秒后重置状态
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        } catch (error) {
            console.error('复制失败:', error);
            alert('复制失败，请手动复制链接：\n' + shareLink);
        }
    };

    // 只在拥有者模式显示
    if (mode !== 'owner') {
        return null;
    }

    return (
        <button
            onClick={handleShare}
            className={getButtonStyles('primary', 'medium', false, className)}
            disabled={copied}
            title={copied ? '已复制到剪贴板' : '分享数据'}
        >
            {copied ? (
                <>
                    <Check size={18} />
                    {showText && <span>已复制</span>}
                </>
            ) : (
                <>
                    <Share2 size={18} />
                    {showText && <span>分享</span>}
                </>
            )}
        </button>
    );
};
