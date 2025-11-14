/**
 * 配置守卫组件
 * 检测用户是否已配置，未配置则显示配置向导
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SetupWizard from './SetupWizard';
import LoadingState from '@/components/common/LoadingState';

interface SetupGuardProps {
    children: React.ReactNode;
}

export function SetupGuard({ children }: SetupGuardProps) {
    const { isAuthenticated, mode, gistId } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        checkSetupStatus();
    }, [isAuthenticated, mode, gistId]);

    const checkSetupStatus = async () => {
        try {
            // 检查 URL 参数中是否有 gist ID（分享链接）
            const urlParams = new URLSearchParams(window.location.search);
            const sharedGistId = urlParams.get('gist');

            if (sharedGistId) {
                // 如果是分享链接，不需要显示配置向导
                setShowSetup(false);
                setIsLoading(false);
                return;
            }

            // 检查是否已配置
            const needsSetup = !isAuthenticated && !gistId && mode === 'owner';

            setShowSetup(needsSetup);
        } catch (error) {
            console.error('检查配置状态失败:', error);
            setShowSetup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupComplete = () => {
        setShowSetup(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingState message="加载中..." />
            </div>
        );
    }

    if (showSetup) {
        return <SetupWizard onComplete={handleSetupComplete} />;
    }

    return <>{children}</>;
}
