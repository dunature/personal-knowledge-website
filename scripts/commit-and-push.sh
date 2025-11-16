#!/bin/bash

# Git 提交和推送脚本

set -e

echo "📝 准备提交更改到 Git..."

# 检查是否在 Git 仓库中
if [ ! -d .git ]; then
    echo "❌ 错误：当前目录不是 Git 仓库"
    echo "请先初始化 Git 仓库："
    echo "  git init"
    echo "  git remote add origin <your-repo-url>"
    exit 1
fi

# 显示当前状态
echo ""
echo "📊 当前 Git 状态："
git status --short

echo ""
echo "📁 将要提交的更改："
echo "  - 文档结构重组"
echo "  - 平台自动填充功能（YouTube、Bilibili、GitHub）"
echo "  - Bilibili 封面防盗链修复"
echo "  - UI 设计系统更新"
echo "  - README 和 CHANGELOG 更新"

echo ""
read -p "确认提交这些更改？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消提交"
    exit 1
fi

# 添加所有更改
echo ""
echo "📦 添加文件到暂存区..."
git add .

# 提交
echo ""
echo "💾 提交更改..."
git commit -m "feat: 文档重组和平台自动填充功能

### 新增功能
- 平台自动填充（YouTube、Bilibili、GitHub）
- UI 设计系统（统一的设计令牌）
- 文档结构重组

### 修复
- Bilibili 封面防盗链问题（图片代理）
- Bilibili API CORS 问题（API 代理）
- 分类筛选功能

### 改进
- 文档整理到 docs/ 目录
- 更新 README.md 和 CHANGELOG.md
- 优化 UI 组件样式

详见 CHANGELOG.md"

# 推送到远程
echo ""
echo "🚀 推送到 GitHub..."
echo ""
read -p "推送到哪个分支？(默认: main) " branch
branch=${branch:-main}

echo ""
echo "推送到分支: $branch"
git push origin $branch

echo ""
echo "✅ 成功推送到 GitHub！"
echo ""
echo "🔗 查看你的仓库："
echo "   git remote -v"
