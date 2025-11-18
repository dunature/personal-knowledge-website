#!/bin/bash

# 文档整理脚本
# 将根目录下的开发文档移动到 docs 目录，并按功能分类

echo "开始整理项目文档..."

# 创建文档目录结构
mkdir -p docs/development/fixes
mkdir -p docs/development/testing
mkdir -p docs/development/sync
mkdir -p docs/development/ui
mkdir -p docs/archive

# 移动同步相关文档
echo "整理同步功能文档..."
mv AUTO_SYNC_DEBUG_GUIDE.md docs/development/sync/ 2>/dev/null
mv AUTO_SYNC_FINAL_FIX.md docs/development/sync/ 2>/dev/null
mv MODE_SWITCH_AUTO_SYNC_FIX.md docs/development/sync/ 2>/dev/null
mv MANUAL_SYNC_DEBUG.md docs/development/sync/ 2>/dev/null
mv MANUAL_SYNC_HOMEPAGE_INTEGRATION.md docs/development/sync/ 2>/dev/null
mv MANUAL_SYNC_MODE.md docs/development/sync/ 2>/dev/null
mv MANUAL_SYNC_QUICK_TEST.md docs/development/sync/ 2>/dev/null
mv MANUAL_SYNC_TROUBLESHOOTING.md docs/development/sync/ 2>/dev/null
mv SYNC_ALREADY_SYNCED_TEST_GUIDE.md docs/development/testing/ 2>/dev/null
mv SYNC_BUTTONS_SPLIT.md docs/development/sync/ 2>/dev/null
mv SYNC_BUTTONS_SUMMARY.md docs/development/sync/ 2>/dev/null
mv SYNC_BUTTONS_TEST_GUIDE.md docs/development/testing/ 2>/dev/null
mv SYNC_FEEDBACK_ENHANCEMENT.md docs/development/sync/ 2>/dev/null
mv SYNC_FEEDBACK_QUICK_REF.md docs/development/sync/ 2>/dev/null
mv SYNC_IMPLEMENTATION_COMPLETE.md docs/development/sync/ 2>/dev/null
mv SYNC_MODAL_FEEDBACK.md docs/development/sync/ 2>/dev/null
mv SYNC_MODE_SUMMARY.md docs/development/sync/ 2>/dev/null
mv SYNC_MODE_TEST_GUIDE.md docs/development/testing/ 2>/dev/null
mv SYNC_STRATEGY.md docs/development/sync/ 2>/dev/null

# 移动双向同步相关文档
echo "整理双向同步文档..."
mv BIDIRECTIONAL_SYNC_COMPLETE.md docs/development/sync/ 2>/dev/null
mv BIDIRECTIONAL_SYNC_DIAGNOSIS.md docs/development/sync/ 2>/dev/null
mv BIDIRECTIONAL_SYNC_IMPLEMENTATION.md docs/development/sync/ 2>/dev/null
mv BIDIRECTIONAL_SYNC_INTEGRATION_TEST.md docs/development/testing/ 2>/dev/null
mv BIDIRECTIONAL_SYNC_QUICK_TEST.md docs/development/testing/ 2>/dev/null
mv BIDIRECTIONAL_SYNC_TEST_GUIDE.md docs/development/testing/ 2>/dev/null

# 移动数据对比相关文档
echo "整理数据对比文档..."
mv DATA_COMPARISON_DIALOG_VERIFICATION.md docs/development/testing/ 2>/dev/null
mv DATA_COMPARISON_VIEW_INTEGRATION.md docs/development/sync/ 2>/dev/null
mv DATA_COMPARISON_VIEW_SUMMARY.md docs/development/sync/ 2>/dev/null
mv DATA_COMPARISON_VIEW_TEST.md docs/development/testing/ 2>/dev/null
mv DATA_COMPARISON_VIEW_VERIFICATION.md docs/development/testing/ 2>/dev/null
mv DATA_IMPORT_EXPORT_MODAL.md docs/development/sync/ 2>/dev/null
mv DATA_IMPORT_FIX.md docs/development/fixes/ 2>/dev/null
mv QUICK_REFERENCE_DATA_COMPARISON.md docs/development/sync/ 2>/dev/null
mv QUICK_REFERENCE_SYNC_BUTTONS.md docs/development/sync/ 2>/dev/null

# 移动模式切换相关文档
echo "整理模式切换文档..."
mv MODE_INDICATOR_COLOR_FIX.md docs/development/fixes/ 2>/dev/null
mv MODE_SWITCHER_INTEGRATION.md docs/development/ 2>/dev/null
mv MODE_SWITCHER_TEST_GUIDE.md docs/development/testing/ 2>/dev/null

