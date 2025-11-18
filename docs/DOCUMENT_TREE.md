# 📁 文档目录树

本文档提供项目文档的完整目录树视图。

## 📊 统计信息

- **总文档数**: 152 个 Markdown 文件
- **一级目录**: 11 个
- **功能模块**: 7 个
- **归档文档**: 11 个（不推送到仓库）

## 🌳 完整目录树

```
docs/
│
├── 📄 README.md                          # 文档中心首页
├── 📄 INDEX.md                           # 详细文档索引
├── 📄 QUICK_REFERENCE.md                 # 快速参考指南
├── 📄 DOCUMENTATION_ORGANIZATION.md      # 文档组织说明
├── 📄 DOCUMENT_TREE.md                   # 本文件
│
├── 📄 GIST_QUICK_START.md               # Gist 快速开始
├── 📄 GIST_IMPLEMENTATION_STATUS.md     # Gist 实现状态
├── 📄 GIST_IMPLEMENTATION_SUMMARY.md    # Gist 实现总结
├── 📄 GIST_FEATURE_COMPLETE.md          # Gist 功能完成
├── 📄 HOMEPAGE_INTEGRATION.md           # 主页集成
├── 📄 INITIAL_SYNC_GUIDE.md             # 初始同步指南
├── 📄 INITIAL_SYNC_IMPLEMENTATION.md    # 初始同步实现
├── 📄 SETTINGS_PAGE_TEST.md             # 设置页面测试
├── 📄 DATA_STORAGE_FAQ.md               # 数据存储 FAQ
├── 📄 URL_GIST_LOADING.md               # URL Gist 加载
├── 📄 OPTIMIZATION_CHECKLIST.md         # 优化清单
├── 📄 DEPLOYMENT_READY.md               # 部署就绪
├── 📄 FILE_ORGANIZATION.md              # 文件组织
├── 📄 DOCUMENTATION_REORGANIZATION.md   # 文档重组
├── 📄 IMPORTANT_NOTES.md                # 重要说明
│
├── 📁 getting-started/                   # 快速开始
│   └── 📄 DEVELOPMENT_QUICKSTART.md     # 开发快速入门
│
├── 📁 features/                          # 功能文档
│   │
│   ├── 📁 gist-integration/             # Gist 集成（3个文件）
│   │   ├── 📄 GIST_OWNERSHIP_TEST_GUIDE.md
│   │   ├── 📄 GIST_TEST_ACCESS.md
│   │   └── 📄 OWNERSHIP_VERIFICATION_UI.md
│   │
│   ├── 📁 mode-switcher/                # 模式切换（4个文件）
│   │   ├── 📄 MODE_SWITCHER_INTEGRATION.md
│   │   ├── 📄 MODE_SWITCHER_TEST_GUIDE.md
│   │   ├── 📄 MODE_INDICATOR_COLOR_FIX.md
│   │   └── 🔧 test-mode-switcher.sh
│   │
│   ├── 📁 platform-autofill/            # 平台自动填充（7个文件）
│   │   ├── 📄 README.md
│   │   ├── 📄 PLATFORM_AUTO_FILL_GUIDE.md
│   │   ├── 📄 PLATFORM_AUTOFILL_TEST.md
│   │   ├── 📄 PLATFORM_DEBUG_GUIDE.md
│   │   ├── 📄 AUTOFILL_FIX_SUMMARY.md
│   │   ├── 📄 BILIBILI_GITHUB_AUTOFILL_FIX.md
│   │   └── 🔧 test-platform-autofill.sh
│   │
│   ├── 📁 sync/                         # 同步功能（14个文件）
│   │   ├── 📄 SYNC_STRATEGY.md
│   │   ├── 📄 SYNC_MODE_SUMMARY.md
│   │   ├── 📄 SYNC_MODE_TEST_GUIDE.md
│   │   ├── 📄 MANUAL_SYNC_MODE.md
│   │   ├── 📄 MANUAL_SYNC_HOMEPAGE_INTEGRATION.md
│   │   ├── 📄 MANUAL_SYNC_QUICK_TEST.md
│   │   ├── 📄 MANUAL_SYNC_TROUBLESHOOTING.md
│   │   ├── 📄 SYNC_IMPLEMENTATION_COMPLETE.md
│   │   ├── 📄 SYNC_BUTTONS_SUMMARY.md
│   │   ├── 📄 SYNC_BUTTONS_SPLIT.md
│   │   ├── 📄 SYNC_BUTTONS_TEST_GUIDE.md
│   │   ├── 📄 SYNC_MODAL_FEEDBACK.md
│   │   ├── 📄 SYNC_FEEDBACK_ENHANCEMENT.md
│   │   └── 📄 SYNC_FEEDBACK_QUICK_REF.md
│   │
│   ├── 📁 bidirectional-sync/           # 双向同步（13个文件）
│   │   ├── 📄 BIDIRECTIONAL_SYNC_COMPLETE.md
│   │   ├── 📄 BIDIRECTIONAL_SYNC_IMPLEMENTATION.md
│   │   ├── 📄 BIDIRECTIONAL_SYNC_TEST_GUIDE.md
│   │   ├── 📄 BIDIRECTIONAL_SYNC_QUICK_TEST.md
│   │   ├── 📄 BIDIRECTIONAL_SYNC_INTEGRATION_TEST.md
│   │   ├── 📄 DATA_COMPARISON_VIEW_INTEGRATION.md
│   │   ├── 📄 DATA_COMPARISON_VIEW_SUMMARY.md
│   │   ├── 📄 DATA_COMPARISON_VIEW_TEST.md
│   │   ├── 📄 DATA_COMPARISON_VIEW_VERIFICATION.md
│   │   ├── 📄 DATA_COMPARISON_DIALOG_VERIFICATION.md
│   │   ├── 📄 QUICK_REFERENCE_DATA_COMPARISON.md
│   │   ├── 📄 QUICK_REFERENCE_SYNC_BUTTONS.md
│   │   └── 📄 SYNC_ALREADY_SYNCED_TEST_GUIDE.md
│   │
│   ├── 📁 ui-components/                # UI 组件（5个文件）
│   │   ├── 📄 CARD_LAYOUT_IMPROVEMENTS.md
│   │   ├── 📄 RESOURCE_CARD_IMPROVEMENTS.md
│   │   ├── 📄 VIDEO_CARD_IMPROVEMENTS.md
│   │   ├── 📄 TOAST_INTEGRATION.md
│   │   └── 📄 PLACEHOLDER_IMAGE_FIX.md
│   │
│   └── 📁 youtube/                      # YouTube 集成（3个文件）
│       ├── 📄 YOUTUBE_QUICK_START.md
│       ├── 📄 YOUTUBE_THUMBNAIL_GUIDE.md
│       └── 📄 YOUTUBE_INTEGRATION_TEST.md
│
├── 📁 development/                       # 开发文档（13个文件）
│   ├── 📄 GIST_INTEGRATION.md
│   ├── 📄 GIST_INTEGRATION_PROGRESS.md
│   ├── 📄 TESTING_GUIDE.md
│   ├── 📄 ERROR_HANDLING.md
│   ├── 📄 OFFLINE_SUPPORT.md
│   ├── 📄 INCREMENTAL_SYNC.md
│   ├── 📄 COMMIT_GUIDE.md
│   ├── 📄 COMMIT_MESSAGE.md
│   ├── 📄 PUSH_SUMMARY.md
│   ├── 📄 CRUD_COMPLETE.md
│   ├── 📄 DOCUMENTATION_SUMMARY.md
│   └── 📄 README_UPDATE_SUMMARY.md
│
├── 📁 troubleshooting/                   # 故障排除
│   │
│   ├── 📁 bilibili-issues/              # Bilibili 问题（7个文件）
│   │   ├── 📄 README.md
│   │   ├── 📄 BILIBILI_IMAGE_PROXY_FIX.md
│   │   ├── 📄 BILIBILI_THUMBNAIL_FIX.md
│   │   ├── 📄 BILIBILI_THUMBNAIL_DEBUG.md
│   │   ├── 📄 BILIBILI_404_FIX.md
│   │   ├── 📄 BILIBILI_ISSUE_RESOLVED.md
│   │   ├── 📄 BILIBILI_TEST_VIDEOS.md
│   │   └── 🌐 test-bilibili-api.html
│   │
│   └── 📁 category-issues/              # 分类问题（5个文件）
│       ├── 📄 CATEGORY_FILTER_FIX.md
│       ├── 📄 CATEGORY_ISSUE_ANALYSIS.md
│       ├── 📄 CATEGORY_FIX_SUMMARY.md
│       ├── 📄 CATEGORY_FEATURE_WORKING.md
│       └── 📄 test-category-fix.md
│
├── 📁 testing/                           # 测试文档（5个文件）
│   ├── 📄 TEST_GUIDE.md
│   ├── 📄 TEST_CHECKLIST.md
│   ├── 📄 QUICK_TEST_GUIDE.md
│   ├── 📄 E2E_TEST_SCENARIOS.md
│   └── 📄 PERFORMANCE_TEST.md
│
├── 📁 user-guides/                       # 用户指南（9个文件）
│   ├── 📄 GIST_SETUP_GUIDE.md
│   ├── 📄 USER_GUIDE_CN.md
│   ├── 📄 RESOURCE_COVER_GUIDE.md
│   ├── 📄 QUICK_TEST_CHECKLIST.md
│   ├── 📄 QUICK_TEST_CRUD.md
│   ├── 📄 QUICK_TEST_SUB_QUESTIONS.md
│   ├── 📄 ERROR_HANDLING_TEST_GUIDE.md
│   ├── 📄 ERROR_HANDLING_TEST_CHECKLIST.md
│   └── 📄 TESTING_GUIDE.md
│
├── 📁 project/                           # 项目文档（4个文件）
│   ├── 📄 PROJECT_STATUS.md
│   ├── 📄 PROJECT_SUMMARY.md
│   ├── 📄 FINAL_SUMMARY.md
│   └── 📄 FILE_STRUCTURE.md
│
├── 📁 guides/                            # 指南（2个文件）
│   ├── 📄 PERFORMANCE_OPTIMIZATION.md
│   └── 📄 ACCESSIBILITY_GUIDE.md
│
├── 📁 deployment/                        # 部署文档（4个文件）
│   ├── 📄 DEPLOYMENT.md
│   ├── 📄 QUICK_DEPLOY.md
│   ├── 📄 GITHUB_SETUP.md
│   └── 📄 READY_TO_DEPLOY.md
│
├── 📁 fixes/                             # 修复记录（7个文件）
│   ├── 📄 ADD_QUESTION_BUTTON_FIX.md
│   ├── 📄 DROPDOWN_FINAL_SOLUTION.md
│   ├── 📄 DROPDOWN_FIX_SIMPLE.md
│   ├── 📄 DROPDOWN_SOLUTIONS.md
│   ├── 📄 DROPDOWN_ULTIMATE_FIX.md
│   ├── 📄 IMAGE_DISPLAY_FIX.md
│   └── 📄 SAMPLE_DATA_FIX.md
│
└── 📁 archive/                           # 归档文档
    │
    ├── 📁 (历史文档 - 19个文件)
    │   ├── 📄 COMPONENT_TEST.md
    │   ├── 📄 FINAL_SUMMARY.md
    │   ├── 📄 FIXED.md
    │   ├── 📄 FIXED_ROUND2.md
    │   └── ... (其他历史文档)
    │
    └── 📁 development-process/           # 开发过程文档（11个文件）
        ├── 📄 AUTO_SYNC_DEBUG_GUIDE.md   # ⚠️ 不推送到仓库
        ├── 📄 AUTO_SYNC_FINAL_FIX.md
        ├── 📄 BIDIRECTIONAL_SYNC_DIAGNOSIS.md
        ├── 📄 DATA_IMPORT_EXPORT_MODAL.md
        ├── 📄 DATA_IMPORT_FIX.md
        ├── 📄 DEBUG_QA_CLICK.md
        ├── 📄 MANUAL_SYNC_DEBUG.md
        ├── 📄 MODE_SWITCH_AUTO_SYNC_FIX.md
        ├── 📄 PROJECT_REORGANIZATION_SUMMARY.md
        ├── 📄 QUESTION_CLICK_FIX.md
        └── 📄 test-data-valid-images.json
```

