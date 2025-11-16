# 分类创建问题调试指南

## 问题描述
创建新分类后，新分类无法在下拉菜单中显示，主页也看不到新资源。

## 调试步骤

### 1. 打开浏览器开发者工具
- 按 F12 或右键 -> 检查
- 切换到 Console 标签页

### 2. 清除现有数据（可选）
在控制台运行：
```javascript
localStorage.clear();
location.reload();
```

### 3. 创建新分类并观察日志

#### 步骤 A: 打开添加资源对话框
1. 点击"添加资源"按钮
2. 观察控制台输出：
```
[EditorForm] 生成分类选项: {categories: Array, currentCategory: undefined, isNewCategory: false}
```

#### 步骤 B: 点击"+ 新建分类"
1. 在分类下拉菜单中选择"+ 新建分类"
2. 输入新分类名称，例如："测试分类"
3. 点击"确定"
4. 观察控制台输出：
```
[EditorForm] 生成分类选项: {categories: Array, currentCategory: "测试分类", isNewCategory: true}
```

#### 步骤 C: 填写其他字段并保存
1. 填写标题："测试资源"
2. 填写链接："https://example.com"
3. 点击"保存"
4. 观察控制台输出：
```
[HomePage] 准备添加资源: {title: "测试资源", category: "测试分类", editorData: {...}}
[ResourceContext] 添加资源: {id: "resource-...", title: "测试资源", category: "测试分类"}
[ResourceContext] 资源列表更新: {oldCount: X, newCount: X+1}
[ResourceContext] 计算分类列表: {resourceCount: X+1, categories: ["...", "测试分类"]}
```

#### 步骤 D: 再次打开添加资源对话框
1. 点击"添加资源"按钮
2. 观察控制台输出：
```
[EditorForm] 生成分类选项: {categories: ["...", "测试分类"], currentCategory: undefined, isNewCategory: false}
```
3. 检查分类下拉菜单是否包含"测试分类"

### 4. 检查 LocalStorage
在控制台运行：
```javascript
// 查看所有资源
const resources = JSON.parse(localStorage.getItem('pkw_resources'));
console.log('资源列表:', resources);

// 查看分类
const categories = [...new Set(resources.map(r => r.category))];
console.log('分类列表:', categories);

// 查看最后添加的资源
console.log('最后添加的资源:', resources[resources.length - 1]);
```

## 可能的问题和解决方案

### 问题 1: 控制台没有任何日志
**原因**: 代码可能没有正确更新或浏览器缓存问题

**解决方案**:
1. 硬刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
2. 清除浏览器缓存
3. 检查代码是否正确保存

### 问题 2: 日志显示但分类列表为空
**原因**: ResourceContext 没有正确计算分类

**检查**:
```javascript
// 在控制台运行
const resources = JSON.parse(localStorage.getItem('pkw_resources'));
console.log('资源数量:', resources?.length);
console.log('资源分类:', resources?.map(r => r.category));
```

### 问题 3: 资源已添加但分类列表没有更新
**原因**: React 状态更新问题或 useMemo 依赖问题

**检查**:
- 查看 `[ResourceContext] 计算分类列表` 日志
- 确认 resourceCount 是否增加
- 确认 categories 数组是否包含新分类

### 问题 4: 刷新页面后数据丢失
**原因**: LocalStorage 保存失败

**检查**:
```javascript
// 查看 LocalStorage 大小
let total = 0;
for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
    }
}
console.log('LocalStorage 使用:', (total / 1024).toFixed(2), 'KB');
```

### 问题 5: EditorForm 不显示新分类
**原因**: categories prop 没有正确传递

**检查**:
1. 查看 `[EditorForm] 生成分类选项` 日志
2. 确认 categories 数组是否包含新分类
3. 确认 isNewCategory 是否为 true（在保存前）

## 预期的完整日志流程

```
1. 打开添加资源对话框
[EditorForm] 生成分类选项: {categories: ["AI学习", "编程", "设计"], currentCategory: undefined, isNewCategory: false}

2. 创建新分类"测试分类"
[EditorForm] 生成分类选项: {categories: ["AI学习", "编程", "设计"], currentCategory: "测试分类", isNewCategory: true}

3. 保存资源
[HomePage] 准备添加资源: {title: "测试资源", category: "测试分类", editorData: {...}}
[ResourceContext] 添加资源: {id: "resource-1234567890-abc123", title: "测试资源", category: "测试分类"}
[ResourceContext] 资源列表更新: {oldCount: 3, newCount: 4}
[ResourceContext] 计算分类列表: {resourceCount: 4, categories: ["AI学习", "编程", "设计", "测试分类"]}

4. 再次打开添加资源对话框
[EditorForm] 生成分类选项: {categories: ["AI学习", "编程", "设计", "测试分类"], currentCategory: undefined, isNewCategory: false}
```

## 如果问题仍然存在

请提供以下信息：

1. **完整的控制台日志**（从打开对话框到保存资源）
2. **LocalStorage 内容**（运行上面的检查命令）
3. **浏览器和版本**（例如：Chrome 120）
4. **是否有任何错误信息**（红色的错误日志）

## 临时解决方案

如果问题无法立即解决，可以手动编辑 LocalStorage：

```javascript
// 1. 获取现有资源
let resources = JSON.parse(localStorage.getItem('pkw_resources')) || [];

// 2. 添加测试资源
resources.push({
    id: `resource-${Date.now()}`,
    title: "测试资源",
    url: "https://example.com",
    type: "blog",
    cover: "https://via.placeholder.com/320x180",
    platform: "Web",
    content_tags: [],
    category: "测试分类",
    author: "测试作者",
    recommendation: "测试推荐语",
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

// 3. 保存回 LocalStorage
localStorage.setItem('pkw_resources', JSON.stringify(resources));

// 4. 刷新页面
location.reload();
```
