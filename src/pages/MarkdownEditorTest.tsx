/**
 * Markdown编辑器测试页面
 * 测试MarkdownEditor、EditorToolbar、ImageUploader和MarkdownPreview组件
 */

import React, { useState } from 'react';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';

export const MarkdownEditorTest: React.FC = () => {
    const [content, setContent] = useState(`# Markdown编辑器测试

## 功能测试

### 文本格式
这是一段**粗体文本**和*斜体文本*。

### 列表
- 无序列表项1
- 无序列表项2
  - 嵌套列表项

1. 有序列表项1
2. 有序列表项2

### 代码
行内代码：\`const hello = "world"\`

代码块：
\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

### 链接和图片
[链接文本](https://example.com)

![图片描述](https://via.placeholder.com/400x200)

### 引用
> 这是一段引用文本
> 可以有多行

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

---

试试工具栏按钮和快捷键（Ctrl/Cmd+S保存）！
`);
    const [showImageUploader, setShowImageUploader] = useState(false);

    // 插入Markdown语法
    const handleInsert = (syntax: string, cursorOffset?: number) => {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + syntax + content.substring(end);

        setContent(newContent);

        // 设置光标位置
        setTimeout(() => {
            const newPosition = start + syntax.length + (cursorOffset || 0);
            textarea.focus();
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    // 插入图片Markdown
    const handleImageInsert = (markdown: string) => {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + '\n' + markdown + '\n' + content.substring(start);

        setContent(newContent);
    };

    // 保存
    const handleSave = () => {
        alert('内容已保存！\n\n' + content.substring(0, 100) + '...');
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
                    Markdown编辑器测试
                </h1>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    测试编辑器、工具栏、图片上传和预览功能
                </p>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
                {/* 编辑器和预览区域 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: 'calc(100vh - 200px)' }}>
                    {/* 编辑区 */}
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '12px', backgroundColor: '#F5F5F5', borderBottom: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>编辑器</h3>
                        </div>
                        <EditorToolbar
                            onInsert={handleInsert}
                            onImageClick={() => setShowImageUploader(true)}
                        />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <MarkdownEditor
                                value={content}
                                onChange={setContent}
                                onSave={handleSave}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* 预览区 */}
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '12px', backgroundColor: '#F5F5F5', borderBottom: '1px solid #E0E0E0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>预览</h3>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'white' }}>
                            <MarkdownPreview content={content} />
                        </div>
                    </div>
                </div>

                {/* 说明 */}
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '8px',
                    border: '2px solid #2E7D32'
                }}>
                    <h3 style={{ color: '#2E7D32', marginBottom: '12px', fontSize: '16px' }}>✅ 功能说明</h3>
                    <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#333', paddingLeft: '20px' }}>
                        <li><strong>工具栏按钮</strong>: 点击插入Markdown语法</li>
                        <li><strong>图片按钮</strong>: 打开图片上传对话框</li>
                        <li><strong>快捷键</strong>: Ctrl/Cmd+S 保存，Tab 插入4个空格</li>
                        <li><strong>实时预览</strong>: 编辑器内容实时渲染到右侧预览区</li>
                        <li><strong>代码高亮</strong>: 支持多种编程语言的语法高亮</li>
                    </ul>
                </div>
            </div>

            {/* 图片上传对话框 */}
            {showImageUploader && (
                <ImageUploader
                    onInsert={handleImageInsert}
                    onClose={() => setShowImageUploader(false)}
                />
            )}
        </div>
    );
};

export default MarkdownEditorTest;
