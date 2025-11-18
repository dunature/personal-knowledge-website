#!/bin/bash

# 文档整理脚本
# 将项目根目录的开发文档整理到 docs 目录，并按功能分类

set -e

echo "🚀 开始整理项目文档..."

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 创建必要的目录结构
echo -e "${BLUE}📁 创建目录结构...${NC}"
mkdir -p docs/features/gist-integration
mkdir -p docs/features/mode-switcher
mkdir -p docs/features/platform-autofill
mkdir -p docs/features/ui-components
mkdir -p docs/features/youtube
mkdir -p docs/features/sync
mkdir -p docs/features/bidirectional-sync
mkdir -p docs/troubleshooting/bilibili-issues
mkdir -p docs/troubleshooting/category-issues
mkdir -p docs/development
mkdir -p docs/testing
mkdir -p docs/user-guides
mkdir -p docs/project
mkdir -p docs/getting-started
mkdir -p docs/guides
mkdir -p docs/archive/development-process

# ============================================
# Gist 集成相关文档
# ============================================
echo -e "${BLUE}📦 整理 Gist 集成文档...${NC}"

# 移动到 features/gist-integration
[ -f "GIST_OWNERSHIP_TEST_GUIDE.md" ] && mv GIST_OWNERSHIP_TEST_GUIDE.md docs/features/gist-integration/
[ -f "GIST_TEST_ACCESS.md" ] && mv GIST_TEST_ACCESS.md docs/features/gist-integration/
[ -f "OWNERSHIP_VERIFICATION_UI.md" ] && mv OWNERSHIP_VERIFICATION_UI.md docs/features/gist-integration/

# 移动到 archive (开发过程文档)
[ -f "DATA_IMPORT_FIX.md" ] && mv DATA_IMPORT_FIX.md docs/archive/development-process/
[ -f "DATA_IMPORT_EXPORT_MODAL.md" ] && mv DATA_IMPORT_EXPORT_MODAL.md docs/archive/development-process/

# ============================================
# 模式切换相关文档
# ============================================
echo -e "${BLUE}🔄 整理模式切换文档...${NC}"

[ -f "MODE_SWITCHER_INTEGRATION.md" ] && mv MODE_SWITCHER_INTEGRATION.md docs/features/mode-switcher/
[ -f "MODE_SWITCHER_TEST_GUIDE.md" ] && mv MODE_SWITCHER_TEST_GUIDE.md docs/features/mode-switcher/
[ -f "MODE_INDICATOR_COLOR_FIX.md" ] && mv MODE_INDICATOR_COLOR_FIX.md docs/features/mode-switcher/
[ -f "test-mode-switcher.sh" ] && mv test-mode-switcher.sh docs/features/mode-switcher/

# ============================================
# 平台自动填充相关文档
# ============================================
echo -e "${BLUE}🔧 整理平台自动填充文档...${NC}"

[ -f "PLATFORM_AUTO_FILL_GUIDE.md" ] && mv PLATFORM_AUTO_FILL_GUIDE.md docs/features/platform-autofill/
[ -f "PLATFORM_AUTOFILL_TEST.md" ] && mv PLATFORM_AUTOFILL_TEST.md docs/features/platform-autofill/
[ -f "PLATFORM_DEBUG_GUIDE.md" ] && mv PLATFORM_DEBUG_GUIDE.md docs/features/platform-autofill/
[ -f "AUTOFILL_FIX_SUMMARY.md" ] && mv AUTOFILL_FIX_SUMMARY.md docs/features/platform-autofill/
[ -f "BILIBILI_GITHUB_AUTOFILL_FIX.md" ] && mv BILIBILI_GITHUB_AUTOFILL_FIX.md docs/features/platform-autofill/
[ -f "test-platform-autofill.sh" ] && mv test-platform-autofill.sh docs/features/platform-autofill/

# ============================================
# Bilibili 相关问题文档
# ============================================
echo -e "${BLUE}🎬 整理 Bilibili 问题文档...${NC}"

