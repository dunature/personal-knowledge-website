import React, { useState, useEffect } from 'react';
import { QuestionModalWithEdit } from '../components/qa/QuestionModalWithEdit';
import { Button } from '../components/ui/Button';
import { permissionService } from '../services/permissionService';
import { authService } from '../services/authService';
import type { BigQuestion, SubQuestion } from '../types/question';

/**
 * 权限控制测试页面
 * 用于测试访客模式和拥有者模式下的权限控制
 */
export const PermissionTest: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMode, setCurrentMode] = useState<'owner' | 'visitor'>('visitor');
    const [forceUpdate, setForceUpdate] = useState(0);

    // 测试用的问题数据
    const testQuestion: BigQuestion = {
        id: 'test-question-1',
        title: '测试问题：权限控制验证',
        description: '这是一个用于测试权限控制的问题。在访客模式下，所有编辑、删除、添加按钮应该被隐藏。',
        status: 'solving',
        category: '测试',
        summary: '这是最终总结部分。在访客模式下，编辑按钮应该被隐藏。',
        sub_questions: ['sub-1', 'sub-2'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const testSubQuestions: SubQuestion[] = [
        {
            id: 'sub-1',
            parent_id: 'test-question-1',
            title: '小问题 1：访客模式测试',
            status: 'solved',
            answers: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 'sub-2',
            parent_id: 'test-question-1',
            title: '小问题 2：拥有者模式测试',
            status: 'solving',
            answers: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    const handleSave = async (updates: Partial<BigQuestion>) => {
        console.log('问题已更新:', updates);
    };

    const handleDelete = () => {
        console.log('问题已删除');
        setIsModalOpen(false);
    };

    // 初始化时获取当前模式
    useEffect(() => {
        const mode = authService.getMode();
        setCurrentMode(mode);
    }, [forceUpdate]);

    const toggleMode = () => {
        const newMode = currentMode === 'owner' ? 'visitor' : 'owner';

        // 使用 authService 切换模式
        authService.switchMode(newMode);

        // 更新本地状态
        setCurrentMode(newMode);

        // 强制组件重新渲染
        setForceUpdate(prev => prev + 1);
    };

    const currentPermissions = {
        canEdit: permissionService.canEdit(),
        canDelete: permissionService.canDelete(),
        canCreate: permissionService.canCreate()
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    权限控制测试页面
                </h1>

                {/* 当前模式显示 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">当前模式</h2>
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg ${currentMode === 'owner'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}>
                            {currentMode === 'owner' ? '🔓 拥有者模式' : '🔒 访客模式'}
                        </div>
                        <Button
                            variant="primary"
                            onClick={toggleMode}
                        >
                            切换到 {currentMode === 'owner' ? '访客' : '拥有者'} 模式
                        </Button>
                        <div className="text-sm text-gray-600">
                            实际模式: {authService.getMode()}
                        </div>
                    </div>
                </div>

                {/* 权限状态显示 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">当前权限状态</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${currentPermissions.canEdit ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            <span>编辑权限: {currentPermissions.canEdit ? '✓ 允许' : '✗ 禁止'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${currentPermissions.canDelete ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            <span>删除权限: {currentPermissions.canDelete ? '✓ 允许' : '✗ 禁止'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${currentPermissions.canCreate ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            <span>添加权限: {currentPermissions.canCreate ? '✓ 允许' : '✗ 禁止'}</span>
                        </div>
                    </div>
                </div>

                {/* 测试说明 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试说明</h2>
                    <div className="space-y-3 text-gray-700">
                        <p><strong>访客模式下应该：</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>隐藏顶部栏的"编辑"按钮</li>
                            <li>隐藏顶部栏的"删除"按钮</li>
                            <li>隐藏顶部栏的"状态"下拉选择器</li>
                            <li>隐藏问题描述的"编辑"按钮</li>
                            <li>隐藏小问题部分的"+ 添加小问题"按钮</li>
                            <li>隐藏每个小问题的"编辑"和"删除"按钮</li>
                            <li>隐藏 THE END 部分的"编辑"按钮</li>
                        </ul>
                        <p className="mt-4"><strong>拥有者模式下应该：</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>显示所有编辑、删除、添加按钮</li>
                            <li>所有功能正常工作</li>
                        </ul>
                    </div>
                </div>

                {/* 打开测试弹窗按钮 */}
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => setIsModalOpen(true)}
                    >
                        打开问题弹窗进行测试
                    </Button>
                </div>

                {/* 问题弹窗 */}
                <QuestionModalWithEdit
                    question={testQuestion}
                    subQuestions={testSubQuestions}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};
