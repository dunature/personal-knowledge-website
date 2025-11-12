# 贡献指南

感谢你考虑为个人知识管理系统做出贡献！本文档提供了贡献代码的指南和最佳实践。

## 📋 目录

- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [编码规范](#编码规范)
- [提交规范](#提交规范)
- [Pull Request流程](#pull-request流程)
- [测试指南](#测试指南)

## 🛠️ 开发环境设置

### 前提条件

- Node.js >= 18
- npm >= 9 或 yarn >= 1.22
- Git

### 安装步骤

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-knowledge-website.git
   cd personal-knowledge-website
   ```

3. **添加上游仓库**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/personal-knowledge-website.git
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   ```
   打开浏览器访问 http://localhost:5173
   ```

## 📁 项目结构

```
personal-knowledge-website/
├── public/
│   └── data/              # 示例数据文件
├── src/
│   ├── components/        # React 组件
│   │   ├── common/       # 通用组件（Toast, ErrorBoundary等）
│   │   ├── editor/       # 编辑器组件
│   │   ├── layout/       # 布局组件
│   │   ├── qa/           # 问答相关组件
│   │   ├── resource/     # 资源相关组件
│   │   └── ui/           # 基础UI组件（Button, Input等）
│   ├── contexts/         # React Context（状态管理）
│   ├── hooks/            # 自定义 Hooks
│   ├── pages/            # 页面组件
│   ├── services/         # 服务层（数据加载、Markdown解析等）
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── styles/           # 全局样式
│   ├── App.tsx           # 应用根组件
│   └── main.tsx          # 应用入口
├── docs/                 # 文档目录
├── PERFORMANCE_OPTIMIZATION.md  # 性能优化文档
├── ACCESSIBILITY_GUIDE.md       # 无障碍访问指南
└── README.md             # 项目说明
```

### 组件组织原则

- **common/**: 跨功能的通用组件
- **ui/**: 基础UI组件，可复用
- **layout/**: 页面布局组件
- **resource/**: 资源管理相关组件
- **qa/**: 问答板相关组件
- **editor/**: 编辑器相关组件

## 📝 编码规范

### TypeScript

1. **使用严格的类型定义**
   ```typescript
   // ✅ 好的做法
   interface User {
     id: string;
     name: string;
     email: string;
   }

   // ❌ 避免
   const user: any = { ... };
   ```

2. **导出类型**
   ```typescript
   // types/resource.ts
   export interface Resource {
     id: string;
     title: string;
     // ...
   }
   ```

3. **使用类型推断**
   ```typescript
   // ✅ 好的做法
   const count = 5; // TypeScript 自动推断为 number

   // ❌ 不必要的类型注解
   const count: number = 5;
   ```

### React 组件

1. **使用函数组件和 Hooks**
   ```typescript
   // ✅ 好的做法
   export const MyComponent: React.FC<Props> = ({ data }) => {
     const [state, setState] = useState(initialState);
     return <div>{data}</div>;
   };
   ```

2. **组件文件命名**
   - 使用 PascalCase: `MyComponent.tsx`
   - 一个文件一个组件
   - 组件名与文件名一致

3. **Props 接口命名**
   ```typescript
   // ✅ 好的做法
   interface MyComponentProps {
     data: string;
     onSave: () => void;
   }

   export const MyComponent: React.FC<MyComponentProps> = ({ data, onSave }) => {
     // ...
   };
   ```

4. **使用性能优化**
   ```typescript
   // 对于纯组件使用 React.memo
   export const MyComponent = React.memo(({ data }) => {
     return <div>{data}</div>;
   });

   // 对于计算密集型操作使用 useMemo
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(data);
   }, [data]);

   // 对于回调函数使用 useCallback
   const handleClick = useCallback(() => {
     doSomething();
   }, []);
   ```

### 样式

1. **使用 Tailwind CSS**
   ```tsx
   // ✅ 好的做法
   <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
     {children}
   </div>
   ```

2. **使用 CSS 变量**
   ```css
   /* 在 index.css 中定义 */
   :root {
     --color-primary: #0047AB;
     --color-secondary: #666;
   }

   /* 在组件中使用 */
   .my-component {
     color: var(--color-primary);
   }
   ```

3. **响应式设计**
   ```tsx
   <div className="w-full md:w-1/2 lg:w-1/3">
     {content}
   </div>
   ```

### 无障碍访问

1. **使用语义化 HTML**
   ```tsx
   // ✅ 好的做法
   <button onClick={handleClick}>点击</button>
   <nav>...</nav>
   <main>...</main>

   // ❌ 避免
   <div onClick={handleClick}>点击</div>
   ```

2. **添加 ARIA 属性**
   ```tsx
   // 图标按钮
   <button aria-label="关闭">
     <CloseIcon />
   </button>

   // 模态框
   <div role="dialog" aria-modal="true" aria-labelledby="title">
     <h2 id="title">标题</h2>
   </div>
   ```

3. **确保键盘导航**
   ```tsx
   // 支持 Esc 键关闭
   useEffect(() => {
     const handleEscape = (e: KeyboardEvent) => {
       if (e.key === 'Escape') {
         onClose();
       }
     };
     document.addEventListener('keydown', handleEscape);
     return () => document.removeEventListener('keydown', handleEscape);
   }, [onClose]);
   ```

## 📦 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```bash
# 新功能
git commit -m "feat(resource): add video card component"

# 修复 bug
git commit -m "fix(qa): fix timeline answer sorting issue"

# 文档更新
git commit -m "docs: update README with deployment instructions"

# 性能优化
git commit -m "perf(resource): add React.memo to ResourceCard"

# 重构
git commit -m "refactor(editor): extract MarkdownPreview component"
```

## 🔄 Pull Request 流程

### 1. 创建分支

```bash
# 从 main 分支创建新分支
git checkout main
git pull upstream main
git checkout -b feature/my-new-feature
```

### 2. 开发和提交

```bash
# 进行开发
# ...

# 添加更改
git add .

# 提交更改
git commit -m "feat: add new feature"
```

### 3. 推送到你的 Fork

```bash
git push origin feature/my-new-feature
```

### 4. 创建 Pull Request

1. 访问你的 Fork 仓库
2. 点击 "New Pull Request"
3. 选择你的分支
4. 填写 PR 描述：
   - 描述你的更改
   - 关联相关的 Issue
   - 添加截图（如果是 UI 更改）
   - 列出测试步骤

### 5. PR 描述模板

```markdown
## 描述
简要描述你的更改

## 类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 性能优化
- [ ] 重构
- [ ] 其他

## 更改内容
- 添加了 XXX 功能
- 修复了 XXX 问题
- 优化了 XXX 性能

## 测试
- [ ] 本地测试通过
- [ ] 无障碍测试通过
- [ ] 性能测试通过

## 截图（如果适用）
[添加截图]

## 相关 Issue
Closes #123
```

### 6. 代码审查

- 响应审查意见
- 进行必要的修改
- 推送更新

```bash
# 修改代码后
git add .
git commit -m "fix: address review comments"
git push origin feature/my-new-feature
```

## 🧪 测试指南

### 手动测试

1. **功能测试**
   ```bash
   # 启动开发服务器
   npm run dev

   # 测试所有功能
   - 添加/编辑/删除资源
   - 添加/编辑/删除问题
   - 搜索和筛选
   - Markdown 编辑
   ```

2. **键盘导航测试**
   ```bash
   # 断开鼠标
   # 使用 Tab 键浏览页面
   # 确认所有交互元素可访问
   ```

3. **屏幕阅读器测试**
   ```bash
   # macOS: 启动 VoiceOver (Cmd + F5)
   # Windows: 启动 NVDA
   # 浏览页面确认内容可被朗读
   ```

4. **性能测试**
   ```bash
   # 打开 Chrome DevTools
   # 运行 Lighthouse 审计
   # 确认性能得分 > 90
   ```

### 构建测试

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 确认构建成功且应用正常运行
```

## 💡 开发技巧

### 1. 使用 React DevTools

安装 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展：
- 检查组件层级
- 查看 props 和 state
- 使用 Profiler 分析性能

### 2. 使用 TypeScript 严格模式

确保 `tsconfig.json` 中启用严格模式：
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 3. 使用 ESLint 和 Prettier

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint:fix
```

### 4. 热重载

Vite 支持热模块替换（HMR），修改代码后会自动刷新：
- 修改组件 → 自动更新
- 修改样式 → 自动更新
- 修改配置 → 需要手动刷新

## 📚 参考资源

### 官方文档
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 项目文档
- [README](./README.md) - 项目说明
- [性能优化文档](./PERFORMANCE_OPTIMIZATION.md) - 性能优化指南
- [无障碍访问指南](./ACCESSIBILITY_GUIDE.md) - 无障碍实施细节

### 编码规范
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ 常见问题

### Q: 如何添加新的组件？

A: 
1. 在相应的目录下创建组件文件
2. 使用 TypeScript 定义 Props 接口
3. 实现组件逻辑
4. 添加必要的样式
5. 确保无障碍访问
6. 在父组件中导入使用

### Q: 如何添加新的类型？

A:
1. 在 `src/types/` 目录下创建或修改类型文件
2. 导出类型定义
3. 在需要的地方导入使用

### Q: 如何优化组件性能？

A:
1. 使用 React.memo 包裹纯组件
2. 使用 useMemo 缓存计算结果
3. 使用 useCallback 缓存回调函数
4. 避免在渲染中创建新对象/数组
5. 使用 React DevTools Profiler 分析性能

### Q: 如何确保无障碍访问？

A:
1. 使用语义化 HTML 元素
2. 添加适当的 ARIA 属性
3. 确保键盘导航支持
4. 测试颜色对比度
5. 使用屏幕阅读器测试

## 🙏 感谢

感谢所有贡献者的付出！你的贡献让这个项目变得更好。

---

**有问题？** 欢迎在 [GitHub Issues](https://github.com/YOUR_USERNAME/personal-knowledge-website/issues) 中提问。
