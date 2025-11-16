# 📚 文档中心

欢迎来到个人知识管理系统的文档中心！这里包含了项目的所有文档。

## 🚀 快速导航

### 新手入门
- [快速开始](getting-started/QUICK_START.md) - 5分钟快速上手
- [项目架构](getting-started/ARCHITECTURE.md) - 了解项目结构
- [Gist 设置指南](user-guides/GIST_SETUP_GUIDE.md) - 配置云端同步

### 功能文档

#### 平台自动填充
自动从各平台获取资源信息
- [功能概览](features/platform-autofill/README.md)
- [使用指南](features/platform-autofill/PLATFORM_AUTO_FILL_GUIDE.md)
- [测试指南](features/platform-autofill/PLATFORM_AUTOFILL_TEST.md)

#### Gist 集成
GitHub Gist 云端同步功能
- [所有权验证](features/gist-integration/GIST_OWNERSHIP_TEST_GUIDE.md)
- [访问测试](features/gist-integration/GIST_TEST_ACCESS.md)

#### 模式切换
拥有者模式和访客模式
- [集成指南](features/mode-switcher/MODE_SWITCHER_INTEGRATION.md)
- [测试指南](features/mode-switcher/MODE_SWITCHER_TEST_GUIDE.md)

#### UI 组件
界面组件和样式
- [卡片布局](features/ui-components/CARD_LAYOUT_IMPROVEMENTS.md)
- [资源卡片](features/ui-components/RESOURCE_CARD_IMPROVEMENTS.md)
- [视频卡片](features/ui-components/VIDEO_CARD_IMPROVEMENTS.md)
- [Toast 通知](features/ui-components/TOAST_INTEGRATION.md)

#### YouTube 集成
- [快速开始](features/youtube/YOUTUBE_QUICK_START.md)
- [缩略图指南](features/youtube/YOUTUBE_THUMBNAIL_GUIDE.md)
- [集成测试](features/youtube/YOUTUBE_INTEGRATION_TEST.md)

### 开发文档
- [Gist 集成开发](development/GIST_INTEGRATION.md)
- [测试指南](development/TESTING_GUIDE.md)
- [错误处理](development/ERROR_HANDLING.md)
- [离线支持](development/OFFLINE_SUPPORT.md)
- [增量同步](development/INCREMENTAL_SYNC.md)

### 故障排除

#### Bilibili 相关问题
- [问题概览](troubleshooting/bilibili-issues/README.md) - **推荐先看这个**
- [图片代理修复](troubleshooting/bilibili-issues/BILIBILI_IMAGE_PROXY_FIX.md) - 封面防盗链解决方案
- [404 错误修复](troubleshooting/bilibili-issues/BILIBILI_404_FIX.md)
- [问题已解决](troubleshooting/bilibili-issues/BILIBILI_ISSUE_RESOLVED.md)

#### 分类相关问题
- [分类筛选修复](troubleshooting/category-issues/CATEGORY_FILTER_FIX.md)
- [问题分析](troubleshooting/category-issues/CATEGORY_ISSUE_ANALYSIS.md)
- [修复总结](troubleshooting/category-issues/CATEGORY_FIX_SUMMARY.md)

### 指南
- [性能优化](guides/PERFORMANCE_OPTIMIZATION.md)
- [无障碍指南](guides/ACCESSIBILITY_GUIDE.md)
- [测试指南](guides/TEST_GUIDE.md)

### 测试文档
- [E2E 测试场景](testing/E2E_TEST_SCENARIOS.md)
- [性能测试](testing/PERFORMANCE_TEST.md)

### 项目文档
- [项目状态](project/PROJECT_STATUS.md)
- [项目总结](project/PROJECT_SUMMARY.md)
- [最终总结](project/FINAL_SUMMARY.md)

## 🔗 快速链接

- [项目主页](../README.md)
- [贡献指南](../CONTRIBUTING.md)
- [更新日志](../CHANGELOG.md)

## 📖 文档结构

```
docs/
├── README.md                    # 本文件
├── getting-started/             # 快速开始
│   ├── QUICK_START.md
│   └── ARCHITECTURE.md
├── features/                    # 功能文档
│   ├── platform-autofill/      # 平台自动填充
│   ├── gist-integration/       # Gist 集成
│   ├── mode-switcher/          # 模式切换
│   ├── ui-components/          # UI 组件
│   └── youtube/                # YouTube 集成
├── development/                 # 开发文档
├── troubleshooting/             # 故障排除
│   ├── bilibili-issues/        # Bilibili 问题
│   └── category-issues/        # 分类问题
├── guides/                      # 指南
├── testing/                     # 测试文档
├── user-guides/                 # 用户指南
└── project/                     # 项目文档
```

## 💡 如何使用文档

1. **新用户**：从[快速开始](getting-started/QUICK_START.md)开始
2. **开发者**：查看[开发文档](development/)
3. **遇到问题**：查看[故障排除](troubleshooting/)
4. **了解功能**：查看[功能文档](features/)

## 🤝 贡献文档

发现文档问题或想要改进？欢迎提交 PR！

详见：[贡献指南](../CONTRIBUTING.md)