## 📊 按类型统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 功能文档 | 49 | features/ 目录下的文档 |
| 开发文档 | 13 | development/ 目录下的文档 |
| 故障排除 | 12 | troubleshooting/ 目录下的文档 |
| 测试文档 | 5 | testing/ 目录下的文档 |
| 用户指南 | 9 | user-guides/ 目录下的文档 |
| 项目文档 | 4 | project/ 目录下的文档 |
| 部署文档 | 4 | deployment/ 目录下的文档 |
| 修复记录 | 7 | fixes/ 目录下的文档 |
| 归档文档 | 30 | archive/ 目录下的文档 |
| 根目录文档 | 19 | docs/ 根目录的文档 |

## 🔍 快速查找

### 按功能查找

| 功能 | 目录 | 文件数 |
|------|------|--------|
| Gist 集成 | `features/gist-integration/` | 3 |
| 模式切换 | `features/mode-switcher/` | 4 |
| 平台自动填充 | `features/platform-autofill/` | 7 |
| 同步功能 | `features/sync/` | 14 |
| 双向同步 | `features/bidirectional-sync/` | 13 |
| UI 组件 | `features/ui-components/` | 5 |
| YouTube 集成 | `features/youtube/` | 3 |

### 按问题类型查找

| 问题类型 | 目录 | 文件数 |
|---------|------|--------|
| Bilibili 问题 | `troubleshooting/bilibili-issues/` | 7 |
| 分类问题 | `troubleshooting/category-issues/` | 5 |

## 🔒 特殊说明

### 归档文档
- **位置**: `docs/archive/development-process/`
- **数量**: 11 个文件
- **状态**: ⚠️ 通过 `.gitignore` 排除，不推送到仓库
- **用途**: 本地保留开发过程中的调试文档供参考

### 测试脚本
- `test-mode-switcher.sh` - 模式切换测试脚本
- `test-platform-autofill.sh` - 平台自动填充测试脚本
- `test-bilibili-api.html` - Bilibili API 测试页面

## 📝 使用建议

1. **查找文档**: 使用本文档树快速定位
2. **浏览分类**: 按功能模块浏览 `features/` 目录
3. **解决问题**: 查看 `troubleshooting/` 目录
4. **学习使用**: 查看 `user-guides/` 目录
5. **参与开发**: 查看 `development/` 目录

## 🔗 相关链接

- [文档中心](README.md)
- [详细索引](INDEX.md)
- [快速参考](QUICK_REFERENCE.md)
- [组织说明](DOCUMENTATION_ORGANIZATION.md)

---

**生成时间**: 2024-11-18  
**文档总数**: 152 个 Markdown 文件  
**最后更新**: 自动生成
