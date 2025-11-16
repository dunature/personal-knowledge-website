#!/bin/bash

# 文档重组脚本
# 将根目录的文档移动到合理的目录结构中

set -e

echo "📁 开始整理文档结构..."

# 创建目录结构
echo "创建目录结构..."
mkdir -p docs/getting-started
mkdir -p docs/features/platform-autofill
mkdir -p docs/features/youtube
mkdir -p docs/features/mode-switcher
mkdir -p docs/features/gist-integration
mkdir -p docs/features/ui-components
mkdir -p docs/troubleshooting/bilibili-issues
mkdir -p docs/troubleshooting/category-issues
mkdir -p docs/guides
mkdir -p docs/project
mkdir -p scripts
mkdir -p tests/manual

# 移动到 docs/getting-started/
echo "移动快速开始文档..."
[ -f DEVELOPMENT_QUICKSTART.md ] && mv DEVELOPMENT_QUICKSTART.md docs/getting-started/QUICK_START.md
[ -f FILE_STRUCTURE.md ] && mv FILE_STRUCTURE.md docs/getting-started/ARCHITECTURE.md

# 移动到 docs/features/platform-autofill/
echo "移动平台自动填充文档..."
[ -f PLATFORM_AUTO_FILL_GUIDE.md ] && mv PLATFORM_AUTO_FILL_GUIDE.md docs/features/platform-autofill/
[ -f PLATFORM_AUTOFILL_TEST.md ] && mv PLATFORM_AUTOFILL_TEST.md docs/features/platform-autofill/
[ -f PLATFORM_DEBUG_GUIDE.md ] && mv PLATFORM_DEBUG_GUIDE.md docs/features/platform-autofill/
[ -f AUTOFILL_FIX_SUMMARY.md ] && mv AUTOFILL_FIX_SUMMARY.md docs/features/platform-autofill/
[ -f QUICK_TEST_GUIDE.md ] && mv QUICK_TEST_GUIDE.md docs/features/platform-autofill/
[ -f TEST_CHECKLIST.md ] && mv TEST_CHECKLIST.md docs/features/platform-autofill/

# 移动到 docs/troubleshooting/bilibili-issues/
echo "移动 Bilibili 问题文档..."
[ -f BILIBILI_404_FIX.md ] && mv BILIBILI_404_FIX.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_GITHUB_AUTOFILL_FIX.md ] && mv BILIBILI_GITHUB_AUTOFILL_FIX.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_IMAGE_PROXY_FIX.md ] && mv BILIBILI_IMAGE_PROXY_FIX.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_ISSUE_RESOLVED.md ] && mv BILIBILI_ISSUE_RESOLVED.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_TEST_VIDEOS.md ] && mv BILIBILI_TEST_VIDEOS.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_THUMBNAIL_DEBUG.md ] && mv BILIBILI_THUMBNAIL_DEBUG.md docs/troubleshooting/bilibili-issues/
[ -f BILIBILI_THUMBNAIL_FIX.md ] && mv BILIBILI_THUMBNAIL_FIX.md docs/troubleshooting/bilibili-issues/

# 移动到 docs/troubleshooting/category-issues/
echo "移动分类问题文档..."
[ -f CATEGORY_FEATURE_WORKING.md ] && mv CATEGORY_FEATURE_WORKING.md docs/troubleshooting/category-issues/
[ -f CATEGORY_FILTER_FIX.md ] && mv CATEGORY_FILTER_FIX.md docs/troubleshooting/category-issues/
[ -f CATEGORY_FIX_SUMMARY.md ] && mv CATEGORY_FIX_SUMMARY.md docs/troubleshooting/category-issues/
[ -f CATEGORY_ISSUE_ANALYSIS.md ] && mv CATEGORY_ISSUE_ANALYSIS.md docs/troubleshooting/category-issues/
[ -f DEBUG_CATEGORY_ISSUE.md ] && mv DEBUG_CATEGORY_ISSUE.md docs/troubleshooting/category-issues/
[ -f test-category-fix.md ] && mv test-category-fix.md docs/troubleshooting/category-issues/

