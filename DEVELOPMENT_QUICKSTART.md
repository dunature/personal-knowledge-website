# 开发快速入门

本文档帮助你快速开始开发个人知识管理系统。

## 🚀 5分钟快速开始

### 1. 环境准备

```bash
# 确保已安装
node -v  # >= 18
npm -v   # >= 9
```

### 2. 克隆和安装

```bash
# 克隆项目
git clone <your-repo-url>
cd personal-knowledge-website

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 打开浏览器

访问 http://localhost:5173

---

## 📁 关键文件位置

### 需要修改功能？

| 功能 | 文件位置 |
|------|---------|
| 资源展示逻辑 | `src/components/layout/ResourceSection.tsx` |
| 问答展示逻辑 | `src/components/layout/QASection.tsx` |
| 资源状态管理 | `src/contexts/ResourceContext.tsx` |
| 问答状态管理 | `src/contexts/QAContext.tsx` |
| 主页布局 | `src/pages/HomePage.tsx` |
| 全局样式 | `src/index.css` |
| Tailwind配置 | `tailwind.config.js` |

### 需要添加组件？

| 组件类型 | 目录 |
|---------|------|
| 基础UI组件 | `src/components/ui/` |
| 通用组件 | `src/components/common/` |
| 资源相关 | `src/components/resource/` |
| 问答相关 | `src/components/qa/` |
| 编辑器相关 | `src/components/editor/` |

### 需要修改类型？

| 类型 | 文件 |
|------|------|
| 资源类型 | `src/types/resource.ts` |
| 问答类型 | `src/types/question.ts` |

---

## 🎯 常见开发任务

### 任务1: 添加新的资源类型

**场景**: 想要添加一个"播客"类型的资源卡片

**步骤**:

1. **定义类型** (`src/types/resource.ts`)
   ```typescript
   export type ResourceType = 
     | 'youtube_video' 
     | 'bilibili_video'
     | 'blog' 
     | 'github' 
     | 'reddit' 
     | 'tool'
     | 'podcast';  // 新增
   ```

2. **创建卡片组件** (`src/components/resource/PodcastCard.tsx`)
   ```typescript
   export const PodcastCard: React.FC<VideoCardProps> = 
     React.memo(({ resource, onTagClick }) => {
       // 实现卡片UI
     });
   ```

3. **添加到ResourceCard** (`src/components/resource/ResourceCard.tsx`)
   ```typescript
   switch (resource.type) {
     // ... 其他类型
     case 'podcast':
       return <PodcastCard {...commonProps} />;
   }
   ```

### 任务2: 修改筛选逻辑

**场景**: 想要添加按作者筛选的功能

**步骤**:

1. **添加状态** (`src/contexts/ResourceContext.tsx`)
   ```typescript
   const [selectedAuthor, setSelectedAuthor] = useState<string>('');
   ```

2. **修改筛选逻辑**
   ```typescript
   const filteredResources = useMemo(() => {
     let filtered = resources;
     
     // 添加作者筛选
     if (selectedAuthor) {
       filtered = filtered.filter(r => r.author === selectedAuthor);
     }
     
     return filtered;
   }, [resources, selectedAuthor]);
   ```

3. **添加UI组件** (创建AuthorFilter组件)

### 任务3: 添加新的UI组件

**场景**: 需要一个新的Switch开关组件

**步骤**:

1. **创建组件** (`src/components/ui/Switch.tsx`)
   ```typescript
   export interface SwitchProps {
     checked: boolean;
     onChange: (checked: boolean) => void;
     label?: string;
   }
   
   export const Switch: React.FC<SwitchProps> = 
     React.memo(({ checked, onChange, label }) => {
       // 实现开关UI
     });
   ```

2. **使用组件**
   ```typescript
   import { Switch } from '@/components/ui/Switch';
   
   <Switch 
     checked={isEnabled} 
     onChange={setIsEnabled}
     label="启用功能"
   />
   ```

### 任务4: 修改Toast通知样式

**场景**: 想要改变Toast的位置或样式

**步骤**:

1. **修改Toast组件** (`src/components/common/Toast.tsx`)
   - 修改背景颜色、文字颜色
   - 修改图标

2. **修改Toast容器位置** (`src/pages/HomePage.tsx`)
   ```typescript
   {/* 从右上角改为左下角 */}
   <div className="fixed bottom-4 left-4 z-50 space-y-2">
     {toasts.map((toast) => (
       <Toast {...toast} />
     ))}
   </div>
   ```

---

## 🎨 样式开发

### Tailwind CSS类名

项目使用Tailwind CSS，常用类名：

```typescript
// 颜色
text-primary      // #0047AB (主色调)
text-secondary    // #666
text-tertiary     // #999
bg-primary        // #0047AB
bg-success        // #2E7D32
bg-error          // #D32F2F

// 间距
gap-sm   // 8px
gap-md   // 16px
gap-lg   // 24px
p-md     // padding 16px
m-lg     // margin 24px

// 动画
transition-fast    // 0.2s
transition-normal  // 0.3s
animate-fadeIn     // 淡入动画
```

### 自定义样式

在 `src/index.css` 中添加全局样式：

```css
.my-custom-class {
  /* 自定义样式 */
}
```

---

## 🔍 调试技巧

### 1. React DevTools

安装浏览器扩展，查看组件树和状态

### 2. Console日志

```typescript
console.log('当前资源:', resources);
console.log('筛选后:', filteredResources);
```

### 3. TypeScript错误

```bash
# 检查类型错误
npm run build
```

### 4. ESLint检查

```bash
# 检查代码规范
npm run lint
```

---

## 📦 构建和部署

### 本地构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署到Vercel

```bash
# 推送到GitHub
git push origin main

# 在Vercel中导入仓库
# 自动部署
```

详细部署指南: [docs/deployment/DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)

---

## 🐛 常见问题

### Q: 修改代码后页面没有更新？

A: 检查开发服务器是否正在运行，尝试刷新浏览器

### Q: TypeScript报错？

A: 
1. 检查类型定义是否正确
2. 运行 `npm run build` 查看详细错误
3. 查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解类型规范

### Q: 样式没有生效？

A: 
1. 检查Tailwind类名是否正确
2. 检查是否需要重启开发服务器
3. 查看浏览器控制台是否有CSS错误

### Q: 如何添加新的依赖？

A:
```bash
npm install <package-name>
```

---

## 📚 推荐阅读顺序

1. **首次开发**: 
   - [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - 了解项目结构
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - 了解开发规范

2. **深入开发**:
   - [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) - 性能优化
   - [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md) - 无障碍访问

3. **部署上线**:
   - [docs/deployment/DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md) - 部署指南

---

## 💡 开发提示

1. **使用TypeScript**: 充分利用类型检查，避免运行时错误
2. **组件复用**: 优先使用现有组件，避免重复造轮子
3. **性能优化**: 使用React.memo、useMemo、useCallback
4. **代码规范**: 遵循ESLint规则，保持代码一致性
5. **提交规范**: 使用清晰的commit message

---

**Happy Coding! 🎉**

如有问题，请查看 [README.md](./README.md) 或提交 Issue。
