# 分类筛选器修复说明

## 问题描述

在创建新分类时，新分类无法在下拉列表和主页的分类筛选器中显示。

## 根本原因

在 `HomePage.tsx` 中存在两个问题：

1. **硬编码的分类列表**：HomePage 定义了一个硬编码的 `categories` 数组：
   ```typescript
   const categories: Category[] = [
       { id: '', name: '全部' },
       { id: 'AI学习', name: 'AI学习' },
       { id: '编程', name: '编程' },
       { id: '设计', name: '设计' },
   ];
   ```

2. **未使用动态分类**：虽然从 `useResources()` 获取了动态的 `resourceCategories`，但传递给 `ResourceSection` 的仍然是硬编码的 `categories`。

## 解决方案

### 修改内容

1. **移除硬编码的分类数组**
2. **使用动态分类**：从 `ResourceContext` 获取的 `resourceCategories` 是根据实际资源动态计算的
3. **格式转换**：将字符串数组转换为 `Category[]` 格式

### 修改后的代码

```typescript
export const HomePage: React.FC = () => {
    // 使用 Context 获取真实数据
    const { resources, categories: resourceCategories, addResource, updateResource, deleteResource } = useResources();
    
    // 将动态分类转换为 Category[] 格式
    const categories: Category[] = React.useMemo(() => {
        return [
            { id: '', name: '全部' },
            ...resourceCategories.map(cat => ({ id: cat, name: cat }))
        ];
    }, [resourceCategories]);
    
    // ... 其余代码
}
```

## 工作原理

1. **ResourceContext** 中的 `categories` 是通过 `useMemo` 从所有资源中动态计算的：
   ```typescript
   const categories = React.useMemo(() => {
       const cats = new Set(resources.map(r => r.category));
       return Array.from(cats);
   }, [resources]);
   ```

2. 当添加新资源时，如果资源有新的分类，`ResourceContext` 会自动更新 `categories` 列表

3. HomePage 通过 `useMemo` 将动态分类转换为包含"全部"选项的 `Category[]` 格式

4. 这个列表会传递给 `ResourceSection` 和 `EditorForm`，确保所有地方都能看到最新的分类

## 测试步骤

1. 打开应用并点击"添加资源"
2. 在分类下拉菜单中选择"+ 新建分类"
3. 输入新分类名称（例如："测试分类"）
4. 保存资源
5. 点击"ALL TIME"展开资源列表
6. 验证新分类出现在分类筛选器中
7. 再次添加资源时，验证新分类出现在下拉列表中

## 相关文件

- `personal-knowledge-website/src/pages/HomePage.tsx` - 主要修改
- `personal-knowledge-website/src/contexts/ResourceContext.tsx` - 分类计算逻辑
- `personal-knowledge-website/src/components/layout/ResourceSection.tsx` - 使用分类列表
- `personal-knowledge-website/src/components/editor/EditorForm.tsx` - 分类下拉菜单

## 注意事项

- 分类列表是动态的，基于实际存在的资源
- 如果删除某个分类的所有资源，该分类会自动从列表中消失
- "全部"选项始终显示在列表顶部
- 新建分类会立即在所有使用分类的地方生效
