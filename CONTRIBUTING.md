# 贡献指南

感谢你考虑为个人知识管理系统做出贡献！

## 🚀 开始之前

### 前提条件

- Node.js >= 18
- npm 或 yarn
- Git
- 代码编辑器（推荐 VS Code）

### 推荐的VS Code扩展

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## 📋 开发流程

### 1. Fork 和 Clone

```bash
# Fork 仓库到你的GitHub账号
# 然后clone到本地
git clone https://github.com/YOUR_USERNAME/personal-knowledge-website.git
cd personal-knowledge-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发

```bash
# 启动开发服务器
npm run dev

# 在另一个终端运行类型检查
npm run type-check
```

### 5. 测试

```bash
# 构建测试
npm run build

# 预览构建结果
npm run preview
```

### 6. 提交

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

在GitHub上创建Pull Request，描述你的更改。

## 📝 代码规范

### Commit Message 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**
```
feat(resource): add image lazy loading

- Implement LazyImage component
- Use Intersection Observer API
- Add fade-in animation

Closes #123
```

### TypeScript 规范

```typescript
// ✅ 使用明确的类型
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ 使用类型推断
const count = 0; // 推断为 number

// ❌ 避免使用 any
const data: any = {}; // 不推荐

// ✅ 使用 unknown 或具体类型
const data: unknown = {};
```

### React 组件规范

```tsx
// ✅ 使用函数组件和Hooks
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // 副作用
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
};

// ✅ 使用React.memo优化性能
export const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// ✅ 使用useCallback缓存回调
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### CSS/Tailwind 规范

```tsx
// ✅ 使用Tailwind类
<div className="flex items-center gap-md p-lg bg-white rounded-card">

// ✅ 使用CSS变量
<div style={{ color: 'var(--color-primary)' }}>

// ❌ 避免内联样式（除非必要）
<div style={{ color: '#0047AB' }}>
```

### 文件命名规范

- 组件文件：`PascalCase.tsx` (例如：`ResourceCard.tsx`)
- 工具函数：`camelCase.ts` (例如：`dateUtils.ts`)
- 类型文件：`camelCase.ts` (例如：`resource.ts`)
- 样式文件：`kebab-case.css` (例如：`markdown-preview.css`)

## 🏗️ 项目结构

```
src/
├── components/        # React组件
│   ├── common/       # 通用组件（Button, Modal等）
│   ├── editor/       # 编辑器组件
│   ├── layout/       # 布局组件
│   ├── qa/           # 问答相关组件
│   ├── resource/     # 资源相关组件
│   └── ui/           # 基础UI组件
├── contexts/         # React Context
├── hooks/            # 自定义Hooks
├── pages/            # 页面组件
├── services/         # 服务层（API调用等）
├── types/            # TypeScript类型定义
├── utils/            # 工具函数
└── main.tsx          # 应用入口
```

## 🎨 设计系统

### 颜色

```css
--color-primary: #0047AB;      /* 主色调 */
--color-secondary: #666;       /* 次要文本 */
--color-tertiary: #999;        /* 辅助文本 */
--color-text: #333;            /* 主文本 */
--color-success: #2E7D32;      /* 成功 */
--color-error: #D32F2F;        /* 错误 */
--color-warning: #F57C00;      /* 警告 */
```

### 间距

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

### 字体

```css
--font-size-h1: 32px;
--font-size-h2: 24px;
--font-size-h3: 18px;
--font-size-body: 16px;
--font-size-small: 12px;
```

## 🧪 测试指南

### 手动测试

访问测试页面：
- `/error-test` - 错误处理组件测试
- `/notification-test` - 通知系统测试

### 功能测试清单

- [ ] 资源CRUD操作
- [ ] 问题CRUD操作
- [ ] 搜索和筛选
- [ ] Markdown编辑和预览
- [ ] 响应式布局
- [ ] 键盘导航
- [ ] 错误处理

## 📚 文档

### 添加新组件

1. 创建组件文件
2. 添加TypeScript类型
3. 添加注释说明
4. 导出组件
5. 更新相关文档

示例：

```tsx
/**
 * MyComponent 组件
 * 用于展示某某功能
 * 
 * @example
 * <MyComponent data={data} onAction={handleAction} />
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  data,
  onAction,
}) => {
  // 实现
};
```

### 更新文档

如果你的更改影响到用户使用，请更新相应文档：

- `README.md` - 主要文档
- `docs/user-guides/` - 用户指南
- `docs/development/` - 开发文档

## 🐛 报告Bug

### Bug报告应包含

1. **描述**：清晰简洁的bug描述
2. **重现步骤**：
   - 步骤1
   - 步骤2
   - ...
3. **预期行为**：应该发生什么
4. **实际行为**：实际发生了什么
5. **截图**：如果适用
6. **环境**：
   - 浏览器和版本
   - 操作系统
   - Node.js版本

## 💡 功能建议

### 功能建议应包含

1. **问题**：当前存在什么问题或限制
2. **解决方案**：你建议的解决方案
3. **替代方案**：其他可能的解决方案
4. **使用场景**：谁会使用这个功能，如何使用

## ❓ 需要帮助？

