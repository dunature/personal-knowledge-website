# 快速开始指南

## ✅ 任务1已完成：项目初始化和基础配置

### 已完成的工作

1. ✅ 创建Vite + React + TypeScript项目
2. ✅ 配置Tailwind CSS和PostCSS
3. ✅ 安装核心依赖：
   - marked (Markdown解析)
   - highlight.js (代码高亮)
   - framer-motion (动画)
   - lucide-react (图标)
4. ✅ 配置路径别名（@/components, @/types等）
5. ✅ 创建基础文件夹结构
6. ✅ 配置全局样式和CSS变量
7. ✅ 设置ESLint和TypeScript配置

### 项目结构

```
personal-knowledge-website/
├── public/
│   ├── data/              # 数据文件（待创建）
│   └── images/            # 图片资源
├── src/
│   ├── components/
│   │   ├── ui/           # 基础UI组件（待创建）
│   │   ├── resource/     # 资源组件（待创建）
│   │   ├── qa/           # 问答组件（待创建）
│   │   ├── editor/       # 编辑器组件（待创建）
│   │   └── layout/       # 布局组件（待创建）
│   ├── contexts/         # Context（待创建）
│   ├── hooks/            # Hooks（待创建）
│   ├── services/         # 服务（待创建）
│   ├── types/            # 类型定义（待创建）
│   ├── utils/            # 工具函数（待创建）
│   ├── styles/           # 样式文件（待创建）
│   ├── App.tsx           # ✅ 已创建
│   ├── App.css           # ✅ 已创建
│   ├── index.css         # ✅ 已配置
│   └── main.tsx          # ✅ 已存在
├── tailwind.config.js    # ✅ 已配置
├── postcss.config.js     # ✅ 已配置
├── vite.config.ts        # ✅ 已配置路径别名
├── tsconfig.app.json     # ✅ 已配置路径别名
└── package.json          # ✅ 已安装依赖
```

## 🚀 启动开发服务器

```bash
cd personal-knowledge-website
npm run dev
```

访问 http://localhost:5173 查看应用

## 📋 下一步任务

### 任务2：定义TypeScript类型和数据结构

需要创建以下类型文件：

1. `src/types/resource.ts` - 资源相关类型
2. `src/types/question.ts` - 问答相关类型
3. `src/types/common.ts` - 通用类型
4. `src/types/error.ts` - 错误类型

### 任务3：实现数据服务层

需要创建：

1. `src/services/dataService.ts` - 数据服务类
2. `src/services/storageService.ts` - 存储服务
3. `src/services/markdownService.ts` - Markdown服务

## 🎨 设计系统已配置

### Tailwind自定义配置

- **颜色**：primary, secondary, tertiary, text, background等
- **字号**：h1, h2, h3, card-title, body, secondary, small
- **间距**：xs, sm, md, lg, xl, xxl
- **圆角**：card, button, tag
- **阴影**：card, card-hover, modal
- **过渡时长**：fast (200ms), normal (300ms), slow (500ms)

### CSS变量

在 `src/index.css` 中定义了全局CSS变量：
- `--color-primary`: #0047AB
- `--color-secondary`: #666
- `--color-tertiary`: #999
- 等等...

### 工具类

- `.transition-fast` - 0.2s过渡
- `.transition-normal` - 0.3s过渡
- `.transition-slow` - 0.5s过渡
- `.card-hover` - 卡片悬停效果

## 📖 使用示例

### 使用Tailwind类

```tsx
<div className="bg-primary text-white p-md rounded-card shadow-card">
  <h2 className="text-h2">标题</h2>
  <p className="text-body">内容</p>
</div>
```

### 使用路径别名

```tsx
import { Button } from '@/components/ui/Button'
import { Resource } from '@/types/resource'
import { useResources } from '@/hooks/useResources'
```

## 🔍 验证安装

运行以下命令验证项目配置：

```bash
# 检查TypeScript编译
npm run build

# 检查代码规范
npm run lint
```

## 📚 相关文档

- 需求文档：`.kiro/specs/personal-knowledge-website/requirements.md`
- 设计文档：`.kiro/specs/personal-knowledge-website/design.md`
- 任务列表：`.kiro/specs/personal-knowledge-website/tasks.md`

## 💡 提示

1. 所有新组件都应该使用TypeScript
2. 遵循设计规范中的颜色、字号、间距系统
3. 使用路径别名导入模块
4. 组件应该是可复用的
5. 添加适当的注释和文档

---

**准备好了吗？** 开始执行任务2：定义TypeScript类型和数据结构！
