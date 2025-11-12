/**
 * 配置向导
 * 引导用户选择拥有者模式或访客模式
 */

import React, { useState } from 'react';
import TokenSetup from './TokenSetup';
import GistIdInput from './GistIdInput';

type SetupStep = 'mode-selection' | 'token-setup' | 'gist-input';

interface SetupWizardProps {
    onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState<SetupStep>('mode-selection');

    const handleOwnerMode = () => {
        setStep('token-setup');
    };

    const handleVisitorMode = () => {
        setStep('gist-input');
    };

    const handleBack = () => {
        setStep('mode-selection');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {step === 'mode-selection' && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        {/* 标题 */}
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                                <svg
                                    className="w-12 h-12 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                欢迎使用个人知识管理系统
                            </h1>
                            <p className="text-gray-600">
                                选择使用模式开始你的知识管理之旅
                            </p>
                        </div>

                        {/* 模式选择 */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* 拥有者模式 */}
                            <button
                                onClick={handleOwnerMode}
                                className="group relative bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">拥有者模式</h3>
                                    <p className="text-sm text-white/90 mb-4">
                                        配置 GitHub Token 管理你的数据
                                    </p>
                                    <ul className="text-sm text-left space-y-2 text-white/80">
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            完整的增删改查功能
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            数据自动同步到 GitHub
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            跨设备访问
                                        </li>
                                    </ul>
                                </div>
                            </button>

                            {/* 访客模式 */}
                            <button
                                onClick={handleVisitorMode}
                                className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                                        <svg
                                            className="w-8 h-8 text-gray-600 group-hover:text-primary transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        访客模式
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        输入 Gist ID 查看他人的知识库
                                    </p>
                                    <ul className="text-sm text-left space-y-2 text-gray-600">
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            只读查看模式
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            无需 GitHub 账号
                                        </li>
                                        <li className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            快速浏览内容
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </div>

                        {/* 提示信息 */}
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 提示：你可以随时在设置中切换模式
                            </p>
                        </div>
                    </div>
                )}

                {step === 'token-setup' && (
                    <TokenSetup onBack={handleBack} onComplete={onComplete} />
                )}

                {step === 'gist-input' && (
                    <GistIdInput onBack={handleBack} onComplete={onComplete} />
                )}
            </div>
        </div>
    );
};

export default SetupWizard;
