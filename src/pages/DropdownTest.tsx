/**
 * Dropdown 测试页面
 * 用于测试 Dropdown 组件在不同场景下的表现
 */

import React, { useState } from 'react';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';

export const DropdownTest: React.FC = () => {
    const [value1, setValue1] = useState('option1');
    const [value2, setValue2] = useState('option1');
    const [value3, setValue3] = useState('option1');

    const options: DropdownOption[] = [
        { value: 'option1', label: '选项 1' },
        { value: 'option2', label: '选项 2' },
        { value: 'option3', label: '选项 3' },
        { value: 'option4', label: '选项 4' },
        { value: 'option5', label: '选项 5' },
        { value: 'option6', label: '选项 6' },
        { value: 'option7', label: '选项 7' },
        { value: 'option8', label: '选项 8' },
        { value: 'option9', label: '选项 9' },
        { value: 'option10', label: '选项 10' },
    ];

    const optionsWithDisabled: DropdownOption[] = [
        { value: 'option1', label: '选项 1' },
        { value: 'option2', label: '选项 2' },
        {
            value: 'option3',
            label: '选项 3（禁用）',
            disabled: true,
            disabledReason: '这个选项被禁用了，因为不满足某些条件'
        },
        { value: 'option4', label: '选项 4' },
        { value: 'option5', label: '选项 5' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* 标题 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-[#333] mb-2">
                        Dropdown 测试页面
                    </h1>
                    <p className="text-[#666]">
                        测试 Dropdown 组件在不同场景下的表现
                    </p>
                </div>

                {/* 测试 1: 普通 Dropdown */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">
                        测试 1: 普通 Dropdown
                    </h2>
                    <div className="max-w-md">
                        <Dropdown
                            options={options}
                            value={value1}
                            onChange={setValue1}
                        />
                    </div>
                    <p className="mt-4 text-sm text-[#666]">
                        当前选择: <span className="font-semibold">{value1}</span>
                    </p>
                </div>

                {/* 测试 2: 带禁用选项的 Dropdown */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">
                        测试 2: 带禁用选项的 Dropdown
                    </h2>
                    <div className="max-w-md">
                        <Dropdown
                            options={optionsWithDisabled}
                            value={value2}
                            onChange={setValue2}
                        />
                    </div>
                    <p className="mt-4 text-sm text-[#666]">
                        当前选择: <span className="font-semibold">{value2}</span>
                    </p>
                </div>

                {/* 测试 3: 在 overflow 容器中的 Dropdown */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#333] mb-4">
                        测试 3: 在 overflow 容器中的 Dropdown
                    </h2>
                    <div className="border border-[#E0E0E0] rounded-lg overflow-y-auto max-h-[300px] p-4">
                        <p className="text-sm text-[#666] mb-4">
                            这个容器有 overflow-y-auto 和 max-h-[300px]，模拟 QuestionModalWithEdit 的场景
                        </p>
                        <div className="max-w-md">
                            <Dropdown
                                options={options}
                                value={value3}
                                onChange={setValue3}
                            />
                        </div>
                        <p className="mt-4 text-sm text-[#666]">
                            当前选择: <span className="font-semibold">{value3}</span>
                        </p>
                        {/* 添加一些内容让容器可以滚动 */}
                        <div className="mt-8 space-y-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <p key={i} className="text-sm text-[#999]">
                                    填充内容 {i + 1}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 测试说明 */}
                <div className="bg-[#E3F2FD] rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-[#0047AB] mb-4">测试说明</h2>
                    <div className="space-y-2 text-[#333]">
                        <p>✅ <strong>测试 1</strong>：验证基本的 Dropdown 功能</p>
                        <p>✅ <strong>测试 2</strong>：验证禁用选项和工具提示</p>
                        <p>✅ <strong>测试 3</strong>：验证在 overflow 容器中的表现（关键测试）</p>
                        <p className="mt-4 text-sm">
                            如果测试 3 中的 Dropdown 下拉菜单可以正常显示和滚动，说明 Portal 修复生效了。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropdownTest;
