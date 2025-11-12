/**
 * 编辑器抽屉测试页面
 * 测试EditorDrawer、EditorForm和自动保存功能
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EditorDrawer } from '@/components/editor/EditorDrawer';
import { EditorForm, type EditorFormData, type EditorType } from '@/components/editor/EditorForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { AutoSaveIndicator } from '@/components/common/AutoSaveIndicator';

export const EditorDrawerTest: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editorType, setEditorType] = useState<EditorType>('question');
    const [formData, setFormData] = useState<EditorFormData>({
        title: '',
        content: '',
        status: 'unsolved',
        category: '',
    });

    // 自动保存
    const { isSaving, lastSaved, saveNow } = useAutoSave({
        data: formData,
        onSave: async () => {
            // 模拟保存到服务器
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Auto-saved:', formData);
        },
        delay: 3000,
        enabled: drawerOpen,
    });

    // 打开抽屉
    const openDrawer = (type: EditorType) => {
        setEditorType(type);
        setDrawerOpen(true);

        // 根据类型设置初始数据
        switch (type) {
            case 'resource':
                setFormData({
                    title: '示例资源',
                    url: 'https://example.com',
                    category: 'AI学习',
                    author: '作者名',
                    recommendation: '这是一个很好的资源',
                });
                break;
            case 'question':
                setFormData({
                    title: '示例大问题',
                    description: '# 问题描述\n\n这是一个示例问题的描述。',
                    status: 'solving',
                    category: '技术',
                });
                break;
            case 'subQuestion':
                setFormData({
                    title: '示例小问题',
                    status: 'unsolved',
                });
                break;
            case 'answer':
                setFormData({
                    content: '这是一个示例回答。\n\n可以使用**Markdown**格式。',
                    timestamp: new Date().toISOString().slice(0, 16),
                });
                break;
            case 'summary':
                setFormData({
                    summary: '# THE END\n\n这是最终总结。',
                });
                break;
        }
    };

    // 关闭抽屉
    const closeDrawer = () => {
        setDrawerOpen(false);
        setFormData({});
    };

    // 保存
    const handleSave = async () => {
        await saveNow();
        alert('保存成功！\n\n' + JSON.stringify(formData, null, 2));
        closeDrawer();
    };

    // 取消
    const handleCancel = () => {
        const confirmed = window.confirm('确定要取消吗？未保存的修改将丢失。');
        if (confirmed) {
            closeDrawer();
        }
    };

    // 检查是否有未保存的修改
    const hasUnsavedChanges = Object.keys(formData).length > 0;

    // 获取抽屉标题
    const getDrawerTitle = () => {
        switch (editorType) {
            case 'resource':
                return '编辑资源';
            case 'question':
                return '编辑大问题';
            case 'subQuestion':
                return '编辑小问题';
            case 'answer':
                return '添加回答';
            case 'summary':
                return '编辑总结';
            default:
                return '编辑';
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            {/* 页面标题 */}
            <div style={{
                padding: '20px',
                backgroundColor: '#0047AB',
                color: 'white',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
                    编辑器抽屉测试
                </h1>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    测试EditorDrawer、EditorForm和自动保存功能
                </p>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                {/* 按钮组 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '16px',
                    marginBottom: '40px'
                }}>
                    <Button
                        variant="primary"
                        onClick={() => openDrawer('resource')}
                        fullWidth
                    >
                        编辑资源
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => openDrawer('question')}
                        fullWidth
                    >
                        编辑大问题
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => openDrawer('subQuestion')}
                        fullWidth
                    >
                        编辑小问题
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => openDrawer('answer')}
                        fullWidth
                    >
                        添加回答
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => openDrawer('summary')}
                        fullWidth
                    >
                        编辑总结
                    </Button>
                </div>

                {/* 功能说明 */}
                <div style={{
                    padding: '30px',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '8px',
                    border: '2px solid #2E7D32'
                }}>
                    <h2 style={{ color: '#2E7D32', marginBottom: '20px', fontSize: '18px' }}>
                        ✅ 功能说明
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                                编辑器抽屉
                            </h3>
                            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
                                <li>从右侧滑入（60%宽度）</li>
                                <li>半透明遮罩背景</li>
                                <li>ESC键关闭</li>
                                <li>未保存修改时确认关闭</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                                编辑器表单
                            </h3>
                            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
                                <li>根据类型显示不同字段</li>
                                <li>上下分屏布局（编辑+预览）</li>
                                <li>Markdown工具栏</li>
                                <li>图片上传支持</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                                自动保存
                            </h3>
                            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
                                <li>3秒防抖自动保存</li>
                                <li>显示"已自动保存"通知</li>
                                <li>通知2秒后消失</li>
                                <li>绿色背景（#2E7D32）</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                                保存和取消
                            </h3>
                            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
                                <li>保存按钮（验证必填字段）</li>
                                <li>保存加载状态</li>
                                <li>取消按钮（确认对话框）</li>
                                <li>关闭按钮（×）</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 当前数据预览 */}
                {Object.keys(formData).length > 0 && (
                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                            当前表单数据
                        </h3>
                        <pre style={{
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: '#666',
                            overflow: 'auto',
                            maxHeight: '300px'
                        }}>
                            {JSON.stringify(formData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* 编辑器抽屉 */}
            <EditorDrawer
                isOpen={drawerOpen}
                onClose={closeDrawer}
                title={getDrawerTitle()}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
            >
                <EditorForm
                    type={editorType}
                    data={formData}
                    onChange={setFormData}
                    categories={['AI学习', '编程', '设计', '技术', '生活']}
                />
            </EditorDrawer>

            {/* 自动保存指示器 */}
            <AutoSaveIndicator
                isSaving={isSaving}
                lastSaved={lastSaved}
            />
        </div>
    );
};

export default EditorDrawerTest;
