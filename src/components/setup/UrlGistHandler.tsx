/**
 * URL Gist 处理器
 * 处理分享链接中的 Gist ID 参数，自动加载数据
 */

import { useGistUrlLoader } from '@/hooks/useGistUrlLoader';
import { GistLoadingModal } from '@/components/gist/GistLoadingModal';
import { GistDataConflictDialog } from '@/components/gist/GistDataConflictDialog';

export function UrlGistHandler() {
    const {
        isLoading,
        error,
        gistId,
        hasLocalData,
        localDataStats,
        remoteDataStats,
        confirmAndLoad,
        retry,
        dismiss,
    } = useGistUrlLoader();

    return (
        <>
            {/* 加载状态 Modal */}
            <GistLoadingModal
                isOpen={isLoading || (!!error && !hasLocalData)}
                isLoading={isLoading}
                error={error}
                gistId={gistId}
                onRetry={retry}
                onClose={dismiss}
            />

            {/* 数据冲突对话框 */}
            <GistDataConflictDialog
                isOpen={hasLocalData}
                localDataStats={localDataStats}
                remoteDataStats={remoteDataStats}
                onUseRemote={() => confirmAndLoad(true)}
                onKeepLocal={() => confirmAndLoad(false)}
                onCancel={dismiss}
            />
        </>
    );
}
