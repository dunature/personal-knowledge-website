# 下拉菜单显示问题 - 简单解决方案

## 问题
在添加/编辑小问题时，状态下拉菜单显示不全，被弹窗底部裁剪。

## 解决方案
为小问题表单添加额外的垂直空间，确保下拉菜单有足够的显示区域。

## 修改内容

### 文件：`src/components/editor/EditorForm.tsx`

在 `renderSubQuestionForm` 函数中，添加了一个占位 div：

```tsx
// 渲染小问题表单
const renderSubQuestionForm = () => (
    <div className="h-full flex flex-col">
        <div className="p-4 space-y-4 border-b border-[#E0E0E0]">
            {/* 标题输入 */}
            <Input ... />
            
            {/* 状态下拉菜单 */}
            <div>
                <label>状态</label>
                <Dropdown ... />
            </div>
        </div>
        
        {/* ✨ 新增：添加额外空间，确保下拉菜单有足够显示空间 */}
        <div className="flex-1 min-h-[200px]"></div>
    </div>
);
```

## 工作原理

1. **flex-1**：让这个 div 占据剩余的所有空间
2. **min-h-[200px]**：确保至少有 200px 的高度，足够显示下拉菜单的所有选项

## 优点

✅ 实现简单，只需添加一行代码
✅ 不需要修改 Dropdown 组件
✅ 不影响其他表单类型
✅ 用户体验好，有足够的空间查看选项

## 测试步骤

1. 刷新浏览器页面
2. 打开任意问题详情
3. 点击"添加小问题"按钮
4. 点击"状态"下拉菜单
5. 确认所有选项（未解决、解决中、已解决）都能完整显示
6. 测试编辑小问题的状态下拉菜单

## 效果

现在小问题表单有足够的垂直空间，下拉菜单的所有选项都能完整显示，不会被裁剪。