# 移动到 docs/features/ui-components/
echo "移动 UI 组件文档..."
[ -f CARD_LAYOUT_IMPROVEMENTS.md ] && mv CARD_LAYOUT_IMPROVEMENTS.md docs/features/ui-components/
[ -f RESOURCE_CARD_IMPROVEMENTS.md ] && mv RESOURCE_CARD_IMPROVEMENTS.md docs/features/ui-components/
[ -f VIDEO_CARD_IMPROVEMENTS.md ] && mv VIDEO_CARD_IMPROVEMENTS.md docs/features/ui-components/
[ -f TOAST_INTEGRATION.md ] && mv TOAST_INTEGRATION.md docs/features/ui-components/

# 移动到 docs/features/youtube/
echo "移动 YouTube 文档..."
[ -f YOUTUBE_INTEGRATION_TEST.md ] && mv YOUTUBE_INTEGRATION_TEST.md docs/features/youtube/
[ -f YOUTUBE_QUICK_START.md ] && mv YOUTUBE_QUICK_START.md docs/features/youtube/
[ -f YOUTUBE_THUMBNAIL_GUIDE.md ] && mv YOUTUBE_THUMBNAIL_GUIDE.md docs/features/youtube/
[ -f PLACEHOLDER_IMAGE_FIX.md ] && mv PLACEHOLDER_IMAGE_FIX.md docs/features/youtube/

# 移动到 docs/features/mode-switcher/
echo "移动模式切换文档..."
[ -f MODE_SWITCHER_INTEGRATION.md ] && mv MODE_SWITCHER_INTEGRATION.md docs/features/mode-switcher/
[ -f MODE_SWITCHER_TEST_GUIDE.md ] && mv MODE_SWITCHER_TEST_GUIDE.md docs/features/mode-switcher/

# 移动到 docs/features/gist-integration/
echo "移动 Gist 集成文档..."
[ -f GIST_OWNERSHIP_TEST_GUIDE.md ] && mv GIST_OWNERSHIP_TEST_GUIDE.md docs/features/gist-integration/
[ -f GIST_TEST_ACCESS.md ] && mv GIST_TEST_ACCESS.md docs/features/gist-integration/
[ -f OWNERSHIP_VERIFICATION_UI.md ] && mv OWNERSHIP_VERIFICATION_UI.md docs/features/gist-integration/

# 移动到 docs/guides/
echo "移动指南文档..."
[ -f ACCESSIBILITY_GUIDE.md ] && mv ACCESSIBILITY_GUIDE.md docs/guides/
[ -f PERFORMANCE_OPTIMIZATION.md ] && mv PERFORMANCE_OPTIMIZATION.md docs/guides/
[ -f TEST_GUIDE.md ] && mv TEST_GUIDE.md docs/guides/

# 移动到 docs/project/
echo "移动项目文档..."
[ -f PROJECT_STATUS.md ] && mv PROJECT_STATUS.md docs/project/
[ -f PROJECT_SUMMARY.md ] && mv PROJECT_SUMMARY.md docs/project/
[ -f FINAL_SUMMARY.md ] && mv FINAL_SUMMARY.md docs/project/

# 移动脚本
echo "移动脚本文件..."
[ -f test-mode-switcher.sh ] && mv test-mode-switcher.sh scripts/
[ -f test-platform-autofill.sh ] && mv test-platform-autofill.sh scripts/

# 移动测试文件
echo "移动测试文件..."
[ -f test-bilibili-api.html ] && mv test-bilibili-api.html tests/manual/

echo "✅ 文档整理完成！"
echo ""
echo "📊 新的文档结构："
echo "docs/"
echo "├── getting-started/      # 快速开始"
echo "├── features/             # 功能文档"
echo "├── troubleshooting/      # 故障排除"
echo "├── guides/               # 指南"
echo "└── project/              # 项目文档"
echo ""
echo "scripts/                  # 脚本"
echo "tests/manual/             # 手动测试"
