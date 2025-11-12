# 通知系统使用指南

本指南介绍如何在项目中使用Toast通知和确认对话框。

## 📦 组件列表

### 1. Toast - 通知提示
临时显示的通知消息，自动消失。

### 2. ToastContainer - 通知容器
管理和显示多个Toast通知。

### 3. ConfirmDialog - 确认对话框
需要用户确认的操作对话框。

## 🚀 使用示例

### Toast 通知

#### 基础用法

```tsx
import { ToastContainer } from '@/components/common';
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { toasts, showSuccess, showError, hideToast } = useToast();

  const handleSave = () => {
    // 保存逻辑...
    showSuccess('保存成功！');
  };

  return (
    <div>
      <button onClick={handleSave}>保存</button>
      
      {/* 在组件顶层添加ToastContainer */}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
}
```

#### 所有Toast类型

```tsx
const {
  showSuccess,  // 成功提示（绿色，2秒）
  showError,    // 错误提示（红色，3秒）
  showWarning,  // 警告提示（橙色，3秒）
  showInfo,     // 信息提示（蓝色，3秒）
  showLoading,  // 加载提示（蓝色，不自动消失）
} = useToast();

// 使用示例
showSuccess('操作成功！');
showError('操作失败，请重试');
showWarning('请注意：这是警告');
showInfo('这是一条信息');
const loadingId = showLoading('正在处理...');
```

#### 自定义持续时间

```tsx
// 默认时长
showSuccess('默认2秒');  // 2000ms
showError('默认3秒');    // 3000ms

// 自定义时长
showSuccess('5秒后消失', 5000);
showInfo('10秒后消失', 10000);
```

#### 加载提示

```tsx
const { showLoading, hideToast, showSuccess } = useToast();

const handleAsyncOperation = async () => {
  // 显示加载提示
  const loadingId = showLoading('正在处理...');
  
  try {
    await someAsyncOperation();
    
    // 隐藏加载提示
    hideToast(loadingId);
    
    // 显示成功提示
    showSuccess('操作完成！');
  } catch (error) {
    hideToast(loadingId);
    showError('操作失败');
  }
};
```

#### 清除所有通知

```tsx
const { clearAll } = useToast();

// 清除所有显示的Toast
clearAll();
```

### 确认对话框

#### 基础用法

```tsx
import { ConfirmDialog } from '@/components/common';
import { useConfirm } from '@/hooks/useConfirm';

function MyComponent() {
  const { isOpen, confirmOptions, confirm, handleConfirm, handleCancel } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: '确认删除',
      message: '您确定要删除这个项目吗？此操作无法撤销。',
      confirmText: '删除',
      cancelText: '取消',
      confirmButtonType: 'danger',
    });

    if (result) {
      // 用户点击了"删除"
      deleteItem();
    } else {
      // 用户点击了"取消"
      console.log('取消删除');
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>删除</button>
      
      {/* 添加确认对话框 */}
      {confirmOptions && (
        <ConfirmDialog
          isOpen={isOpen}
          title={confirmOptions.title}
          message={confirmOptions.message}
          confirmText={confirmOptions.confirmText}
          cancelText={confirmOptions.cancelText}
          confirmButtonType={confirmOptions.confirmButtonType}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
```

#### 危险操作确认

```tsx
const result = await confirm({
  title: '确认删除',
  message: '您确定要删除这个项目吗？此操作无法撤销。',
  confirmText: '删除',
  cancelText: '取消',
  confirmButtonType: 'danger',  // 红色按钮
});
```

#### 普通确认

```tsx
const result = await confirm({
  title: '保存更改',
  message: '您有未保存的更改，是否要保存？',
  confirmText: '保存',
  cancelText: '不保存',
  confirmButtonType: 'primary',  // 蓝色按钮（默认）
});
```

## 🎯 完整示例

### 表单保存示例

```tsx
import React, { useState } from 'react';
import { ToastContainer, ConfirmDialog } from '@/components/common';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';

function FormComponent() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toasts, showSuccess, showError, showLoading, hideToast } = useToast();
  const { isOpen, confirmOptions, confirm, handleConfirm, handleCancel } = useConfirm();

  const handleSave = async () => {
    // 显示加载提示
    const loadingId = showLoading('正在保存...');
    
    try {
      await saveFormData(formData);
      
      // 隐藏加载提示
      hideToast(loadingId);
      
      // 显示成功提示
      showSuccess('保存成功！');
      setHasChanges(false);
    } catch (error) {
      hideToast(loadingId);
      showError('保存失败，请重试');
    }
  };

  const handleCancel = async () => {
    if (hasChanges) {
      const result = await confirm({
        title: '放弃更改',
        message: '您有未保存的更改，确定要放弃吗？',
        confirmText: '放弃',
        cancelText: '继续编辑',
        confirmButtonType: 'danger',
      });

      if (result) {
        // 用户确认放弃
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  return (
    <div>
      <form>
        <input
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setHasChanges(true);
          }}
        />
        
        <textarea
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            setHasChanges(true);
          }}
        />
        
        <button type="button" onClick={handleSave}>保存</button>
        <button type="button" onClick={handleCancel}>取消</button>
      </form>

      <ToastContainer toasts={toasts} onClose={hideToast} />
      
      {confirmOptions && (
        <ConfirmDialog
          isOpen={isOpen}
          title={confirmOptions.title}
          message={confirmOptions.message}
          confirmText={confirmOptions.confirmText}
          cancelText={confirmOptions.cancelText}
          confirmButtonType={confirmOptions.confirmButtonType}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
```

