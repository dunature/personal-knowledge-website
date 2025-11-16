# 问题点击无反应修复

## 问题描述

在部署的项目中测试发现：
- 可以成功创建大问题
- 但点击问题时没有任何反应，弹窗无法打开

## 根本原因

在 `HomePage.tsx` 中创建新实体（问题、小问题、回答、资源）时，没有生成必需的 `id`、`created_at` 和 `updated_at` 字段。

代码使用了 `Omit<Type, 'id' | 'created_at' | 'updated_at'>` 类型，然后强制转换为完整类型，导致这些字段为 `undefined`。

当点击问题时，`HomePage` 通过 `questions.find(q => q.id === selectedQuestionId)` 查找问题，但由于 `id` 为 `undefined`，无法找到对应的问题，因此弹窗不会显示。

## 修复内容

修复了以下四个函数，为新创建的实体正确生成 ID 和时间戳：

### 1. `handleSaveQuestion` - 创建大问题
```typescript
// 修复前
const newQuestion: Omit<BigQuestion, 'id' | 'created_at' | 'updated_at'> = {
    title: editorData.title,
    // ...
};
await addQuestion(newQuestion as BigQuestion);

// 修复后
const now = new Date().toISOString();
const newQuestion: BigQuestion = {
    id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: editorData.title,
    // ...
    created_at: now,
    updated_at: now,
};
await addQuestion(newQuestion);
```

### 2. `handleCreateSubQuestion` - 创建小问题
```typescript
// 修复后
const now = new Date().toISOString();
const newSubQuestion: SubQuestion = {
    id: `subquestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    parent_id: selectedQuestionId,
    title: data.title,
    status: data.status,
    answers: [],
    created_at: now,
    updated_at: now,
};
await addSubQuestion(newSubQuestion);
```

### 3. `handleCreateAnswer` - 创建回答
```typescript
// 修复后
const now = new Date().toISOString();
const newAnswer: TimelineAnswer = {
    id: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    question_id: subQuestionId,
    content,
    timestamp: now,
    created_at: now,
    updated_at: now,
};
await addAnswer(newAnswer);
```

### 4. `handleSaveResource` - 创建资源
```typescript
// 修复后
const now = new Date().toISOString();
const newResource: Resource = {
    id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: editorData.title,
    url: editorData.url,
    // ...
    created_at: now,
    updated_at: now,
};
await addResource(newResource);
```

## ID 生成策略

使用组合方式生成唯一 ID：
- 前缀：实体类型（如 `question_`、`resource_`）
- 时间戳：`Date.now()` 确保时间唯一性
- 随机字符串：`Math.random().toString(36).substr(2, 9)` 增加随机性

格式示例：`question_1700000000000_abc123def`

## 测试验证

修复后需要测试：
1. ✅ 创建新大问题
2. ✅ 点击问题打开详情弹窗
3. ✅ 在弹窗中创建小问题
4. ✅ 在小问题中添加回答
5. ✅ 创建新资源

## 相关文件

- `personal-knowledge-website/src/pages/HomePage.tsx` - 主要修复文件
- `personal-knowledge-website/src/contexts/QAContext.tsx` - QA 数据管理
- `personal-knowledge-website/src/contexts/ResourceContext.tsx` - 资源数据管理

## 注意事项

这个修复确保了所有新创建的实体都有完整的必需字段，避免了因缺少 ID 导致的查找失败问题。
