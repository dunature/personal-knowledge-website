# 项目文件结构

本文档详细说明了个人知识管理系统的文件组织结构，便于理解和维护。

## 📁 根目录结构

```
personal-knowledge-website/
├── .git/                      # Git版本控制
├── .kiro/                     # Kiro IDE配置
│   ├── settings/             # IDE设置
│   └── specs/                # 项目规格文档
├── dist/                      # 构建输出目录
├── docs/                      # 项目文档
├── node_modules/              # 依赖包
├── public/                    # 静态资源
├── src/                       # 源代码
├── .env.example              # 环境变量示例
├── .gitignore                # Git忽略文件
├── eslint.config.js          # ESLint配置
├── index.html                # HTML入口
├── package.json              # 项目配置
├── postcss.config.js         # PostCSS配置
├── tailwind.config.js        # Tailwind CSS配置
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
├── vercel.json               # Vercel部署配置
├── netlify.toml              # Netlify部署配置
├── README.md                 # 项目说明
├── CONTRIBUTING.md           # 贡献指南
├── PROJECT_SUMMARY.md        # 项目总结
├── PERFORMANCE_OPTIMIZATION.md  # 性能优化文档
├── ACCESSIBILITY_GUIDE.md    # 无障碍访问指南
└── TOAST_INTEGRATION.md      # Toast通知集成文档
```

---

## 📂 源代码结构 (src/)

### 核心文件

```
src/
├── main.tsx                  # 应用入口
├── App.tsx                   # 根组件
├── App.css                   # 根组件样式
└── index.css                 # 全局样式
```

### 组件目录 (components/)

```
src/components/
├── common/                   # 通用组件
│   ├── AutoSaveIndicator.tsx      # 自动保存指示器
│   ├── ErrorBoundary.tsx          # 错误边界
│   ├── ErrorMessage.tsx           # 错误消息
│   ├── LazyImage.tsx              # 懒加载图片
│   ├── LoadingState.tsx           # 加载状态
│   ├── MarkdownPreview.tsx        # Markdown预览
│   ├── MarkdownPreview.css        # Markdown样式
│   ├── Toast.tsx                  # Toast通知
│   ├── ERROR_HANDLING_GUIDE.md    # 错误处理指南
│   └── NOTIFICATION_GUIDE.md      # 通知系统指南
│
├── editor/                   # 编辑器组件
│   ├── EditorDrawer.tsx           # 编辑器抽屉
│   ├── EditorForm.tsx             # 编辑器表单
│   ├── EditorToolbar.tsx          # 编辑器工具栏
│   ├── ImageUploader.tsx          # 图片上传
│   └── MarkdownEditor.tsx         # Markdown编辑器
│
├── layout/                   # 布局组件
│   ├── QASection.tsx              # 问答板区域
│   └── ResourceSection.tsx        # 资源导航区域
│
├── qa/                       # 问答相关组件
│   ├── QuestionFilter.tsx         # 问题筛选器
│   ├── QuestionItem.tsx           # 问题列表项
│   ├── QuestionModal.tsx          # 问题详情弹窗
│   ├── QuestionModalWithEdit.tsx  # 带编辑功能的问题弹窗
│   ├── SubQuestion.tsx            # 小问题组件
│   └── TimelineAnswer.tsx         # 时间线回答
│
├── resource/                 # 资源相关组件
│   ├── BlogCard.tsx               # 博客卡片
│   ├── CategoryFilter.tsx         # 分类筛选器
│   ├── GitHubCard.tsx             # GitHub卡片
│   ├── RedditCard.tsx             # Reddit卡片
│   ├── ResourceCard.tsx           # 资源卡片基础组件
│   ├── SearchBar.tsx              # 搜索栏
│   ├── TagFilter.tsx              # 标签筛选器
│   ├── ToolCard.tsx               # 工具卡片
│   └── VideoCard.tsx              # 视频卡片
│
└── ui/                       # 基础UI组件
    ├── Button.tsx                 # 按钮
    ├── Dropdown.tsx               # 下拉菜单
    ├── Input.tsx                  # 输入框
    ├── Modal.tsx                  # 模态框
    └── Tag.tsx                    # 标签
```

### 上下文 (contexts/)

```
src/contexts/
├── QAContext.tsx             # 问答状态管理
└── ResourceContext.tsx       # 资源状态管理
```

### 自定义Hooks (hooks/)

```
src/hooks/
├── useAutoSave.ts            # 自动保存Hook
├── useFilter.ts              # 筛选Hook
├── useLocalStorage.ts        # 本地存储Hook
└── useToast.ts               # Toast通知Hook
```

### 页面 (pages/)

```
src/pages/
├── HomePage.tsx              # 主页
├── ComponentTest.tsx         # 组件测试页
├── EditorDrawerTest.tsx      # 编辑器测试页
├── ErrorHandlingTest.tsx     # 错误处理测试页
├── MarkdownEditorTest.tsx    # Markdown编辑器测试页
├── NotificationTest.tsx      # 通知测试页
├── QuestionModalTest.tsx     # 问题弹窗测试页
└── SimpleTest.tsx            # 简单测试页
```

