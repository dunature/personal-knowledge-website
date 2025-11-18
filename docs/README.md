# 📚 文档中心

欢迎来到个人知识管理系统的文档中心！这里包含了项目的所有文档。

## 🚀 快速导航

### 新手入门
- [快速开始](getting-started/DEVELOPMENT_QUICKSTART.md) - 5分钟快速上手
- [Gist 设置指南](user-guides/GIST_SETUP_GUIDE.md) - 配置云端同步

### 功能文档

#### Gist 集成
GitHub Gist 云端同步功能
- [快速开始](GIST_QUICK_START.md)
- [实现状态](GIST_IMPLEMENTATION_STATUS.md)
- [功能完成清单](GIST_FEATURE_COMPLETE.md)
- [实现总结](GIST_IMPLEMENTATION_SUMMARY.md)
- [所有权验证](features/gist-integration/GIST_OWNERSHIP_TEST_GUIDE.md)
- [访问测试](features/gist-integration/GIST_TEST_ACCESS.md)
- [所有权验证 UI](features/gist-integration/OWNERSHIP_VERIFICATION_UI.md)

#### 模式切换
拥有者模式和访客模式
- [集成指南](features/mode-switcher/MODE_SWITCHER_INTEGRATION.md)
- [测试指南](features/mode-switcher/MODE_SWITCHER_TEST_GUIDE.md)
- [指示器颜色修复](features/mode-switcher/MODE_INDICATOR_COLOR_FIX.md)

#### 平台自动填充
自动从各平台获取资源信息
- [使用指南](features/platform-autofill/PLATFORM_AUTO_FILL_GUIDE.md)
- [测试指南](features/platform-autofill/PLATFORM_AUTOFILL_TEST.md)
- [调试指南](features/platform-autofill/PLATFORM_DEBUG_GUIDE.md)
- [修复总结](features/platform-autofill/AUTOFILL_FIX_SUMMARY.md)

#### 同步功能
数据同步相关功能
- [同步策略](features/sync/SYNC_STRATEGY.md)
- [同步模式总结](features/sync/SYNC_MODE_SUMMARY.md)
- [手动同步模式](features/sync/MANUAL_SYNC_MODE.md)
- [同步实现完成](features/sync/SYNC_IMPLEMENTATION_COMPLETE.md)
- [同步按钮总结](features/sync/SYNC_BUTTONS_SUMMARY.md)
- [同步反馈增强](features/sync/SYNC_FEEDBACK_ENHANCEMENT.md)

#### 双向同步
双向数据同步功能
- [实现完成](features/bidirectional-sync/BIDIRECTIONAL_SYNC_COMPLETE.md)
- [实现指南](features/bidirectional-sync/BIDIRECTIONAL_SYNC_IMPLEMENTATION.md)
- [测试指南](features/bidirectional-sync/BIDIRECTIONAL_SYNC_TEST_GUIDE.md)
- [快速测试](features/bidirectional-sync/BIDIRECTIONAL_SYNC_QUICK_TEST.md)
- [数据对比视图](features/bidirectional-sync/DATA_COMPARISON_VIEW_SUMMARY.md)

#### UI 组件
界面组件和样式
- [卡片布局改进](features/ui-components/CARD_LAYOUT_IMPROVEMENTS.md)
- [资源卡片改进](features/ui-components/RESOURCE_CARD_IMPROVEMENTS.md)
- [视频卡片改进](features/ui-components/VIDEO_CARD_IMPROVEMENTS.md)
- [Toast 通知集成](features/ui-components/TOAST_INTEGRATION.md)
- [占位图修复](features/ui-components/PLACEHOLDER_IMAGE_FIX.md)

#### YouTube 集成
- [快速开始](features/youtube/YOUTUBE_QUICK_START.md)
- [缩略图指南](features/youtube/YOUTUBE_THUMBNAIL_GUIDE.md)
- [集成测试](features/youtube/YOUTUBE_INTEGRATION_TEST.md)

### 开发文档
- [Gist 集成开发](development/GIST_INTEGRATION.md)
- [Gist 集成进度](development/GIST_INTEGRATION_PROGRESS.md)
- [测试指南](development/TESTING_GUIDE.md)
- [错误处理](development/ERROR_HANDLING.md)
- [离线支持](development/OFFLINE_SUPPORT.md)
- [增量同步](development/INCREMENTAL_SYNC.md)
- [提交指南](development/COMMIT_GUIDE.md)
- [推送总结](development/PUSH_SUMMARY.md)

### 故障排除