[ -f "BILIBILI_IMAGE_PROXY_FIX.md" ] && mv BILIBILI_IMAGE_PROXY_FIX.md docs/troubleshooting/bilibili-issues/
[ -f "BILIBILI_THUMBNAIL_DEBUG.md" ] && mv BILIBILI_THUMBNAIL_DEBUG.md docs/troubleshooting/bilibili-issues/
[ -f "BILIBILI_THUMBNAIL_FIX.md" ] && mv BILIBILI_THUMBNAIL_FIX.md docs/troubleshooting/bilibili-issues/
[ -f "BILIBILI_ISSUE_RESOLVED.md" ] && mv BILIBILI_ISSUE_RESOLVED.md docs/troubleshooting/bilibili-issues/
[ -f "BILIBILI_404_FIX.md" ] && mv BILIBILI_404_FIX.md docs/troubleshooting/bilibili-issues/
[ -f "BILIBILI_TEST_VIDEOS.md" ] && mv BILIBILI_TEST_VIDEOS.md docs/troubleshooting/bilibili-issues/
[ -f "test-bilibili-api.html" ] && mv test-bilibili-api.html docs/troubleshooting/bilibili-issues/

# ============================================
# 分类相关问题文档
# ============================================
echo -e "${BLUE}📂 整理分类问题文档...${NC}"

[ -f "CATEGORY_FILTER_FIX.md" ] && mv CATEGORY_FILTER_FIX.md docs/troubleshooting/category-issues/
[ -f "CATEGORY_ISSUE_ANALYSIS.md" ] && mv CATEGORY_ISSUE_ANALYSIS.md docs/troubleshooting/category-issues/
[ -f "DEBUG_CATEGORY_ISSUE.md" ] && mv DEBUG_CATEGORY_ISSUE.md docs/troubleshooting/category-issues/
[ -f "CATEGORY_FIX_SUMMARY.md" ] && mv CATEGORY_FIX_SUMMARY.md docs/troubleshooting/category-issues/
[ -f "CATEGORY_FEATURE_WORKING.md" ] && mv CATEGORY_FEATURE_WORKING.md docs/troubleshooting/category-issues/
[ -f "test-category-fix.md" ] && mv test-category-fix.md docs/troubleshooting/category-issues/

# ============================================
# UI 组件相关文档
# ============================================
echo -e "${BLUE}🎨 整理 UI 组件文档...${NC}"

[ -f "CARD_LAYOUT_IMPROVEMENTS.md" ] && mv CARD_LAYOUT_IMPROVEMENTS.md docs/features/ui-components/
[ -f "VIDEO_CARD_IMPROVEMENTS.md" ] && mv VIDEO_CARD_IMPROVEMENTS.md docs/features/ui-components/
[ -f "RESOURCE_CARD_IMPROVEMENTS.md" ] && mv RESOURCE_CARD_IMPROVEMENTS.md docs/features/ui-components/
[ -f "TOAST_INTEGRATION.md" ] && mv TOAST_INTEGRATION.md docs/features/ui-components/
[ -f "PLACEHOLDER_IMAGE_FIX.md" ] && mv PLACEHOLDER_IMAGE_FIX.md docs/features/ui-components/

# ============================================
# YouTube 集成文档
# ============================================
echo -e "${BLUE}📺 整理 YouTube 文档...${NC}"

[ -f "YOUTUBE_INTEGRATION_TEST.md" ] && mv YOUTUBE_INTEGRATION_TEST.md docs/features/youtube/
[ -f "YOUTUBE_THUMBNAIL_GUIDE.md" ] && mv YOUTUBE_THUMBNAIL_GUIDE.md docs/features/youtube/
[ -f "YOUTUBE_QUICK_START.md" ] && mv YOUTUBE_QUICK_START.md docs/features/youtube/

# ============================================
# 同步功能相关文档
# ============================================
echo -e "${BLUE}🔄 整理同步功能文档...${NC}"

# 手动同步
[ -f "MANUAL_SYNC_MODE.md" ] && mv MANUAL_SYNC_MODE.md docs/features/sync/
[ -f "MANUAL_SYNC_HOMEPAGE_INTEGRATION.md" ] && mv MANUAL_SYNC_HOMEPAGE_INTEGRATION.md docs/features/sync/
[ -f "MANUAL_SYNC_QUICK_TEST.md" ] && mv MANUAL_SYNC_QUICK_TEST.md docs/features/sync/
[ -f "MANUAL_SYNC_DEBUG.md" ] && mv MANUAL_SYNC_DEBUG.md docs/archive/development-process/
[ -f "MANUAL_SYNC_TROUBLESHOOTING.md" ] && mv MANUAL_SYNC_TROUBLESHOOTING.md docs/features/sync/

