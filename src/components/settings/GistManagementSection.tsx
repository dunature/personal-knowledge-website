/**
 * Gist 管理区域组件
 * 在设置页面显示 Gist 信息、输入和操作功能
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CurrentGistInfo from './CurrentGistInfo';
import GistIdInputForm from './GistIdInputForm';
import GistActions from './GistActions';

interface GistInfo {
    id: string;
    description: string;
    created_at: string;
    updated_at: string;
    public: boolean;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export default function GistManagementSection() {
    const { gistId, mode } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [gistInfo, setGistInfo] = useState<GistInfo | null>(null);
    const [showInput, setShowInput] = useState(false);

    // 当 Gist ID 变化时，重置状态
    useEffect(() => {
        if (gistId) {
            setShowInput(false);
        }
    }, [gistId]);



    const handleInputSuccess = () => {
        setShowInput(false);
        setError(null);
    };

    const handleInputError = (errorMsg: string) => {
        setError(errorMsg);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gist 数据管理</h2>

            {/* 当前 Gist 信息 */}
            {gistId && !showInput && (
                <CurrentGistInfo
                    gistId={gistId}
                    gistInfo={gistInfo}
                    mode={mode}
                />
            )}

            {/* 分隔线 */}
            {gistId && !showInput && (
                <div className="my-6 border-t border-gray-200" />
            )}

            {/* Gist ID 输入表单 */}
            {(!gistId || showInput) && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {mode === 'owner' ? '创建或连接 Gist' : '输入 Gist ID'}
                    </h3>
                    {mode === 'owner' && !gistId && (
                        <p className="text-sm text-gray-600 mb-4">
                            💡 提示：在拥有者模式下，系统会自动为你创建一个新的 Gist 用于存储数据。你也可以输入已有的 Gist ID 来连接现有数据。
                        </p>
                    )}
                    <GistIdInputForm
                        mode={mode}
                        onSuccess={handleInputSuccess}
                        onError={handleInputError}
                    />
                    {gistId && showInput && (
                        <button
                            onClick={() => setShowInput(false)}
                            className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                        >
                            取消
                        </button>
                    )}
                </div>
            )}

            {/* 显示输入按钮（仅在访客模式下显示） */}
            {gistId && !showInput && mode === 'visitor' && (
                <button
                    onClick={() => setShowInput(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    更换 Gist ID
                </button>
            )}

            {/* 分隔线 */}
            {gistId && !showInput && (
                <div className="my-6 border-t border-gray-200" />
            )}

            {/* Gist 操作按钮 */}
            {gistId && !showInput && (
                <GistActions
                    gistId={gistId}
                    mode={mode}
                    onDisconnect={() => {
                        setGistInfo(null);
                        setError(null);
                    }}
                    onGenerateShareLink={() => { }}
                />
            )}

            {/* 错误提示 */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <svg
                        className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}
        </div>
    );
}
