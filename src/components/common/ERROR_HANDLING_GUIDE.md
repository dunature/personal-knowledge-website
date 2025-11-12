# 错误处理使用指南

本指南介绍如何在项目中使用错误处理组件和工具。

## 📦 组件列表

### 1. ErrorBoundary - 错误边界
捕获子组件树中的 JavaScript 错误，防止整个应用崩溃。

### 2. ErrorMessage - 错误提示
显示各种类型的错误消息（网络错误、验证错误等）。

### 3. EmptyState - 空状态
显示无数据时的友好提示。

### 4. LoadingState - 加载状态
显示加载中的各种状态（旋转器、骨架屏等）。

## 🚀 使用示例

### ErrorBoundary 使用

#### 基础用法
```tsx
import { ErrorBoundary } from '@/components/common';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

#### 自定义错误UI
```tsx
<ErrorBoundary
  fallback={
    <div className="p-xl text-center">
      <h2>出错了</h2>
      <p>请刷新页面重试</p>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

#### 错误回调
```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // 发送错误到日志服务
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### ErrorMessage 使用

#### 网络错误
```tsx
import { ErrorMessage } from '@/components/common';

<ErrorMessage
  type="network"
  onRetry={() => refetch()}
  onDismiss={() => clearError()}
/>
```

#### 验证错误
```tsx
<ErrorMessage
  type="validation"
  message="请填写所有必填字段"
  onDismiss={() => clearError()}
/>
```

#### 自定义错误
```tsx
<ErrorMessage
  type="general"
  title="保存失败"
  message="无法保存您的更改，请稍后重试"
  onRetry={() => handleSave()}
/>
```

#### 所有错误类型
- `network` - 网络错误
- `validation` - 验证错误
- `notFound` - 未找到
- `permission` - 权限不足
- `general` - 一般错误

### EmptyState 使用

#### 无资源
```tsx
import { EmptyState } from '@/components/common';

<EmptyState
  type="noResources"
  onAction={() => openAddResourceModal()}
/>
```

#### 无搜索结果
```tsx
<EmptyState
  type="noSearchResults"
  actionLabel="清除筛选"
  onAction={() => clearFilters()}
/>
```

#### 自定义空状态
```tsx
<EmptyState
  title="还没有笔记"
  message="开始记录您的想法和灵感"
  actionLabel="创建笔记"
  onAction={() => createNote()}
/>
```

#### 所有空状态类型
- `noResources` - 无资源
- `noSearchResults` - 无搜索结果
- `noQuestions` - 无问题
- `noSubQuestions` - 无小问题
- `noAnswers` - 无回答
- `general` - 一般空状态

### LoadingState 使用

#### 旋转加载器
```tsx
import { LoadingState } from '@/components/common';

<LoadingState
  type="spinner"
  size="medium"
  message="加载中..."
/>
```

#### 点状加载器
```tsx
<LoadingState
  type="dots"
  message="正在保存..."
/>
```

#### 脉冲加载器
```tsx
<LoadingState
  type="pulse"
  size="large"
/>
```

#### 卡片骨架屏
```tsx
import { CardSkeleton } from '@/components/common';

{isLoading ? (
  <div className="grid grid-cols-3 gap-lg">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
) : (
  <ResourceCards />
)}
```

#### 列表骨架屏
```tsx
import { ListSkeleton } from '@/components/common';

{isLoading ? (
  <ListSkeleton count={5} />
) : (
  <QuestionList />
)}
```

#### 文本骨架屏
```tsx
import { TextSkeleton } from '@/components/common';

{isLoading ? (
  <TextSkeleton lines={4} />
) : (
  <Description />
)}
```

#### 全页面加载
```tsx
import { FullPageLoading } from '@/components/common';

{isLoading && <FullPageLoading message="正在加载数据..." />}
```

## 🛠️ 工具函数使用

### useError Hook

```tsx
import { useError } from '@/hooks/useError';
import { ErrorMessage } from '@/components/common';

function MyComponent() {
  const { error, setError, clearError, hasError } = useError();

  const handleSubmit = async () => {
    try {
      await saveData();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      {hasError && (
        <ErrorMessage
          type={error?.type}
          message={error?.message}
          onDismiss={clearError}
        />
      )}
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
```

### 错误处理工具函数

#### handleAsyncError
```tsx
import { handleAsyncError } from '@/utils/errorUtils';

const [data, error] = await handleAsyncError(
  fetchData(),
  (err) => console.error('Failed to fetch:', err)
);

if (error) {
  // 处理错误
  return <ErrorMessage type={error.type} message={error.message} />;
}

// 使用数据
return <DataDisplay data={data} />;
```

#### retry
```tsx
import { retry } from '@/utils/errorUtils';

try {
  const data = await retry(
    () => fetchData(),
    3,  // 最多重试3次
    1000  // 延迟1秒
  );
} catch (error) {
  setError(error);
}
```

#### 验证函数
```tsx
import { validateRequired, validateLength, validateUrl } from '@/utils/errorUtils';

try {
  validateRequired(title, '标题');
  validateLength(title, '标题', 1, 100);
  validateUrl(link, '链接');
  
  // 验证通过，继续处理
  await saveResource({ title, link });
} catch (error) {
  setError(error);
}
```

#### 批量验证
```tsx
import { validateAll, validateRequired, validateLength } from '@/utils/errorUtils';

const errors = validateAll([
  () => validateRequired(title, '标题'),
  () => validateLength(title, '标题', 1, 100),
  () => validateRequired(link, '链接'),
]);

if (errors.length > 0) {
  // 显示所有错误
  errors.forEach(error => {
    console.error(error.message);
  });
}
```

## 🎯 完整示例

### 资源列表组件
```tsx
import React, { useState, useEffect } from 'react';
import { 
  ErrorBoundary, 
  ErrorMessage, 
  EmptyState, 
  CardSkeleton 
} from '@/components/common';
import { useError } from '@/hooks/useError';
import { handleAsyncError } from '@/utils/errorUtils';

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error, setError, clearError, hasError } = useError();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    clearError();

    const [data, err] = await handleAsyncError(
      fetch('/api/resources').then(res => res.json())
    );

    setIsLoading(false);

    if (err) {
      setError(err);
      return;
    }

    setResources(data);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-lg">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorMessage
        type={error?.type}
        message={error?.message}
        onRetry={loadResources}
        onDismiss={clearError}
      />
    );
  }

  if (resources.length === 0) {
    return (
      <EmptyState
        type="noResources"
        onAction={() => openAddModal()}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-3 gap-lg">
        {resources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
```

### 表单组件
```tsx
import React, { useState } from 'react';
import { ErrorMessage } from '@/components/common';
import { useError } from '@/hooks/useError';
import { validateRequired, validateLength, validateUrl } from '@/utils/errorUtils';

function ResourceForm() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError, clearError, hasError } = useError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // 验证
      validateRequired(title, '标题');
      validateLength(title, '标题', 1, 100);
      validateRequired(link, '链接');
      validateUrl(link, '链接');

      // 提交
      setIsSubmitting(true);
      await saveResource({ title, link });
      
      // 成功
      onSuccess();
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasError && (
        <ErrorMessage
          type={error?.type}
          message={error?.message}
          onDismiss={clearError}
          className="mb-md"
        />
      )}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
        className="w-full px-md py-sm border rounded-medium mb-md"
      />

      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="链接"
        className="w-full px-md py-sm border rounded-medium mb-md"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-lg py-sm bg-primary text-white rounded-medium"
      >
        {isSubmitting ? '保存中...' : '保存'}
      </button>
    </form>
  );
}
```

## 💡 最佳实践

### 1. 始终使用 ErrorBoundary
在应用的顶层和关键组件周围使用 ErrorBoundary。

```tsx
// App.tsx
<ErrorBoundary>
  <Router>
    <Routes />
  </Router>
</ErrorBoundary>
```

### 2. 提供重试功能
对于网络错误，始终提供重试按钮。

```tsx
<ErrorMessage
  type="network"
  onRetry={refetch}
/>
```

### 3. 清晰的错误消息
提供清晰、可操作的错误消息。

```tsx
// ❌ 不好
<ErrorMessage message="Error" />

// ✅ 好
<ErrorMessage 
  message="无法加载资源列表，请检查网络连接后重试"
  onRetry={loadResources}
/>
```

### 4. 使用适当的加载状态
根据内容类型选择合适的加载状态。

```tsx
// 卡片列表 - 使用骨架屏
{isLoading ? <CardSkeleton /> : <ResourceCard />}

// 简单操作 - 使用旋转器
{isLoading && <LoadingState type="spinner" />}
```

### 5. 友好的空状态
提供有帮助的空状态提示和操作按钮。

```tsx
<EmptyState
  type="noResources"
  message="开始添加您的第一个资源，记录您的学习旅程"
  actionLabel="添加资源"
  onAction={openAddModal}
/>
```

---

**维护者**: 开发团队  
**最后更新**: 2024-01-XX
