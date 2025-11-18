#!/bin/bash

# 提交核心文档到仓库
# 只推送：用户指南、项目文档、指南

set -e

echo "📝 准备提交核心文档..."

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
echo ""
echo -e "${YELLOW}将要推送的文档：${NC}"
echo "✅ docs/user-guides/ - 用户指南"
echo "✅ docs/project/ - 项目文档"
echo "✅ docs/guides/ - 指南"
echo "✅ docs/README.md - 文档中心"
echo "✅ docs/INDEX.md - 文档索引"
echo "✅ docs/OPTIMIZATION_CHECKLIST.md - 优化清单"
echo "✅ docs/DATA_STORAGE_FAQ.md - 数据存储FAQ"
echo ""
echo -e "${RED}不会推送的文档：${NC}"
echo "❌ docs/features/ - 功能文档"
echo "❌ docs/development/ - 开发文档"
echo "❌ docs/troubleshooting/ - 故障排除"
echo "❌ docs/testing/ - 测试文档"
echo "❌ docs/deployment/ - 部署文档"
echo "❌ docs/archive/ - 归档文档"
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
echo -e "${BLUE}📄 将要提交的文档文件：${NC}"
git diff --cached --name-only | grep "^docs/" | grep -E "(user-guides|project|guides|README|INDEX|OPTIMIZATION_CHECKLIST|DATA_STORAGE_FAQ)" || echo "  (无文档更改)"

echo ""

# 提交更改
echo -e "${BLUE}💾 提交更改...${NC}"
git commit -m "docs: 更新核心文档

- 更新用户指南
- 更新项目文档  
- 更新指南文档
- 更新文档索引

仅推送核心文档，其他文档通过 .gitignore 排除：
- 功能文档、开发文档、测试文档等保留在本地
- 保持仓库整洁，只包含用户和项目必需文档
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
echo "- 功能文档、开发文档等不会被推送（已通过 .gitignore 排除）"
echo "- 如需推送到其他分支，请修改上述命令"