#### Bilibili 相关问题
- [问题概览](troubleshooting/bilibili-issues/README.md) - **推荐先看这个**
- [图片代理修复](troubleshooting/bilibili-issues/BILIBILI_IMAGE_PROXY_FIX.md)
- [缩略图修复](troubleshooting/bilibili-issues/BILIBILI_THUMBNAIL_FIX.md)
- [404 错误修复](troubleshooting/bilibili-issues/BILIBILI_404_FIX.md)
- [问题已解决](troubleshooting/bilibili-issues/BILIBILI_ISSUE_RESOLVED.md)

#### 分类相关问题
- [分类筛选修复](troubleshooting/category-issues/CATEGORY_FILTER_FIX.md)
- [问题分析](troubleshooting/category-issues/CATEGORY_ISSUE_ANALYSIS.md)
- [修复总结](troubleshooting/category-issues/CATEGORY_FIX_SUMMARY.md)
- [功能正常](troubleshooting/category-issues/CATEGORY_FEATURE_WORKING.md)

### 指南
- [性能优化](guides/PERFORMANCE_OPTIMIZATION.md)
- [无障碍指南](guides/ACCESSIBILITY_GUIDE.md)

### 测试文档
- [测试指南](testing/TEST_GUIDE.md)
- [测试清单](testing/TEST_CHECKLIST.md)
- [快速测试指南](testing/QUICK_TEST_GUIDE.md)
- [E2E 测试场景](testing/E2E_TEST_SCENARIOS.md)
- [性能测试](testing/PERFORMANCE_TEST.md)

### 用户指南
- [Gist 设置指南](user-guides/GIST_SETUP_GUIDE.md)
- [资源封面指南](user-guides/RESOURCE_COVER_GUIDE.md)
- [快速测试清单](user-guides/QUICK_TEST_CHECKLIST.md)
- [错误处理测试指南](user-guides/ERROR_HANDLING_TEST_GUIDE.md)

### 项目文档
- [项目状态](project/PROJECT_STATUS.md)
- [项目总结](project/PROJECT_SUMMARY.md)
- [最终总结](project/FINAL_SUMMARY.md)
- [文件结构](project/FILE_STRUCTURE.md)

### 其他文档
- [主页集成](HOMEPAGE_INTEGRATION.md)
- [初始同步指南](INITIAL_SYNC_GUIDE.md)
- [初始同步实现](INITIAL_SYNC_IMPLEMENTATION.md)
- [设置页面测试](SETTINGS_PAGE_TEST.md)
- [数据存储 FAQ](DATA_STORAGE_FAQ.md)
- [URL Gist 加载](URL_GIST_LOADING.md)
- [优化清单](OPTIMIZATION_CHECKLIST.md)
- [部署就绪](DEPLOYMENT_READY.md)
- [文件组织](FILE_ORGANIZATION.md)
- [文档重组](DOCUMENTATION_REORGANIZATION.md)

## 🔗 快速链接

- [项目主页](../README.md)
- [贡献指南](../CONTRIBUTING.md)
- [更新日志](../CHANGELOG.md)

## 📖 文档结构

```
docs/
├── README.md                    # 本文件
├── INDEX.md                     # 详细索引
├── getting-started/             # 快速开始
├── features/                    # 功能文档
│   ├── gist-integration/       # Gist 集成
│   ├── mode-switcher/          # 模式切换
│   ├── platform-autofill/      # 平台自动填充
│   ├── sync/                   # 同步功能
│   ├── bidirectional-sync/     # 双向同步
│   ├── ui-components/          # UI 组件
│   └── youtube/                # YouTube 集成
├── development/                 # 开发文档
├── troubleshooting/             # 故障排除
│   ├── bilibili-issues/        # Bilibili 问题
│   └── category-issues/        # 分类问题
├── guides/                      # 指南
├── testing/                     # 测试文档
├── user-guides/                 # 用户指南
├── project/                     # 项目文档
├── deployment/                  # 部署文档
└── archive/                     # 归档文档
    └── development-process/    # 开发过程文档（不推送到仓库）
```

## 💡 如何使用文档

1. **新用户**：从[快速开始](getting-started/DEVELOPMENT_QUICKSTART.md)开始
2. **开发者**：查看[开发文档](development/)
3. **遇到问题**：查看[故障排除](troubleshooting/)
4. **了解功能**：查看[功能文档](features/)

## 🤝 贡献文档

发现文档问题或想要改进？欢迎提交 PR！

详见：[贡献指南](../CONTRIBUTING.md)

---

**最后更新**：2024-11-18
