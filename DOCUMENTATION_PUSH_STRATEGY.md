# 📚 文档推送策略

## 🎯 策略说明

本项目采用**选择性文档推送**策略，只将核心文档推送到远程仓库，其他文档保留在本地。

## ✅ 推送到仓库的文档

以下文档会被推送到远程仓库：

### 1. 用户指南 (`docs/user-guides/`)
- ✅ GIST_SETUP_GUIDE.md - Gist 设置指南
- ✅ USER_GUIDE_CN.md - 用户使用手册
- ✅ RESOURCE_COVER_GUIDE.md - 资源封面指南
- ✅ QUICK_TEST_CHECKLIST.md - 快速测试清单
- ✅ ERROR_HANDLING_TEST_GUIDE.md - 错误处理测试指南
- ✅ 其他用户指南文档

### 2. 项目文档 (`docs/project/`)
- ✅ PROJECT_STATUS.md - 项目状态
- ✅ PROJECT_SUMMARY.md - 项目总结
- ✅ FINAL_SUMMARY.md - 最终总结
- ✅ FILE_STRUCTURE.md - 文件结构

### 3. 指南 (`docs/guides/`)
- ✅ PERFORMANCE_OPTIMIZATION.md - 性能优化
- ✅ ACCESSIBILITY_GUIDE.md - 无障碍指南

### 4. 文档索引
- ✅ docs/README.md - 文档中心首页
- ✅ docs/INDEX.md - 详细文档索引
- ✅ docs/OPTIMIZATION_CHECKLIST.md - 优化清单
- ✅ docs/DATA_STORAGE_FAQ.md - 数据存储FAQ

### 5. 根目录文档
- ✅ README.md - 项目主页
- ✅ CONTRIBUTING.md - 贡献指南
- ✅ CHANGELOG.md - 更新日志

## ❌ 不推送的文档（保留在本地）

以下文档通过 `.gitignore` 排除，不会推送到远程仓库：

### 1. 功能文档 (`docs/features/`)
- ❌ gist-integration/ - Gist 集成文档
- ❌ mode-switcher/ - 模式切换文档
- ❌ platform-autofill/ - 平台自动填充文档
- ❌ sync/ - 同步功能文档
- ❌ bidirectional-sync/ - 双向同步文档
- ❌ ui-components/ - UI 组件文档
- ❌ youtube/ - YouTube 集成文档

### 2. 开发文档 (`docs/development/`)
- ❌ GIST_INTEGRATION.md - Gist 集成开发
- ❌ TESTING_GUIDE.md - 测试指南
- ❌ ERROR_HANDLING.md - 错误处理
- ❌ OFFLINE_SUPPORT.md - 离线支持
- ❌ 其他开发文档

### 3. 故障排除 (`docs/troubleshooting/`)
- ❌ bilibili-issues/ - Bilibili 问题
- ❌ category-issues/ - 分类问题

### 4. 测试文档 (`docs/testing/`)
- ❌ TEST_GUIDE.md - 测试指南
- ❌ E2E_TEST_SCENARIOS.md - E2E 测试场景
- ❌ PERFORMANCE_TEST.md - 性能测试

### 5. 部署文档 (`docs/deployment/`)
- ❌ DEPLOYMENT.md - 部署指南
- ❌ QUICK_DEPLOY.md - 快速部署

### 6. 归档文档 (`docs/archive/`)
- ❌ development-process/ - 开发过程文档
- ❌ 其他历史文档

### 7. 其他文档
- ❌ docs/getting-started/ - 快速开始
- ❌ docs/fixes/ - 修复记录
- ❌ docs/GIST_*.md - Gist 相关文档
- ❌ docs/HOMEPAGE_INTEGRATION.md
- ❌ docs/INITIAL_SYNC_*.md
- ❌ 其他功能相关文档

## 🔧 .gitignore 配置

在 `.gitignore` 中添加了以下规则：

```gitignore
# 只推送用户指南、项目文档和指南，其他文档不推送
docs/features/
docs/development/
docs/troubleshooting/
docs/testing/
docs/deployment/
docs/fixes/
docs/archive/
docs/getting-started/

# 排除 docs 根目录下的功能相关文档
docs/GIST_*.md
docs/HOMEPAGE_INTEGRATION.md
docs/INITIAL_SYNC_*.md
docs/SETTINGS_PAGE_TEST.md
docs/URL_GIST_LOADING.md
docs/DEPLOYMENT_READY.md
docs/FILE_ORGANIZATION.md
docs/DOCUMENTATION_REORGANIZATION.md
docs/IMPORTANT_NOTES.md
```

## 📊 统计信息

### 推送到仓库
- **用户指南**: 9 个文件
- **项目文档**: 4 个文件
- **指南**: 2 个文件
- **文档索引**: 4 个文件
- **总计**: 约 19 个文档文件

### 保留在本地
- **功能文档**: 49 个文件
- **开发文档**: 13 个文件
- **故障排除**: 12 个文件
- **测试文档**: 5 个文件
- **部署文档**: 4 个文件
- **其他**: 20+ 个文件
- **总计**: 约 103+ 个文档文件

## 🎯 策略优势

### 1. 保持仓库整洁
- ✅ 只推送用户和项目必需的文档
- ✅ 避免仓库被大量开发文档污染
- ✅ 减小仓库体积

### 2. 保护开发过程
- ✅ 开发调试文档保留在本地
- ✅ 不暴露内部开发细节
- ✅ 保持专业形象

### 3. 便于维护
- ✅ 本地保留完整文档供开发参考
- ✅ 远程仓库只包含核心文档
- ✅ 清晰的文档分类

### 4. 灵活性
- ✅ 可以随时调整推送策略
- ✅ 本地文档不受影响
- ✅ 易于团队协作

## 🚀 使用方法

### 提交核心文档

使用提供的脚本：

```bash
cd personal-knowledge-website
./scripts/commit-essential-docs.sh
```

或手动提交：

```bash
git add .
git commit -m "docs: 更新核心文档"
git push origin main
```

### 验证推送内容

查看哪些文档会被推送：

```bash
# 查看将要提交的文档
git status docs/

# 检查特定文件是否被忽略
git check-ignore -v docs/features/gist-integration/GIST_OWNERSHIP_TEST_GUIDE.md
```

### 修改推送策略

如需调整哪些文档推送到仓库，编辑 `.gitignore` 文件：

```bash
# 编辑 .gitignore
vim .gitignore

# 添加或删除排除规则
```

## 📝 注意事项

1. **本地文档完整性**
   - 所有文档都保留在本地
   - 不推送不等于删除
   - 可以随时查看和使用

2. **团队协作**
   - 团队成员需要了解这个策略
   - 本地开发文档不会同步
   - 核心文档通过仓库共享

3. **文档更新**
   - 更新用户指南后记得提交
   - 项目文档变更需要推送
   - 开发文档可以本地保留

4. **版本控制**
   - 核心文档有版本历史
   - 开发文档只在本地
   - 可以通过分支管理不同版本

## 🔗 相关文档

- [文档中心](docs/README.md)
- [文档索引](docs/INDEX.md)
- [贡献指南](CONTRIBUTING.md)
- [项目 README](README.md)

## 📅 更新历史

- **2025-11-18**: 建立选择性推送策略
- **2025-11-18**: 配置 .gitignore 排除规则
- **2025-11-18**: 创建提交脚本

---

**维护者**: 项目团队  
**最后更新**: 2025-11-18
