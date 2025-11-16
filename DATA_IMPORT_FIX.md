# 数据导入验证失败修复

## 问题描述

导出的数据重新导入时失败，控制台显示：
```
问题 0 验证失败
发现 1 个无效问题
导入数据失败: Error: 数据验证失败:数据格式不符合要求，请检查所有字段是否完整
```

## 根本原因

1. **旧数据缺少必需字段**：在之前的版本中，创建问题/资源时没有生成 `id`、`created_at`、`updated_at` 等必需字段
2. **验证逻辑严格**：`dataValidation.ts` 中的验证函数要求所有字段都必须存在且类型正确
3. **导入时直接验证**：导入组件直接验证原始数据，没有对缺失字段进行修复

## 修复方案

在 `DataImport.tsx` 中，导入数据时自动修复缺失的字段：

### 修复内容

```typescript
// 修复缺失的字段
const now = new Date().toISOString();

const fixedResources = (resources || []).map((r: any) => ({
    ...r,
    id: r.id || `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: r.created_at || now,
    updated_at: r.updated_at || now,
}));

const fixedQuestions = (questions || []).map((q: any) => ({
    ...q,
    id: q.id || `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: q.created_at || now,
    updated_at: q.updated_at || now,
    sub_questions: q.sub_questions || [],
}));

const fixedSubQuestions = (subQuestions || []).map((sq: any) => ({
    ...sq,
    id: sq.id || `subquestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: sq.created_at || now,
    updated_at: sq.updated_at || now,
    answers: sq.answers || [],
}));

const fixedAnswers = (answers || []).map((a: any) => ({
    ...a,
    id: a.id || `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: a.created_at || now,
    updated_at: a.updated_at || now,
    timestamp: a.timestamp || now,
}));
```

### 修复逻辑

1. **检查字段是否存在**：使用 `||` 运算符检查字段是否存在
2. **生成缺失字段**：
   - `id`: 如果缺失，生成格式为 `{type}_{timestamp}_{random}` 的唯一ID
   - `created_at`: 如果缺失，使用当前时间
   - `updated_at`: 如果缺失，使用当前时间
   - `timestamp`: 如果缺失（仅回答），使用当前时间
   - `sub_questions`: 如果缺失（仅问题），使用空数组
   - `answers`: 如果缺失（仅小问题），使用空数组
3. **使用修复后的数据**：验证和保存时使用修复后的数据

## 优势

1. **向后兼容**：可以导入旧版本导出的数据
2. **自动修复**：无需手动编辑导出的JSON文件
3. **保持数据完整性**：确保所有数据都有必需的字段
4. **用户友好**：用户无需了解技术细节，导入即可工作

## 测试场景

修复后应该能够处理以下情况：

1. ✅ 导入完整的新数据（所有字段都存在）
2. ✅ 导入旧数据（缺少 id、created_at、updated_at）
3. ✅ 导入部分数据（某些实体缺少字段）
4. ✅ 导入空数据（空数组）
5. ✅ 混合数据（部分有字段，部分没有）

## 相关文件

- `personal-knowledge-website/src/components/settings/DataImport.tsx` - 主要修复文件
- `personal-knowledge-website/src/utils/dataValidation.ts` - 数据验证逻辑
- `personal-knowledge-website/src/components/settings/DataExport.tsx` - 数据导出（未修改）

## 注意事项

- 修复只在导入时进行，不影响导出逻辑
- 生成的ID保证唯一性（时间戳 + 随机字符串）
- 修复后的数据会立即保存到本地存储
- 页面会在导入成功后自动刷新以加载新数据