- 查看 [文档](./docs/README.md)
- 搜索 [Issues](https://github.com/dunature/personal-knowledge-website/issues)
- 创建新的 Issue

## 📄 License

通过贡献代码，你同意你的贡献将在MIT许可下发布。

---

**感谢你的贡献！** 🎉
# 贡献指南

感谢你考虑为个人知识管理系统做出贡献！

## 🚀 开始之前

### 前提条件

- Node.js >= 18
- npm 或 yarn
- Git
- 代码编辑器（推荐 VS Code）

### 推荐的VS Code扩展

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

## 📋 开发流程

### 1. Fork 和 Clone

```bash
# Fork 仓库到你的账号
# 然后 clone 到本地
git clone https://github.com/YOUR_USERNAME/personal-knowledge-website.git
cd personal-knowledge-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建分支

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 或创建修复分支
git checkout -b fix/your-fix-name
```

### 4. 开发

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173
```

### 5. 测试

```bash
# 运行类型检查
npm run type-check

# 构建测试
npm run build

# 预览构建
npm run preview
```

### 6. 提交代码

```bash
# 添加更改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到你的fork
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

1. 访问你的 fork 仓库
2. 点击 "New Pull Request"
3. 填写 PR 描述
4. 等待审核

## 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例

```bash
# 新功能
git commit -m "feat: add dark mode support"

# 修复bug
git commit -m "fix: resolve image loading issue"

# 文档更新
git commit -m "docs: update README with new features"

# 性能优化
git commit -m "perf: optimize resource card rendering"
```

## 🎨 代码规范

### TypeScript

```typescript
// ✅ 使用类型注解
interface User {
  id: string;
  name: string;
}

const user: User = {
  id: '1',
  name: 'John',
};

// ✅ 使用函数类型
const handleClick = (id: string): void => {
  console.log(id);
};

// ❌ 避免使用 any
const data: any = {}; // 不推荐
```

### React组件

```tsx
// ✅ 使用函数组件和Hooks
import React, { useState, useCallback } from 'react';

interface Props {
  title: string;
  onSave: (data: string) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  const [value, setValue] = useState('');

  const handleSave = useCallback(() => {
    onSave(value);
  }, [value, onSave]);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

### 样式

```tsx
// ✅ 使用Tailwind CSS类
<div className="flex items-center gap-md p-lg bg-white rounded-card">
  <span className="text-body text-primary">Content</span>
</div>

// ✅ 使用CSS变量
<div style={{ color: 'var(--color-primary)' }}>

// ❌ 避免内联样式
<div style={{ color: '#0047AB', padding: '16px' }}> // 不推荐
```

## 📁 项目结构

```
src/
├── components/        # React组件
│   ├── common/       # 通用组件（Button, Modal等）
│   ├── editor/       # 编辑器组件
│   ├── layout/       # 布局组件
│   ├── qa/           # 问答相关组件
│   ├── resource/     # 资源相关组件
│   └── ui/           # 基础UI组件
├── contexts/         # React Context
├── hooks/            # 自定义Hooks
├── pages/            # 页面组件
├── services/         # 服务层（API调用等）
├── types/            # TypeScript类型定义
├── utils/            # 工具函数
└── main.tsx          # 应用入口
```

## 🧪 测试指南

### 手动测试

1. 测试所有CRUD操作
2. 测试搜索和筛选功能
3. 测试Markdown编辑器
4. 测试响应式布局
5. 测试键盘导航
6. 测试错误处理

### 测试页面

访问以下测试页面：
- `/error-test` - 错误处理测试
- `/notification-test` - 通知系统测试
- `/markdown-test` - Markdown编辑器测试
- `/drawer-test` - 编辑器抽屉测试

## 📚 文档贡献

### 文档类型

- 用户文档：`docs/user-guides/`
- 开发文档：`docs/development/`
- 部署文档：`docs/deployment/`
- 修复文档：`docs/fixes/`

### 文档规范

- 使用清晰的标题层级
- 提供代码示例
- 添加截图（如果需要）
- 保持简洁明了
- 使用中文编写

## 🐛 报告Bug

### Bug报告应包含

1. **标题**：简短描述问题
2. **环境**：浏览器、操作系统、Node版本
3. **重现步骤**：详细的操作步骤
4. **预期行为**：应该发生什么
5. **实际行为**：实际发生了什么
6. **截图**：如果可能，提供截图
7. **错误信息**：控制台错误信息

### 示例

```markdown
**标题**: 资源卡片图片无法显示

**环境**:
- 浏览器: Chrome 120
- 操作系统: macOS 14
- Node版本: 18.17.0

**重现步骤**:
1. 添加新资源
2. 输入图片URL
3. 保存资源
4. 图片不显示

**预期行为**: 图片应该正常显示

**实际行为**: 显示占位图

**截图**: [附上截图]

**错误信息**:
​```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
​```
```

## 💡 功能建议

### 功能建议应包含

1. **标题**：功能名称
2. **问题**：要解决什么问题
3. **解决方案**：建议的实现方式
4. **替代方案**：其他可能的方案
5. **优先级**：高/中/低

## 🔍 代码审查

### 审查清单

- [ ] 代码符合项目规范
- [ ] 没有TypeScript错误
- [ ] 没有ESLint警告
- [ ] 功能正常工作
- [ ] 没有破坏现有功能
- [ ] 代码有适当的注释
- [ ] 提交信息符合规范
- [ ] 文档已更新（如需要）

## 📞 获取帮助

如果你有任何问题：

1. 查看[文档](./docs/README.md)
2. 搜索[已有Issues](https://github.com/dunature/personal-knowledge-website/issues)
3. 创建新Issue询问

## 🎉 感谢

感谢所有贡献者！你们的贡献让这个项目变得更好。

---

**Happy Coding! 🚀**