### 服务 (services/)

```
src/services/
└── markdownService.ts        # Markdown解析服务
```

### 样式 (styles/)

```
src/styles/
├── QUICK_REFERENCE.md        # 样式快速参考
└── README.md                 # 样式系统说明
```

### 类型定义 (types/)

```
src/types/
├── index.ts                  # 类型导出
├── question.ts               # 问答相关类型
└── resource.ts               # 资源相关类型
```

### 工具函数 (utils/)

```
src/utils/
├── animationUtils.ts         # 动画工具
├── dateUtils.ts              # 日期工具
├── errorUtils.ts             # 错误处理工具
├── functionUtils.ts          # 通用函数工具
├── placeholderUtils.ts       # 占位符工具
└── validationUtils.ts        # 验证工具
```

---

## 📚 文档目录 (docs/)

```
docs/
├── archive/                  # 归档文档
├── deployment/               # 部署相关文档
│   ├── DEPLOYMENT.md              # 部署指南
│   ├── GITHUB_SETUP.md            # GitHub设置
│   └── QUICK_DEPLOY.md            # 快速部署
│
├── development/              # 开发相关文档
│   ├── CRUD_COMPLETE.md           # CRUD功能说明
│   └── DOCUMENTATION_SUMMARY.md   # 文档总览
│
├── fixes/                    # 修复记录
├── user-guides/              # 用户指南
│   ├── QUICK_TEST_CRUD.md         # 快速测试指南
│   ├── RESOURCE_COVER_GUIDE.md    # 资源封面指南
│   └── USER_GUIDE_CN.md           # 中文使用指南
│
├── FILE_ORGANIZATION.md      # 文件组织说明
└── README.md                 # 文档目录
```

---

## 🗂️ 公共资源 (public/)

```
public/
├── data/                     # 示例数据
│   ├── categories.json            # 分类数据
│   ├── questions.json             # 问题数据
│   └── resources.json             # 资源数据
└── vite.svg                  # Vite图标
```

---

## 🔧 配置文件说明

### TypeScript配置
- `tsconfig.json` - 主配置
- `tsconfig.app.json` - 应用配置
- `tsconfig.node.json` - Node配置

### 构建和开发
- `vite.config.ts` - Vite构建配置
- `package.json` - 项目依赖和脚本

### 代码质量
- `eslint.config.js` - ESLint规则
- `.gitignore` - Git忽略规则

### 样式
- `tailwind.config.js` - Tailwind CSS配置
- `postcss.config.js` - PostCSS配置

### 部署
- `vercel.json` - Vercel部署配置
- `netlify.toml` - Netlify部署配置

---

## 📋 组件分类说明

### 1. 基础UI组件 (ui/)
可复用的基础组件，不包含业务逻辑：
- Button, Input, Tag, Modal, Dropdown

### 2. 通用组件 (common/)
跨功能的通用组件：
- Toast, ErrorBoundary, LoadingState, LazyImage

### 3. 布局组件 (layout/)
页面级布局组件：
- ResourceSection, QASection

### 4. 功能组件
- **resource/** - 资源管理相关
- **qa/** - 问答管理相关
- **editor/** - 编辑器相关

---

## 🎯 命名规范

### 文件命名
- **组件文件**: PascalCase (如 `ResourceCard.tsx`)
- **工具文件**: camelCase (如 `dateUtils.ts`)
- **类型文件**: camelCase (如 `resource.ts`)
- **样式文件**: kebab-case 或与组件同名

### 组件命名
- **React组件**: PascalCase (如 `ResourceCard`)
- **Hook**: camelCase, 以use开头 (如 `useToast`)
- **Context**: PascalCase, 以Context结尾 (如 `ResourceContext`)

### 变量命名
- **常量**: UPPER_SNAKE_CASE (如 `MAX_LENGTH`)
- **变量/函数**: camelCase (如 `handleClick`)
- **类型/接口**: PascalCase (如 `ResourceType`)

---

## 🔍 快速查找指南

### 需要修改UI样式？
→ `src/components/ui/` 或 `src/index.css`

### 需要添加新的资源类型？
→ `src/types/resource.ts` + `src/components/resource/`

### 需要修改数据结构？
→ `src/types/` + `src/contexts/`

### 需要添加新功能？
→ 先在 `src/components/` 创建组件，然后在 `src/pages/` 中使用

### 需要修改筛选逻辑？
→ `src/contexts/` 中的Context组件

### 需要添加工具函数？
→ `src/utils/` 对应的工具文件

---

## 📝 开发流程

1. **添加新功能**
   - 在 `src/types/` 定义类型
   - 在 `src/components/` 创建组件
   - 在 `src/contexts/` 添加状态管理（如需要）
   - 在 `src/pages/` 中集成

2. **修改现有功能**
   - 找到对应的组件文件
   - 修改组件逻辑
   - 更新相关类型定义（如需要）
   - 测试功能

3. **添加文档**
   - 功能文档 → `docs/development/`
   - 用户指南 → `docs/user-guides/`
   - 部署文档 → `docs/deployment/`

---

**最后更新**: 2025-11-12  
**维护者**: 开发团队
