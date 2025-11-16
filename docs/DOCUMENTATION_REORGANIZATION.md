# 文档重组计划

## 目标

将项目根目录的大量文档整理到合理的目录结构中，使项目更加清晰易维护。

## 新的文档结构

```
personal-knowledge-website/
├── README.md                          # 项目主文档
├── CHANGELOG.md                       # 变更日志
├── CONTRIBUTING.md                    # 贡献指南
├── docs/                              # 文档目录
│   ├── README.md                      # 文档索引
│   ├── getting-started/               # 快速开始
│   │   ├── QUICK_START.md            # 快速开始指南
│   │   └── DEVELOPMENT_SETUP.md      # 开发环境设置
│   ├── features/                      # 功能文档
│   │   ├── gist-integration/         # Gist 集成
│   │   ├── mode-switcher/            # 模式切换
│   │   ├── platform-autofill/        # 平台自动填充
│   │   └── ui-components/            # UI 组件
│   ├── development/                   # 开发文档
│   │   ├── ARCHITECTURE.md           # 架构说明
│   │   ├── ERROR_HANDLING.md         # 错误处理
│   │   ├── OFFLINE_SUPPORT.md        # 离线支持
│   │   └── TESTING_GUIDE.md          # 测试指南
│   ├── testing/                       # 测试文档
│   │   ├── E2E_TEST_SCENARIOS.md     # E2E 测试场景
│   │   └── PERFORMANCE_TEST.md       # 性能测试
│   ├── user-guides/                   # 用户指南
│   │   └── GIST_SETUP_GUIDE.md       # Gist 设置指南
│   └── troubleshooting/               # 故障排除
│       ├── bilibili-issues/          # Bilibili 相关问题
│       ├── category-issues/          # 分类相关问题
│       └── platform-issues/          # 平台相关问题
├── scripts/                           # 脚本目录
│   ├── test-mode-switcher.sh
│   └── test-platform-autofill.sh
└── tests/                             # 测试文件
    └── manual/                        # 手动测试
        └── test-bilibili-api.html
```

## 文档分类

### 保留在根目录
- README.md
- CHANGELOG.md
- CONTRIBUTING.md

### 移动到 docs/getting-started/
- DEVELOPMENT_QUICKSTART.md → QUICK_START.md
- FILE_STRUCTURE.md → ARCHITECTURE.md

### 移动到 docs/features/platform-autofill/
- PLATFORM_AUTO_FILL_GUIDE.md
- PLATFORM_AUTOFILL_TEST.md
- PLATFORM_DEBUG_GUIDE.md
- AUTOFILL_FIX_SUMMARY.md
- QUICK_TEST_GUIDE.md
- TEST_CHECKLIST.md

### 移动到 docs/troubleshooting/bilibili-issues/
- BILIBILI_404_FIX.md
- BILIBILI_GITHUB_AUTOFILL_FIX.md
- BILIBILI_IMAGE_PROXY_FIX.md
- BILIBILI_ISSUE_RESOLVED.md
- BILIBILI_TEST_VIDEOS.md
- BILIBILI_THUMBNAIL_DEBUG.md
- BILIBILI_THUMBNAIL_FIX.md

### 移动到 docs/troubleshooting/category-issues/
- CATEGORY_FEATURE_WORKING.md
- CATEGORY_FILTER_FIX.md
- CATEGORY_FIX_SUMMARY.md
- CATEGORY_ISSUE_ANALYSIS.md
- DEBUG_CATEGORY_ISSUE.md
- test-category-fix.md

### 移动到 docs/features/ui-components/
- CARD_LAYOUT_IMPROVEMENTS.md
- RESOURCE_CARD_IMPROVEMENTS.md
- VIDEO_CARD_IMPROVEMENTS.md
- TOAST_INTEGRATION.md

### 移动到 docs/features/youtube/
- YOUTUBE_INTEGRATION_TEST.md
- YOUTUBE_QUICK_START.md
- YOUTUBE_THUMBNAIL_GUIDE.md
- PLACEHOLDER_IMAGE_FIX.md

### 移动到 docs/features/mode-switcher/
- MODE_SWITCHER_INTEGRATION.md
- MODE_SWITCHER_TEST_GUIDE.md

### 移动到 docs/features/gist-integration/
- GIST_OWNERSHIP_TEST_GUIDE.md
- GIST_TEST_ACCESS.md
- OWNERSHIP_VERIFICATION_UI.md

### 移动到 docs/guides/
- ACCESSIBILITY_GUIDE.md
- PERFORMANCE_OPTIMIZATION.md
- TEST_GUIDE.md

### 移动到 docs/project/
- PROJECT_STATUS.md
- PROJECT_SUMMARY.md
- FINAL_SUMMARY.md

### 移动到 scripts/
- test-mode-switcher.sh
- test-platform-autofill.sh

### 移动到 tests/manual/
- test-bilibili-api.html

## 执行步骤

1. 创建新的目录结构
2. 移动文件到对应目录
3. 更新文档中的链接引用
4. 更新 README.md
5. 创建文档索引
6. 提交到 Git

## 注意事项

- 保持文件内容不变，只移动位置
- 更新所有文档间的相互引用
- 确保 README.md 中的链接正确
- 添加每个目录的 README.md 说明
