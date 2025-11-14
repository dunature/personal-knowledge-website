# 主页面 Gist 集成指南

## 当前状态

Gist 持久化功能已经在底层完全集成：

### ✅ 已完成的集成
1. **Context 层面** - `ResourceContext` 和 `QAContext` 已集成同步功能
2. **应用层面** - `AuthProvider` 和 `AutoSyncProvider` 已在 `main.tsx` 中配置
3. **权限控制** - UI 组件已根据模式显示/隐藏编辑功能
4. **自动同步** - 所有数据变更自动触发同步

### 🔄 需要完成的 UI 集成

主页面（`HomePage.tsx`）需要以下更新：

#### 1. 移除示例数据
当前主页面还在使用硬编码的示例数据。需要：
- 移除 `sampleResources`、`sampleQuestions`、`sampleSubQuestions`、`sampleAnswers`
- 移除 `ResourceProvider` 和 `QAProvider` 包装器（已在 `main.tsx` 中提供）

#### 2. 使用 Context 数据
```typescript
// 替换
import { useResources } from '@/contexts/ResourceContext';
import { useQA } from '@/contexts/QAContext';
import { useAuth } from '@/contexts/AuthContext';

// 在组件中
const { resources, addResource, updateResource, deleteResource } = useResources();
const { questions, subQuestions, answers, addQuestion, updateQuestion, ... } = useQA();
const { mode } = useAuth();
```

#### 3. 添加顶部栏
在页面顶部添加：
```tsx
<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#0047AB]">个人知识管理</h1>
            <ModeIndicator />
        </div>
        <div className="flex items-center gap-4">
            {mode === 'owner' && <SyncIndicator />}
            <Link to="/settings">设置</Link>
        </div>
    </div>
</div>
```

#### 4. 更新 CRUD 操作
所有的 CRUD 操作需要使用 Context 方法：

```typescript
// 添加资源
await addResource(newResource);

// 更新资源
await updateResource(id, updates);

// 删除资源
await deleteResource(id);

// 问题操作类似
await addQuestion(newQuestion);
await updateQuestion(id, updates);
await deleteQuestion(id);
```

## 快速集成步骤

### 步骤 1：备份当前文件
```bash
cp src/pages/HomePage.tsx src/pages/HomePage.tsx.backup
```

### 步骤 2：更新导入
```typescript
import { useResources } from '@/contexts/ResourceContext';
import { useQA } from '@/contexts/QAContext';
import { useAuth } from '@/contexts/AuthContext';
import { ModeIndicator } from '@/components/common/ModeIndicator';
import { SyncIndicator } from '@/components/sync/SyncIndicator';
import { Link } from 'react-router-dom';
```

### 步骤 3：移除 Provider 包装
```typescript
// 移除
return (
    <ResourceProvider initialResources={sampleResources}>
        <QAProvider ...>
            <div>...</div>
        </QAProvider>
    </ResourceProvider>
);

// 改为
return (
    <div>...</div>
);
```

### 步骤 4：添加同步状态管理
```typescript
import { syncService } from '@/services/syncService';
import { useEffect } from 'react';

// 在组件中
const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

useEffect(() => {
    // 监听同步状态
    const unsubscribe = syncService.onSyncStatusChange(setSyncStatus);
    
    // 获取最后同步时间
    syncService.getLastSyncTime().then(setLastSyncTime);
    
    return unsubscribe;
}, []);

const handleManualSync = async () => {
    const result = await syncService.syncNow();
    if (result.success) {
        setLastSyncTime(result.timestamp);
    }
};
```

### 步骤 5：更新 SyncIndicator 使用
```tsx
<SyncIndicator 
    status={syncStatus}
    lastSyncTime={lastSyncTime}
    onSync={handleManualSync}
/>
```

## 测试集成

完成集成后，测试以下功能：

1. **数据加载** - 页面应显示来自 LocalStorage 或 Gist 的数据
2. **添加数据** - 添加资源或问题应自动同步
3. **编辑数据** - 编辑应自动同步
4. **删除数据** - 删除应自动同步
5. **模式切换** - 访客模式应隐藏编辑按钮
6. **同步状态** - 顶部栏应显示同步状态
7. **离线支持** - 离线时应能编辑，恢复后自动同步

## 当前可用功能

即使主页面还未完全集成 UI，以下功能已经可用：

1. ✅ 访问 `/settings` 页面管理配置
2. ✅ 配置 GitHub Token
3. ✅ 数据导出/导入
4. ✅ 查看同步状态
5. ✅ 手动触发同步

## 下一步

1. 完成主页面 UI 集成（约 1-2 小时工作量）
2. 测试完整的用户流程
3. 修复发现的问题
4. 优化用户体验

## 注意事项

- Context 已经在 `main.tsx` 中提供，不要重复包装
- 所有 CRUD 操作都会自动触发同步
- 离线时变更会保存到队列，网络恢复后自动同步
- 访客模式下所有编辑功能自动隐藏

## 参考文档

- [离线支持文档](./development/OFFLINE_SUPPORT.md)
- [错误处理文档](./development/ERROR_HANDLING.md)
- [设置页面测试指南](./SETTINGS_PAGE_TEST.md)
- [实现状态总览](./GIST_IMPLEMENTATION_STATUS.md)
