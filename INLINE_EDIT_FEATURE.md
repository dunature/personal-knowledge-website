# 弹窗内直接编辑功能

## 功能概述

现在可以在问题详情弹窗中直接编辑问题描述和最终总结，无需打开额外的编辑器抽屉。

## 实现方案

采用了**方案1：弹窗内切换编辑/查看模式**

### 优点
- ✅ 用户体验最佳 - 在同一界面完成查看和编辑
- ✅ 符合直觉 - 点击"编辑"就能直接编辑
- ✅ 上下文保持 - 不需要关闭弹窗或打开新界面
- ✅ 复用现有组件 - 使用已有的MarkdownEditor、EditorToolbar等

## 功能特性

### 1. 编辑问题描述
- 点击"问题描述"区域的"编辑"按钮
- 切换到编辑模式，显示Markdown编辑器
- 提供工具栏支持（加粗、斜体、代码等）
- 实时预览编辑效果
- 支持图片上传

### 2. 编辑最终总结
- 点击"THE END - 最终总结"区域的"编辑"按钮
- 切换到编辑模式
- 同样支持Markdown编辑和实时预览

### 3. 自动保存
- 编辑时自动保存（3秒延迟）
- 显示保存状态指示器
- 避免数据丢失

### 4. 取消编辑
- 点击"取消"按钮退出编辑模式
- 如有未保存的修改，会提示确认

### 5. 保存编辑
- 点击"保存"按钮保存修改
- 自动切换回查看模式

## 组件结构

### QuestionModalWithEdit
新的问题详情弹窗组件，支持直接编辑功能。

**位置**: `src/components/qa/QuestionModalWithEdit.tsx`

**主要功能**:
- 查看模式：显示问题详情
- 编辑模式：编辑问题描述或总结
- 自动保存：使用useAutoSave hook
- 图片上传：集成ImageUploader组件

**Props**:
```typescript
interface QuestionModalWithEditProps {
    question: BigQuestion;
    subQuestions?: SubQuestion[];
    answers?: Record<string, TimelineAnswer[]>;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (updates: Partial<BigQuestion>) => Promise<void>;
    onStatusChange?: (status: QuestionStatus) => void;
    onEditSubQuestion?: (id: string) => void;
    onAddAnswer?: (subQuestionId: string) => void;
    onEditAnswer?: (answerId: string) => void;
    onAddSubQuestion?: () => void;
}
```

## 使用方法

在HomePage中已经集成：

```tsx
<QuestionModalWithEdit
    question={selectedQuestion}
    subQuestions={selectedSubQuestions}
    answers={answersMap}
    isOpen={!!selectedQuestionId}
    onClose={() => setSelectedQuestionId(null)}
    onSave={async (updates) => {
        console.log('保存问题更新:', updates);
        // TODO: 实际保存到后端或状态管理
    }}
    onStatusChange={(status) => {
        console.log(`修改状态为: ${status}`);
        // TODO: 更新问题状态
    }}
    // ... 其他回调
/>
```

## 测试步骤

1. 启动开发服务器：`npm run dev`
2. 打开浏览器访问 http://localhost:5176/
3. 点击任意问题卡片，打开问题详情弹窗
4. 点击"问题描述"区域的"编辑"按钮
5. 在编辑器中修改内容，查看实时预览
6. 点击"保存"按钮保存修改
7. 同样测试"THE END - 最终总结"的编辑功能

## 技术细节

### 编辑模式管理
```typescript
type EditMode = 'view' | 'description' | 'summary';
const [editMode, setEditMode] = useState<EditMode>('view');
```

### 自动保存
```typescript
const { isSaving, lastSaved } = useAutoSave({
    data: { description: editedDescription, summary: editedSummary },
    onSave: async () => {
        if (onSave) {
            await onSave({
                description: editedDescription,
                summary: editedSummary,
            });
        }
    },
    delay: 3000,
    enabled: editMode !== 'view',
});
```

### Markdown工具栏集成
```typescript
<EditorToolbar
    onInsert={(syntax, offset) => {
        setCurrentEditField('description');
        handleInsert(syntax, offset);
    }}
    onImageClick={() => {
        setCurrentEditField('description');
        setShowImageUploader(true);
    }}
/>
```

## 后续改进

- [ ] 添加编辑历史记录
- [ ] 支持协同编辑
- [ ] 添加更多Markdown快捷键
- [ ] 优化移动端体验
- [ ] 添加编辑冲突检测

## 相关文件

- `src/components/qa/QuestionModalWithEdit.tsx` - 主组件
- `src/components/editor/MarkdownEditor.tsx` - Markdown编辑器
- `src/components/editor/EditorToolbar.tsx` - 编辑工具栏
- `src/components/editor/ImageUploader.tsx` - 图片上传
- `src/hooks/useAutoSave.ts` - 自动保存hook
- `src/pages/HomePage.tsx` - 使用示例
