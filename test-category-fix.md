# 新分类功能测试指南

## 测试目的
验证新分类创建、保存和显示功能是否正常工作。

## 前置条件
1. 应用已启动并运行
2. 浏览器开发者工具已打开（用于查看控制台日志）

## 测试步骤

### 测试 1: 创建新分类
1. 打开应用主页
2. 点击"添加资源"按钮
3. 在分类下拉菜单中，应该看到：
   - 现有分类列表
   - "AI学习"
   - "编程"
   - "设计"
   - 等等...
   - "+ 新建分类" 选项（在列表末尾）

**预期结果**: 下拉菜单正常显示所有选项

### 测试 2: 输入新分类名称
1. 点击"+ 新建分类"
2. 应该看到输入框出现
3. 输入新分类名称，例如："前端开发"
4. 点击"确定"按钮

**预期结果**: 
- 输入框消失
- 下拉菜单显示"前端开发 (新)"
- 控制台无错误

### 测试 3: 保存包含新分类的资源
1. 填写必填字段：
   - 标题: "测试资源"
   - 链接: "https://example.com"
   - 分类: "前端开发" (应该已自动选中)
2. 点击"保存"按钮

**预期结果**:
- 显示"资源已添加"的成功提示
- 编辑器抽屉关闭
- 主页面显示新添加的资源
- 控制台显示: "从缓存加载了 X 个资源"

### 测试 4: 验证新分类在下拉菜单中
1. 再次点击"添加资源"按钮
2. 查看分类下拉菜单

**预期结果**:
- "前端开发"现在正式出现在分类列表中
- 不再标记为"(新)"
- 可以正常选择

### 测试 5: 验证数据持久化
1. 刷新浏览器页面
2. 等待页面加载完成

**预期结果**:
- 之前添加的资源仍然显示
- 新分类"前端开发"仍然存在
- 控制台显示: "从缓存加载了 X 个资源"

### 测试 6: 编辑包含新分类的资源
1. 找到刚才添加的资源
2. 点击编辑按钮
3. 查看分类字段

**预期结果**:
- 分类下拉菜单显示"前端开发"
- 该分类已被选中
- 可以修改为其他分类

## 调试技巧

### 查看 LocalStorage
在浏览器控制台中运行：
```javascript
// 查看所有资源
JSON.parse(localStorage.getItem('pkw_resources'))

// 查看资源数量
JSON.parse(localStorage.getItem('pkw_resources')).length

// 查看所有分类
const resources = JSON.parse(localStorage.getItem('pkw_resources'));
const categories = [...new Set(resources.map(r => r.category))];
console.log('分类列表:', categories);
```

### 清除测试数据
如果需要重新开始测试：
```javascript
// 清除所有资源
localStorage.removeItem('pkw_resources');

// 刷新页面
location.reload();
```

### 查看 ResourceContext 状态
在 React DevTools 中：
1. 找到 ResourceProvider 组件
2. 查看 hooks 状态
3. 验证 resources 和 categories 数组

## 常见问题排查

### 问题 1: 新分类不显示
**可能原因**:
- ResourceContext 未正确更新
- categories 计算逻辑有误

**检查方法**:
```javascript
// 在控制台查看
const resources = JSON.parse(localStorage.getItem('pkw_resources'));
console.log('资源列表:', resources);
console.log('分类:', resources.map(r => r.category));
```

### 问题 2: 刷新后数据丢失
**可能原因**:
- localStorage 保存失败
- useEffect 未触发

**检查方法**:
- 查看控制台是否有"保存资源数据失败"错误
- 检查 localStorage 是否有 'pkw_resources' 键

### 问题 3: 类型错误
**可能原因**:
- addResource 方法类型不匹配

**检查方法**:
- 查看控制台是否有 TypeScript 错误
- 检查 ResourceContext.addResource 方法签名

## 成功标准

所有以下条件都满足时，修复成功：

- ✅ 可以创建新分类
- ✅ 新分类立即显示在下拉菜单中（标记为"(新)"）
- ✅ 保存资源后，新分类正式出现在列表中
- ✅ 刷新页面后，数据仍然存在
- ✅ 可以编辑包含新分类的资源
- ✅ 控制台无错误
- ✅ LocalStorage 正确保存数据

## 报告问题

如果测试失败，请提供以下信息：

1. 失败的测试步骤编号
2. 实际结果 vs 预期结果
3. 控制台错误信息
4. LocalStorage 内容（运行上面的调试命令）
5. 浏览器和版本信息