# 自动同步
[ -f "AUTO_SYNC_DEBUG_GUIDE.md" ] && mv AUTO_SYNC_DEBUG_GUIDE.md docs/archive/development-process/
[ -f "AUTO_SYNC_FINAL_FIX.md" ] && mv AUTO_SYNC_FINAL_FIX.md docs/archive/development-process/
[ -f "MODE_SWITCH_AUTO_SYNC_FIX.md" ] && mv MODE_SWITCH_AUTO_SYNC_FIX.md docs/archive/development-process/

# 同步模式
[ -f "SYNC_MODE_TEST_GUIDE.md" ] && mv SYNC_MODE_TEST_GUIDE.md docs/features/sync/
[ -f "SYNC_MODE_SUMMARY.md" ] && mv SYNC_MODE_SUMMARY.md docs/features/sync/
[ -f "SYNC_STRATEGY.md" ] && mv SYNC_STRATEGY.md docs/features/sync/
[ -f "SYNC_IMPLEMENTATION_COMPLETE.md" ] && mv SYNC_IMPLEMENTATION_COMPLETE.md docs/features/sync/

# 同步反馈
[ -f "SYNC_MODAL_FEEDBACK.md" ] && mv SYNC_MODAL_FEEDBACK.md docs/features/sync/
[ -f "SYNC_FEEDBACK_ENHANCEMENT.md" ] && mv SYNC_FEEDBACK_ENHANCEMENT.md docs/features/sync/
[ -f "SYNC_FEEDBACK_QUICK_REF.md" ] && mv SYNC_FEEDBACK_QUICK_REF.md docs/features/sync/
[ -f "SYNC_BUTTONS_SUMMARY.md" ] && mv SYNC_BUTTONS_SUMMARY.md docs/features/sync/
[ -f "SYNC_BUTTONS_SPLIT.md" ] && mv SYNC_BUTTONS_SPLIT.md docs/features/sync/
[ -f "SYNC_BUTTONS_TEST_GUIDE.md" ] && mv SYNC_BUTTONS_TEST_GUIDE.md docs/features/sync/

# ============================================
# 双向同步相关文档
# ============================================
echo -e "${BLUE}↔️  整理双向同步文档...${NC}"

[ -f "BIDIRECTIONAL_SYNC_COMPLETE.md" ] && mv BIDIRECTIONAL_SYNC_COMPLETE.md docs/features/bidirectional-sync/
[ -f "BIDIRECTIONAL_SYNC_IMPLEMENTATION.md" ] && mv BIDIRECTIONAL_SYNC_IMPLEMENTATION.md docs/features/bidirectional-sync/
[ -f "BIDIRECTIONAL_SYNC_TEST_GUIDE.md" ] && mv BIDIRECTIONAL_SYNC_TEST_GUIDE.md docs/features/bidirectional-sync/
[ -f "BIDIRECTIONAL_SYNC_QUICK_TEST.md" ] && mv BIDIRECTIONAL_SYNC_QUICK_TEST.md docs/features/bidirectional-sync/
[ -f "BIDIRECTIONAL_SYNC_INTEGRATION_TEST.md" ] && mv BIDIRECTIONAL_SYNC_INTEGRATION_TEST.md docs/features/bidirectional-sync/
[ -f "BIDIRECTIONAL_SYNC_DIAGNOSIS.md" ] && mv BIDIRECTIONAL_SYNC_DIAGNOSIS.md docs/archive/development-process/

