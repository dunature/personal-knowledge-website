# 个人知识管理系统 📚

一个用于记录学习笔记和技术文章的个人网站，帮助你更好地管理和回顾学习内容。

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ 功能特点

### 📚 资源导航
- 收藏和管理学习资源（视频、博客、GitHub 仓库等）
- 支持多种资源类型（YouTube、Bilibili、博客、工具）
- 分类筛选和标签管理
- 实时搜索和排序

### 💬 问答板
- 记录问题和解决方案
- 支持大问题和小问题的层级结构
- 时间线式回答记录
- 状态管理（未解决、解决中、已解决）

### ✍️ Markdown 编辑
- 富文本 Markdown 编辑器
- 实时预览
- 代码高亮
- 图片上传支持

### 🔍 搜索和筛选
- 全文搜索
- 多维度筛选（分类、标签、状态）
- 智能排序

---

## 🛠️ 技术栈

- **前端框架**: React 19
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **Markdown**: Marked.js + Highlight.js
- **图标库**: Lucide React
- **动画库**: Framer Motion
- **路由**: React Router

---

## 🚀 快速开始

### 前提条件

- Node.js >= 18
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/personal-knowledge-website.git

# 进入项目目录
cd personal-knowledge-website

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📦 项目结构

```
personal-knowledge-website/
├── public/
│   └── data/              # 示例数据
│       ├── resources.json
│       ├── questions.json
│       └── categories.json
├── src/
│   ├── components/        # React 组件
│   │   ├── common/       # 通用组件
│   │   ├── editor/       # 编辑器组件
│   │   ├── layout/       # 布局组件
│   │   ├── qa/           # 问答组件
│   │   ├── resource/     # 资源组件
│   │   └── ui/           # UI 组件
│   ├── contexts/         # React Context
│   ├── hooks/            # 自定义 Hooks
│   ├── pages/            # 页面组件
│   ├── services/         # 服务层
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   └── main.tsx          # 入口文件
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎯 核心功能演示

### 资源管理
- 添加各类学习资源
- 按分类和标签筛选
- 搜索资源内容

### 问答记录
- 创建大问题
- 添加小问题分解
- 记录时间线式回答
- 编写最终总结

### Markdown 编辑
- 支持标题、列表、代码块
- 实时预览
- 工具栏快捷操作

---

## 📖 文档

- [部署指南](./DEPLOYMENT.md) - 完整的部署文档
- [快速部署](./QUICK_DEPLOY.md) - 快速部署到 Vercel/Netlify
- [GitHub 设置](./GITHUB_SETUP.md) - GitHub 仓库创建指南

---

## 🚀 部署

项目支持多种部署方式：

### Vercel（推荐）
```bash
# 推送代码到 GitHub 后
# 访问 https://vercel.com
# 导入仓库并点击 Deploy
```

### Netlify
```bash
# 推送代码到 GitHub 后
# 访问 https://netlify.com
# 导入仓库并点击 Deploy
```

详细步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

---

## 📄 License

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 🙏 致谢

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [Lucide Icons](https://lucide.dev/)

---

## 📧 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

**Made with ❤️ by d3121565738@163.com**
