/**
 * 组件测试页面 - 简化版
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tag } from '@/components/ui/Tag';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownOption } from '@/components/ui/Dropdown';

export const ComponentTest: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('unsolved');

    const dropdownOptions: DropdownOption[] = [
        { value: 'unsolved', label: '未解决' },
        { value: 'solving', label: '解决中' },
        { value: 'solved', label: '已解决' },
    ];

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 页面标题 */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0047AB] mb-4">
                        组件测试页面
                    </h1>
                    <p className="text-base text-[#666]">
                        展示所有已创建的UI组件
                    </p>
                </div>

                {/* Button组件测试 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#333] border-b border-[#E0E0E0] pb-2">
                        Button 组件
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary" size="small">
                            Primary Small
                        </Button>
                        <Button variant="primary" size="medium">
                            Primary Medium
                        </Button>
                        <Button variant="primary" size="large">
                            Primary Large
                        </Button>
                        <Button variant="secondary">
                            Secondary
                        </Button>
                        <Button variant="outline">
                            Outline
                        </Button>
                        <Button variant="text">
                            Text Link
                        </Button>
                        <Button variant="primary" loading>
                            Loading...
                        </Button>
                        <Button variant="primary" disabled>
                            Disabled
                        </Button>
                    </div>
                </section>

                {/* Input组件测试 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#333] border-b border-[#E0E0E0] pb-2">
                        Input 组件
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                        <Input
                            label="标题"
                            placeholder="请输入标题"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Input
                            label="错误示例"
                            placeholder="输入内容"
                            error="此字段不能为空"
                        />
                        <Input
                            label="帮助文本"
                            placeholder="输入内容"
                            helperText="这是一段帮助文本"
                        />
                    </div>
                </section>

                {/* Tag组件测试 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#333] border-b border-[#E0E0E0] pb-2">
                        Tag 组件
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <Tag variant="default">Default Tag</Tag>
                        <Tag variant="status" color={{ bg: '#FFF3E0', text: '#E65100' }}>
                            未解决
                        </Tag>
                        <Tag variant="status" color={{ bg: '#FFF9C4', text: '#F57F17' }}>
                            解决中
                        </Tag>
                        <Tag variant="status" color={{ bg: '#E8F5E9', text: '#2E7D32' }}>
                            已解决
                        </Tag>
                        <Tag variant="category" selected>
                            Selected Category
                        </Tag>
                        <Tag variant="content" color={{ bg: '#E3F2FD', text: '#333' }}>
                            Fundamentals
                        </Tag>
                        <Tag variant="content" color={{ bg: '#E8F5E9', text: '#333' }}>
                            Tutorial
                        </Tag>
                        <Tag variant="default" removable onRemove={() => alert('Tag removed')}>
                            Removable Tag
                        </Tag>
                        <Tag variant="default" onClick={() => alert('Tag clicked')}>
                            Clickable Tag
                        </Tag>
                    </div>
                </section>

                {/* Dropdown组件测试 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#333] border-b border-[#E0E0E0] pb-2">
                        Dropdown 组件
                    </h2>
                    <div className="flex gap-4">
                        <Dropdown
                            options={dropdownOptions}
                            value={dropdownValue}
                            onChange={setDropdownValue}
                            placeholder="选择状态"
                        />
                        <Dropdown
                            options={dropdownOptions}
                            value=""
                            onChange={() => { }}
                            placeholder="禁用状态"
                            disabled
                        />
                    </div>
                    <p className="text-sm text-[#666]">
                        当前选择: {dropdownOptions.find(o => o.value === dropdownValue)?.label}
                    </p>
                </section>

                {/* Modal和Drawer测试 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#333] border-b border-[#E0E0E0] pb-2">
                        Modal & Drawer 组件
                    </h2>
                    <div className="flex gap-4">
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                            打开 Modal
                        </Button>
                        <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                            打开 Drawer
                        </Button>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="示例弹窗"
                    >
                        <div className="space-y-4">
                            <p className="text-base">这是一个模态框示例。</p>
                            <p className="text-[#666]">
                                您可以点击遮罩层或按ESC键关闭弹窗。
                            </p>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                                    取消
                                </Button>
                                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                                    确认
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    <Drawer
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        title="示例抽屉"
                        width="60%"
                    >
                        <div className="p-6 space-y-4">
                            <p className="text-base">这是一个从右侧滑出的抽屉。</p>
                            <p className="text-[#666]">
                                抽屉通常用于编辑器或详细信息展示。
                            </p>
                            <Input label="标题" placeholder="输入标题" fullWidth />
                            <Input label="描述" placeholder="输入描述" fullWidth />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
                                    取消
                                </Button>
                                <Button variant="primary" onClick={() => setIsDrawerOpen(false)}>
                                    保存
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                </section>

                {/* 成功提示 */}
                <section className="space-y-4">
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                            ✅ UI组件测试成功！
                        </h3>
                        <p className="text-green-700">
                            Button、Input、Tag、Dropdown、Modal、Drawer组件都正常工作。
                        </p>
                        <p className="text-green-600 mt-2">
                            🎯 测试提示：点击上方按钮打开Modal和Drawer，测试交互效果！
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};
