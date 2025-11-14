/**
 * URL Gist 处理器
 * 处理分享链接中的 Gist ID 参数
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncService } from '@/services/syncService';
import { useToast } from '@/hooks/useToast';

export function UrlGistHandler() {
    const { switchMode, setGistId, gistId } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        handleUrlGistId();
    }, []);

    const handleUrlGistId = async () => {
        try {
            // 检查 URL 参数
            const urlParams = new URLSearchParams(window.location.search);
            const sharedGistId = urlParams.get('gist');

            if (!sharedGistId) {
                return;
            }

            // 如果已经加载了这个 Gist，不重复加载
            if (gistId === sharedGistId) {
                return;
            }

            console.log('检测到分享链接，Gist ID:', sharedGistId);

            // 切换到访客模式
            switchMode('visitor');

            // 设置 Gist ID
            setGistId(sharedGistId);

            // 从 Gist 加载数据
            showToast('info', '正在加载分享的知识库...');
            const result = await syncService.syncFromGist();

            if (result.success) {
                showToast('success', '成功加载分享的知识库');
                // 清除 URL 参数，避免刷新时重复加载
                window.history.replaceState({}, '', window.location.pathname);
            } else {
                showToast('error', result.error || '加载失败');
            }
        } catch (error) {
            console.error('处理分享链接失败:', error);
            showToast('error', '加载分享的知识库失败');
        }
    };

    return null;
}
