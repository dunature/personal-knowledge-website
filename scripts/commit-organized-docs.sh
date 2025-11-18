#!/bin/bash

# 提交整理后的文档到仓库
# 注意：开发过程文档已通过 .gitignore 排除，不会被推送

set -e

echo "📝 准备提交整理后的文档..."

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在 git 仓库中
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误：当前目录不是 git 仓库${NC}"
    exit 1
fi

# 显示将要提交的更改
echo -e "${BLUE}📋 检查更改状态...${NC}"
git status

echo ""
echo -e "${YELLOW}⚠️  注意：${NC}"
echo "- 开发过程文档（docs/archive/development-process/）已通过 .gitignore 排除"
echo "- 只有功能文档、用户指南和项目文档会被推送到仓库"
echo ""

# 询问用户是否继续
read -p "是否继续提交？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  已取消提交${NC}"
    exit 0
fi

# 添加所有更改
echo -e "${BLUE}📦 添加更改到暂存区...${NC}"
git add .

# 显示将要提交的文件
echo -e "${BLUE}📄 将要提交的文件：${NC}"
git diff --cached --name-only

echo ""

# 提交更改
echo -e "${BLUE}💾 提交更改...${NC}"
git commit -m "docs: 整理项目文档结构

- 将所有文档按功能分类整理到 docs/ 目录
- 创建清晰的文档目录结构
- 更新文档索引和导航
- 将开发过程文档归档到 docs/archive/development-process/
- 通过 .gitignore 排除开发过程文档，不推送到仓库
- 保留功能文档、用户指南和项目文档供团队使用

文档结构：
- features/: 按功能模块组织的文档
- development/: 开发相关技术文档
- troubleshooting/: 问题诊断和解决方案
- testing/: 测试相关文档
- user-guides/: 用户使用指南
- project/: 项目整体文档
- guides/: 各类指南
- archive/: 归档文档（不推送到仓库）
"

echo ""
echo -e "${GREEN}✅ 提交完成！${NC}"
echo ""
echo -e "${YELLOW}📤 下一步：${NC}"
echo "运行以下命令推送到远程仓库："
echo -e "${BLUE}git push origin main${NC}"
echo ""
echo -e "${YELLOW}💡 提示：${NC}"
echo "- 推送前请确认远程分支名称（可能是 main 或 master）"
echo "- 开发过程文档不会被推送（已通过 .gitignore 排除）"
echo "- 如需推送到其他分支，请修改上述命令"
