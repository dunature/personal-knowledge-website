# 📚 文档整理说明

本文档说明了项目文档的整理结构和组织方式。

## 🎯 整理目标

1. **清晰的文档结构**：按功能模块组织文档，便于查找
2. **分离开发和生产文档**：开发过程文档不推送到仓库
3. **完善的导航系统**：提供多层次的文档索引
4. **易于维护**：统一的文档组织规范

## 📂 文档结构

```
docs/
├── README.md                    # 文档中心首页
├── INDEX.md                     # 详细文档索引
│
├── getting-started/             # 快速开始
│   └── DEVELOPMENT_QUICKSTART.md
│
├── features/                    # 功能文档（按功能模块组织）
│   ├── gist-integration/       # Gist 集成功能
│   ├── mode-switcher/          # 模式切换功能
│   ├── platform-autofill/      # 平台自动填充功能
│   ├── sync/                   # 同步功能
│   ├── bidirectional-sync/     # 双向同步功能
│   ├── ui-components/          # UI 组件
│   └── youtube/                # YouTube 集成
│
├── development/                 # 开发文档
│   ├── GIST_INTEGRATION.md
│   ├── TESTING_GUIDE.md
│   ├── ERROR_HANDLING.md
│   └── ...
│
├── troubleshooting/             # 故障排除
│   ├── bilibili-issues/        # Bilibili 相关问题
│   └── category-issues/        # 分类相关问题
│
├── guides/                      # 各类指南
│   ├── PERFORMANCE_OPTIMIZATION.md
│   └── ACCESSIBILITY_GUIDE.md
│
├── testing/                     # 测试文档
│   ├── TEST_GUIDE.md
│   ├── E2E_TEST_SCENARIOS.md
│   └── ...
│
├── user-guides/                 # 用户指南
│   ├── GIST_SETUP_GUIDE.md
│   ├── USER_GUIDE_CN.md
│   └── ...
│
├── project/                     # 项目文档
│   ├── PROJECT_STATUS.md
│   ├── PROJECT_SUMMARY.md
│   └── FILE_STRUCTURE.md
│
├── deployment/                  # 部署文档
│   ├── DEPLOYMENT.md
│   ├── QUICK_DEPLOY.md
│   └── ...
│
├── fixes/                       # 修复记录
│   └── ...
│
└── archive/                     # 归档文档
    └── development-process/    # 开发过程文档（不推送到仓库）
        ├── AUTO_SYNC_DEBUG_GUIDE.md
        ├── MANUAL_SYNC_DEBUG.md
        └── ...
```

## 📋 文档分类说明

### 1. 功能文档 (`features/`)

按功能模块组织的文档，每个子目录对应一个主要功能：

- **gist-integration/**: GitHub Gist 集成相关文档
- **mode-switcher/**: 模式切换功能文档
- **platform-autofill/**: 平台自动填充功能文档
- **sync/**: 同步功能文档
- **bidirectional-sync/**: 双向同步功能文档
- **ui-components/**: UI 组件相关文档
- **youtube/**: YouTube 集成文档

### 2. 开发文档 (`development/`)

面向开发者的技术文档：

- 集成实现文档
- 测试指南
- 错误处理策略
- 离线支持实现
- 提交规范

### 3. 故障排除 (`troubleshooting/`)

问题诊断和解决方案：

- **bilibili-issues/**: Bilibili 平台相关问题
- **category-issues/**: 分类功能相关问题

### 4. 测试文档 (`testing/`)

测试相关的文档：

- 测试指南
- 测试清单
- E2E 测试场景
- 性能测试

### 5. 用户指南 (`user-guides/`)

面向用户的使用指南：

- Gist 设置指南
- 资源封面指南
- 快速测试清单
- 错误处理测试指南

### 6. 项目文档 (`project/`)

项目整体的文档：

- 项目状态
- 项目总结
- 文件结构
- 最终总结

### 7. 部署文档 (`deployment/`)

部署相关的文档：

- 部署指南
- 快速部署
- GitHub 设置
- 部署检查清单

### 8. 归档文档 (`archive/`)

历史文档和开发过程文档：

- **development-process/**: 开发过程中的调试文档、修复记录等
  - ⚠️ **注意**：此目录通过 `.gitignore` 排除，不会推送到仓库

## 🔒 .gitignore 配置

为了避免将开发过程文档推送到仓库，已在 `.gitignore` 中添加：

```gitignore
# Development process documentation (archived, not for repo)
docs/archive/development-process/
```

这样可以：
- ✅ 保留本地的开发过程文档供参考
- ✅ 避免将调试文档推送到仓库
- ✅ 保持仓库的整洁

## 📝 文档命名规范

### 文件命名
- 使用大写字母和下划线：`FEATURE_NAME.md`
- 描述性名称：清楚表达文档内容
- 避免过长的文件名

### 目录命名
- 使用小写字母和连字符：`feature-name/`
- 简洁明了
- 反映功能模块

## 🔄 文档维护流程

### 添加新文档

1. 确定文档类型（功能、开发、故障排除等）
2. 放入对应的目录
3. 更新 `docs/README.md` 和 `docs/INDEX.md`
4. 提交到仓库

### 更新现有文档

1. 修改文档内容
2. 更新文档底部的"最后更新"日期
3. 如有结构变化，更新索引文档
4. 提交到仓库

### 归档文档

1. 将不再需要的文档移至 `archive/`
2. 如果是开发过程文档，移至 `archive/development-process/`
3. 从索引中移除相关链接
4. 提交更改

## 🛠️ 整理工具

项目提供了以下脚本来帮助文档整理：

### 1. 文档整理脚本

```bash
./scripts/organize-project-docs.sh
```

功能：
- 自动将项目根目录的文档移至 `docs/` 相应目录
- 按功能分类组织文档
- 创建必要的目录结构

### 2. 提交脚本

```bash
./scripts/commit-organized-docs.sh
```

功能：
- 检查更改状态
- 提交整理后的文档
- 提供推送指引

## 📊 文档统计

整理后的文档分布：

- **功能文档**: 50+ 个文件
- **开发文档**: 12 个文件
- **故障排除**: 10+ 个文件
- **测试文档**: 5 个文件
- **用户指南**: 8 个文件
- **项目文档**: 4 个文件
- **归档文档**: 11 个文件（不推送）

## 🎯 最佳实践

### 编写文档时

1. **使用清晰的标题结构**
   - 使用 H1 作为文档标题
   - 使用 H2-H4 组织内容层次

2. **提供代码示例**
   - 使用代码块展示示例
   - 添加必要的注释

3. **添加导航链接**
   - 在文档开头提供目录
   - 在文档结尾提供相关链接

4. **保持更新**
   - 功能变更时同步更新文档
   - 定期检查文档的准确性

### 组织文档时

1. **按功能分类**
   - 相关文档放在同一目录
   - 避免文档散落各处

2. **保持结构清晰**
   - 不要嵌套太深
   - 使用有意义的目录名

3. **及时归档**
   - 过时的文档移至归档
   - 开发过程文档不推送到仓库

## 🔗 相关链接

- [文档中心首页](README.md)
- [详细文档索引](INDEX.md)
- [贡献指南](../CONTRIBUTING.md)
- [项目 README](../README.md)

## 📅 更新历史

- **2025-11-18**: 完成文档整理，建立新的文档结构
- **2025-11-18**: 创建文档整理脚本和提交脚本
- **2025-11-18**: 更新 .gitignore 排除开发过程文档

---

**维护者**: 项目团队  
**最后更新**: 2025-11-18