### 删除操作示例

```tsx
function DeleteButton({ itemId, onDelete }) {
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: '确认删除',
      message: '删除后无法恢复，确定要删除吗？',
      confirmText: '删除',
      cancelText: '取消',
      confirmButtonType: 'danger',
    });

    if (result) {
      try {
        await deleteItem(itemId);
        showSuccess('删除成功');
        onDelete(itemId);
      } catch (error) {
        showError('删除失败');
      }
    }
  };

  return <button onClick={handleDelete}>删除</button>;
}
```

## 🎨 样式定制

### Toast 位置
Toast默认显示在右上角，可以通过修改ToastContainer的className来调整：

```tsx
// 右上角（默认）
<ToastContainer toasts={toasts} onClose={hideToast} />

// 右下角
<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-md">
  {toasts.map((toast) => (
    <Toast key={toast.id} {...toast} onClose={hideToast} />
  ))}
</div>
```

### Toast 颜色
Toast颜色由类型决定：
- success: 绿色 (#2E7D32)
- error: 红色 (#D32F2F)
- warning: 橙色 (#F57C00)
- info/loading: 蓝色 (#0047AB)

### 确认对话框按钮
- primary: 蓝色按钮（默认）
- danger: 红色按钮（危险操作）

## 💡 最佳实践

### 1. 合适的通知类型
```tsx
// ✅ 好的做法
showSuccess('保存成功');  // 操作成功
showError('网络错误');    // 操作失败
showWarning('文件过大');  // 警告信息
showInfo('新版本可用');   // 一般信息

// ❌ 避免
showSuccess('点击了按钮');  // 不要用于普通交互
showError('欢迎使用');      // 不要误用类型
```

### 2. 合适的持续时间
```tsx
// ✅ 好的做法
showSuccess('保存成功', 2000);     // 成功：2秒
showError('操作失败', 3000);       // 错误：3秒
showWarning('请注意', 3000);       // 警告：3秒
showInfo('提示信息', 3000);        // 信息：3秒

// ❌ 避免
showSuccess('保存成功', 10000);    // 太长
showError('错误', 500);            // 太短
```

### 3. 加载提示的使用
```tsx
// ✅ 好的做法
const loadingId = showLoading('正在处理...');
try {
  await operation();
  hideToast(loadingId);
  showSuccess('完成');
} catch (error) {
  hideToast(loadingId);
  showError('失败');
}

// ❌ 避免
showLoading('处理中');
// 忘记隐藏加载提示
```

### 4. 确认对话框的使用
```tsx
// ✅ 好的做法 - 危险操作使用danger类型
await confirm({
  title: '确认删除',
  message: '此操作无法撤销',
  confirmButtonType: 'danger',
});

// ✅ 好的做法 - 普通操作使用primary类型
await confirm({
  title: '保存更改',
  message: '是否保存？',
  confirmButtonType: 'primary',
});

// ❌ 避免 - 不要滥用确认对话框
await confirm({
  title: '确认',
  message: '确定要点击这个按钮吗？',  // 不必要的确认
});
```

### 5. 清晰的消息文案
```tsx
// ✅ 好的做法
showSuccess('文章已发布');
showError('网络连接失败，请检查网络后重试');
await confirm({
  title: '删除文章',
  message: '删除后无法恢复，确定要删除《标题》吗？',
});

// ❌ 避免
showSuccess('成功');  // 太模糊
showError('错误');    // 没有提供有用信息
await confirm({
  title: '确认',
  message: '确定吗？',  // 不清楚要确认什么
});
```

## 🔧 API 参考

### useToast Hook

```typescript
interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (type: ToastType, message: string, duration?: number) => string;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  showLoading: (message: string) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
}
```

### useConfirm Hook

```typescript
interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: 'primary' | 'danger';
}

interface UseConfirmReturn {
  isOpen: boolean;
  confirmOptions: ConfirmOptions | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}
```

---

**维护者**: 开发团队  
**最后更新**: 2024-01-XX