# 数据对比
[ -f "DATA_COMPARISON_VIEW_INTEGRATION.md" ] && mv DATA_COMPARISON_VIEW_INTEGRATION.md docs/features/bidirectional-sync/
[ -f "DATA_COMPARISON_VIEW_SUMMARY.md" ] && mv DATA_COMPARISON_VIEW_SUMMARY.md docs/features/bidirectional-sync/
[ -f "DATA_COMPARISON_VIEW_VERIFICATION.md" ] && mv DATA_COMPARISON_VIEW_VERIFICATION.md docs/features/bidirectional-sync/
[ -f "DATA_COMPARISON_VIEW_TEST.md" ] && mv DATA_COMPARISON_VIEW_TEST.md docs/features/bidirectional-sync/
[ -f "DATA_COMPARISON_DIALOG_VERIFICATION.md" ] && mv DATA_COMPARISON_DIALOG_VERIFICATION.md docs/features/bidirectional-sync/
[ -f "QUICK_REFERENCE_DATA_COMPARISON.md" ] && mv QUICK_REFERENCE_DATA_COMPARISON.md docs/features/bidirectional-sync/
[ -f "QUICK_REFERENCE_SYNC_BUTTONS.md" ] && mv QUICK_REFERENCE_SYNC_BUTTONS.md docs/features/bidirectional-sync/

# 已同步通知
[ -f "SYNC_ALREADY_SYNCED_TEST_GUIDE.md" ] && mv SYNC_ALREADY_SYNCED_TEST_GUIDE.md docs/features/bidirectional-sync/

# ============================================
# 测试相关文档
# ============================================
echo -e "${BLUE}🧪 整理测试文档...${NC}"

[ -f "TEST_GUIDE.md" ] && mv TEST_GUIDE.md docs/testing/
[ -f "TEST_CHECKLIST.md" ] && mv TEST_CHECKLIST.md docs/testing/
[ -f "QUICK_TEST_GUIDE.md" ] && mv QUICK_TEST_GUIDE.md docs/testing/

# ============================================
# 项目文档
# ============================================
echo -e "${BLUE}📋 整理项目文档...${NC}"

[ -f "PROJECT_STATUS.md" ] && mv PROJECT_STATUS.md docs/project/
[ -f "PROJECT_SUMMARY.md" ] && mv PROJECT_SUMMARY.md docs/project/
[ -f "FINAL_SUMMARY.md" ] && mv FINAL_SUMMARY.md docs/project/
[ -f "FILE_STRUCTURE.md" ] && mv FILE_STRUCTURE.md docs/project/

# ============================================
# 开发指南
# ============================================
echo -e "${BLUE}📖 整理开发指南...${NC}"

[ -f "DEVELOPMENT_QUICKSTART.md" ] && mv DEVELOPMENT_QUICKSTART.md docs/getting-started/
[ -f "COMMIT_GUIDE.md" ] && mv COMMIT_GUIDE.md docs/development/
[ -f "PERFORMANCE_OPTIMIZATION.md" ] && mv PERFORMANCE_OPTIMIZATION.md docs/guides/
[ -f "ACCESSIBILITY_GUIDE.md" ] && mv ACCESSIBILITY_GUIDE.md docs/guides/

# ============================================
# 开发过程文档（归档）
# ============================================
echo -e "${BLUE}📦 归档开发过程文档...${NC}"

[ -f "PROJECT_REORGANIZATION_SUMMARY.md" ] && mv PROJECT_REORGANIZATION_SUMMARY.md docs/archive/development-process/
[ -f "QUESTION_CLICK_FIX.md" ] && mv QUESTION_CLICK_FIX.md docs/archive/development-process/
[ -f "DEBUG_QA_CLICK.md" ] && mv DEBUG_QA_CLICK.md docs/archive/development-process/

# ============================================
# 清理测试数据文件
# ============================================
echo -e "${BLUE}🧹 清理测试数据文件...${NC}"

[ -f "test-data-valid-images.json" ] && mv test-data-valid-images.json docs/archive/development-process/

echo -e "${GREEN}✅ 文档整理完成！${NC}"
echo ""
echo -e "${YELLOW}📝 下一步：${NC}"
echo "1. 查看 docs/ 目录确认文档已正确分类"
echo "2. 更新 .gitignore 排除开发过程文档"
echo "3. 提交更改到仓库"
echo ""
echo -e "${BLUE}💡 提示：${NC}"
echo "- 开发过程文档已移至 docs/archive/development-process/"
echo "- 这些文档不会被推送到仓库（通过 .gitignore 排除）"
echo "- 功能文档和用户指南保留在 docs/ 相应目录中"
