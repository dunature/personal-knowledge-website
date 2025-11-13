# 增量同步功能文档

## 概述

增量同步功能允许系统只同步变更的数据，而不是每次都上传完整的数据集。这大大减少了 API 调用次数和网络传输量，提高了同步效率。

## 核心功能

### 1. 变更追踪

系统通过 `PendingChange` 类型追踪所有数据变更：

```typescript
interface PendingChange {
    type: 'create' | 'update' | 'delete';
    entity: 'resource' | 'question' | 'subQuestion' | 'answer';
    id: string;
    data?: any;
    timestamp: string;
}
```

### 2. 变更优化

`optimizePendingChanges()` 方法会自动合并相同实体的多次变更：

- **create + update** → create（使用最新数据）
- **create + delete** → 无操作（删除该变更）
- **update + update** → update（使用最新数据）
- **update + delete** → delete

这确保了每个实体只保留最终状态，减少不必要的同步操作。

### 3. 增量同步流程

1. 用户进行数据操作（创建、更新、删除）
2. 系统调用 `addPendingChange()` 记录变更
3. 变更被优化和合并
4. 触发防抖同步（3秒后）
5. `syncToGist()` 检测到待同步变更
6. 调用 `mergeChanges()` 将变更应用到完整数据集
7. 上传到 GitHub Gist
8. 清除待同步变更

### 4. 变更统计

同步完成后，系统会返回变更统计信息：

```typescript
{
    success: true,
    timestamp: "2024-01-20T10:00:00Z",
    changes: {
        added: 2,
        updated: 1,
        deleted: 0
    }
}
```

## API 方法

### addPendingChange(change: PendingChange)

添加一个待同步变更。变更会自动优化并触发防抖同步。

```typescript
await syncService.addPendingChange({
    type: 'create',
    entity: 'resource',
    id: 'res_123',
    data: resourceData,
    timestamp: new Date().toISOString()
});
```

### getPendingChanges()

获取所有待同步变更列表。

```typescript
const changes = await syncService.getPendingChanges();
console.log(`待同步: ${changes.length} 个变更`);
```

### getPendingChangesCount()

获取待同步变更数量。

```typescript
const count = await syncService.getPendingChangesCount();
```

### clearPendingChange(entity, id)

清除特定实体的待同步变更。

```typescript
await syncService.clearPendingChange('resource', 'res_123');
```

### clearAllPendingChanges()

清除所有待同步变更。

```typescript
await syncService.clearAllPendingChanges();
```

## 性能优势

### 减少 API 调用

- **完整同步**: 每次变更都上传所有数据（可能数百 KB）
- **增量同步**: 只上传变更的数据（通常几 KB）

### 变更合并

如果用户在 3 秒内多次编辑同一资源，系统只会同步最终状态，而不是每次编辑都同步。

### 示例场景

用户在 3 秒内进行以下操作：
1. 创建资源 A
2. 更新资源 A 的标题
3. 更新资源 A 的标签
4. 创建资源 B

**传统方式**: 4 次 API 调用
**增量同步**: 1 次 API 调用（包含 2 个创建操作，资源 A 已合并）

## 测试

使用 `GistServiceTest` 页面的"测试 9: 增量同步测试"来验证功能：

1. 配置 GitHub Token 和 Gist ID
2. 点击"9. 增量同步测试"按钮
3. 观察变更合并和同步过程
4. 验证变更统计和待同步变更清除

## 注意事项

1. **防抖时间**: 默认 3 秒，可通过 `updateConfig()` 修改
2. **变更存储**: 待同步变更存储在 LocalStorage 中
3. **网络恢复**: 离线时的变更会在网络恢复后自动同步
4. **冲突处理**: 当前使用"最后写入优先"策略

## 未来改进

- [ ] 实现更智能的冲突解决策略
- [ ] 支持变更历史查看
- [ ] 添加变更撤销功能
- [ ] 实现批量变更优化
