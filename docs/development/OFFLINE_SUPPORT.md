# 离线支持实现文档

## 概述

本文档描述了 GitHub Gist 持久化功能的离线支持实现，包括离线变更追踪、网络状态检测和自动同步机制。

## 功能特性

### 1. 网络状态检测

使用 `useNetworkStatus` Hook 监听浏览器的网络状态变化：

- 监听 `online` 和 `offline` 事件
- 提供网络恢复和断开的回调
- 跟踪是否曾经离线过

```typescript
const { isOnline, wasOffline } = useNetworkStatus({
    onOnline: () => console.log('网络已恢复'),
    onOffline: () => console.log('网络已断开'),
});
```

### 2. 离线变更追踪

当用户在离线状态下进行数据变更时，系统会：

1. **保存变更到本地队列**：所有变更（创建、更新、删除）都会保存到 `localStorage` 的 `PENDING_CHANGES` 键中
2. **优化变更列表**：合并相同实体的多次变更，只保留最终状态
3. **跳过同步**：在离线状态下不会尝试同步到 Gist

#### 变更类型

```typescript
interface PendingChange {
    type: 'create' | 'update' | 'delete';
    entity: 'resource' | 'question' | 'subQuestion' | 'answer';
    id: string;
    data?: any;
    timestamp: string;
}
```

#### 变更优化规则

- `create` + `update` = `create`（使用最新数据）
- `create` + `delete` = 无操作（删除该变更）
- `update` + `update` = `update`（使用最新数据）
- `update` + `delete` = `delete`

### 3. 自动同步机制

使用 `useAutoSync` Hook 实现网络恢复后的自动同步：

```typescript
useAutoSync({
    enabled: true,
    showNotifications: true,
});
```

#### 同步流程

1. **网络恢复检测**：监听 `online` 事件
2. **检查待同步变更**：查询 `PENDING_CHANGES` 队列
3. **执行同步**：调用 `syncService.syncPendingChanges()`
4. **显示通知**：通知用户同步进度和结果
5. **清除队列**：同步成功后清除待同步变更

#### 组件挂载时检查

应用启动时会自动检查是否有待同步变更，如果有且网络在线，会立即执行同步。

### 4. 用户通知

系统会在以下情况显示通知：

- **网络断开**：提示用户变更将在恢复后同步
- **开始同步**：显示待同步变更数量
- **同步成功**：确认离线变更已同步
- **同步失败**：显示错误信息

## 技术实现

### SyncService 增强

在 `syncService.ts` 中添加了以下方法：

- `syncPendingChanges()`：同步所有待同步变更
- `hasPendingChanges()`：检查是否有待同步变更
- `getPendingChangesCount()`：获取待同步变更数量
- `addPendingChange()`：添加待同步变更（增强了离线检测）

### 网络状态检测

在 `syncToGist()` 方法中添加了网络状态检查：

```typescript
if (!navigator.onLine) {
    console.log('离线状态，跳过同步');
    return {
        success: false,
        timestamp: new Date().toISOString(),
        error: '当前处于离线状态',
    };
}
```

### AutoSyncProvider 组件

创建了 `AutoSyncProvider` 组件，在应用根级别启用自动同步：

```typescript
<AuthProvider>
    <AutoSyncProvider>
        <App />
    </AutoSyncProvider>
</AuthProvider>
```

## 使用场景

### 场景 1：离线编辑

1. 用户在线时打开应用
2. 网络断开
3. 用户继续编辑资源和问答
4. 变更保存到本地队列
5. 网络恢复
6. 自动同步所有离线变更

### 场景 2：应用重启

1. 用户在离线时编辑数据
2. 关闭应用（变更保存在 localStorage）
3. 重新打开应用（网络已恢复）
4. 自动检测并同步待同步变更

### 场景 3：长时间离线

1. 用户离线多次编辑
2. 变更队列不断累积
3. 系统自动优化变更列表
4. 网络恢复后一次性同步所有变更

## 限制和注意事项

1. **存储限制**：LocalStorage 通常限制为 5-10MB，大量离线变更可能超出限制
2. **冲突处理**：当前实现使用"本地优先"策略，不处理多设备冲突
3. **数据丢失风险**：如果用户清除浏览器数据，未同步的变更会丢失
4. **仅拥有者模式**：自动同步仅在拥有者模式下启用

## 测试建议

### 手动测试

1. **离线编辑测试**：
   - 打开开发者工具，切换到 Network 标签
   - 选择 "Offline" 模式
   - 编辑资源或问答
   - 切换回 "Online" 模式
   - 验证自动同步

2. **变更优化测试**：
   - 离线状态下多次编辑同一资源
   - 检查 localStorage 中的 `pkw_pending_changes`
   - 验证只保留最终状态

3. **应用重启测试**：
   - 离线状态下编辑数据
   - 关闭并重新打开应用
   - 验证待同步变更被保留并自动同步

### 自动化测试

建议编写以下测试用例：

- 网络状态检测
- 离线变更追踪
- 变更优化逻辑
- 自动同步流程
- 错误处理

## 未来改进

1. **冲突解决**：实现多设备冲突检测和解决策略
2. **增量同步**：只同步变更的字段，而不是整个对象
3. **压缩存储**：压缩待同步变更以节省存储空间
4. **同步队列管理**：实现更智能的队列管理和优先级
5. **离线指示器**：在 UI 中显示离线状态和待同步变更数量

## 相关文件

- `src/services/syncService.ts` - 同步服务
- `src/hooks/useNetworkStatus.ts` - 网络状态检测 Hook
- `src/hooks/useAutoSync.ts` - 自动同步 Hook
- `src/components/sync/AutoSyncProvider.tsx` - 自动同步提供者组件
- `src/types/sync.ts` - 同步相关类型定义