# 移动 UI 相关文档
echo "整理 UI 文档..."
mv CARD_LAYOUT_IMPROVEMENTS.md docs/development/ui/ 2>/dev/null
mv RESOURCE_CARD_IMPROVEMENTS.md docs/development/ui/ 2>/dev/null
mv VIDEO_CARD_IMPROVEMENTS.md docs/development/ui/ 2>/dev/null
mv TOAST_INTEGRATION.md docs/development/ui/ 2>/dev/null

# 移动分类和筛选相关文档
echo "整理分类筛选文档..."
mv CATEGORY_FEATURE_WORKING.md docs/development/fixes/ 2>/dev/null
mv CATEGORY_FILTER_FIX.md docs/development/fixes/ 2>/dev/null
mv CATEGORY_FIX_SUMMARY.md docs/development/fixes/ 2>/dev/null
mv CATEGORY_ISSUE_ANALYSIS.md docs/development/fixes/ 2>/dev/null
mv DEBUG_CATEGORY_ISSUE.md docs/development/fixes/ 2>/dev/null
mv test-category-fix.md docs/development/fixes/ 2>/dev/null

# 移动平台相关文档
echo "整理平台功能文档..."
mv AUTOFILL_FIX_SUMMARY.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_404_FIX.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_GITHUB_AUTOFILL_FIX.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_IMAGE_PROXY_FIX.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_ISSUE_RESOLVED.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_TEST_VIDEOS.md docs/development/testing/ 2>/dev/null
mv BILIBILI_THUMBNAIL_DEBUG.md docs/development/fixes/ 2>/dev/null
mv BILIBILI_THUMBNAIL_FIX.md docs/development/fixes/ 2>/dev/null
mv PLACEHOLDER_IMAGE_FIX.md docs/development/fixes/ 2>/dev/null
mv PLATFORM_AUTO_FILL_GUIDE.md docs/development/ 2>/dev/null
mv PLATFORM_AUTOFILL_TEST.md docs/development/testing/ 2>/dev/null
mv PLATFORM_DEBUG_GUIDE.md docs/development/ 2>/dev/null
mv YOUTUBE_INTEGRATION_TEST.md docs/development/testing/ 2>/dev/null
mv YOUTUBE_QUICK_START.md docs/development/ 2>/dev/null
mv YOUTUBE_THUMBNAIL_GUIDE.md docs/development/ 2>/dev/null

# 移动测试相关文档
echo "整理测试文档..."
mv GIST_OWNERSHIP_TEST_GUIDE.md docs/development/testing/ 2>/dev/null
mv GIST_TEST_ACCESS.md docs/development/testing/ 2>/dev/null
mv OWNERSHIP_VERIFICATION_UI.md docs/development/testing/ 2>/dev/null
mv QUICK_TEST_GUIDE.md docs/development/testing/ 2>/dev/null
mv TEST_CHECKLIST.md docs/development/testing/ 2>/dev/null
mv TEST_GUIDE.md docs/development/testing/ 2>/dev/null

# 移动问题修复文档
echo "整理问题修复文档..."
mv DEBUG_QA_CLICK.md docs/development/fixes/ 2>/dev/null
mv QUESTION_CLICK_FIX.md docs/development/fixes/ 2>/dev/null

# 移动项目文档到归档
echo "归档项目总结文档..."
mv FINAL_SUMMARY.md docs/archive/ 2>/dev/null
mv PROJECT_REORGANIZATION_SUMMARY.md docs/archive/ 2>/dev/null
mv PROJECT_STATUS.md docs/archive/ 2>/dev/null
mv PROJECT_SUMMARY.md docs/archive/ 2>/dev/null

# 移动开发指南
echo "整理开发指南..."
mv COMMIT_GUIDE.md docs/development/ 2>/dev/null
mv DEVELOPMENT_QUICKSTART.md docs/development/ 2>/dev/null
mv FILE_STRUCTURE.md docs/development/ 2>/dev/null
mv PERFORMANCE_OPTIMIZATION.md docs/development/ 2>/dev/null

echo "文档整理完成！"
echo ""
echo "文档结构："
echo "docs/"
echo "  ├── development/          # 开发文档"
echo "  │   ├── fixes/           # 问题修复记录"
echo "  │   ├── testing/         # 测试指南"
echo "  │   ├── sync/            # 同步功能文档"
echo "  │   └── ui/              # UI 相关文档"
echo "  ├── archive/             # 归档文档"
echo "  └── ..."
