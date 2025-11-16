# Git 提交指南

## 📋 本次提交内容

### 主要更改

1. **文档结构重组** 📚
   - 将 40+ 个文档整理到 `docs/` 目录
   - 按功能、故障排除、指南分类
   - 创建完整的文档索引

2. **平台自动填充功能** ✨
   - YouTube 视频信息自动获取
   - Bilibili 视频信息自动获取
   - GitHub 仓库信息自动获取

3. **Bilibili 封面修复** 🐛
   - 添加图片代理解决防盗链
   - HTTP 转 HTTPS 自动转换
   - 空封面备用方案

4. **UI 设计系统** 🎨
   - 统一的设计令牌
   - 更新组件样式
   - 优化用户体验

5. **文档更新** 📝
   - 更新 README.md
   - 更新 CHANGELOG.md
   - 创建文档索引

## 🚀 提交步骤

### 方法 1: 使用脚本（推荐）

```bash
# 进入项目目录
cd personal-knowledge-website

# 运行提交脚本
bash scripts/commit-and-push.sh
```

脚本会：
1. 显示当前状态
2. 询问确认
3. 添加所有更改
4. 创建提交
5. 推送到 GitHub

### 方法 2: 手动提交

```bash
# 进入项目目录
cd personal-knowledge-website

# 查看状态
git status

# 添加所有更改
git add .

# 提交
git commit -m "feat: 文档重组和平台自动填充功能

### 新增功能
- 平台自动填充（YouTube、Bilibili、GitHub）
- UI 设计系统（统一的设计令牌）
- 文档结构重组

### 修复
- Bilibili 封面防盗链问题（图片代理）
- Bilibili API CORS 问题（API 代理）
- 分类筛选功能

### 改进
- 文档整理到 docs/ 目录
- 更新 README.md 和 CHANGELOG.md
- 优化 UI 组件样式

详见 CHANGELOG.md"

# 推送到 GitHub
git push origin main
```

## 📊 提交统计

### 文件变更
- 新增文件：约 15 个
- 修改文件：约 50 个
- 移动文件：约 41 个
- 删除文件：0 个

### 代码变更
- 新增代码：约 2000 行
- 修改代码：约 500 行
- 文档更新：约 3000 行

## ✅ 提交前检查清单

- [ ] 所有文档已整理到正确的目录
- [ ] README.md 已更新
- [ ] CHANGELOG.md 已更新
- [ ] 文档索引已创建
- [ ] 代码没有语法错误
- [ ] 测试页面可以正常访问

## 🔍 提交后验证

### 1. 检查 GitHub 仓库

访问你的 GitHub 仓库，验证：
- ✅ README.md 显示正确
- ✅ 文档链接可以点击
- ✅ 文档结构清晰
- ✅ CHANGELOG.md 更新

### 2. 克隆测试

```bash
# 克隆到新目录测试
git clone <your-repo-url> test-clone
cd test-clone

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 功能测试

- [ ] 平台自动填充功能正常
- [ ] Bilibili 封面可以显示
- [ ] GitHub 信息可以获取
- [ ] YouTube 信息可以获取

## 📝 提交信息模板

如果需要自定义提交信息，可以使用以下模板：

```
feat: [简短描述]

### 新增功能
- [功能1]
- [功能2]

### 修复
- [修复1]
- [修复2]

### 改进
- [改进1]
- [改进2]

详见 CHANGELOG.md
```

## 🆘 常见问题

### Q: 推送失败怎么办？

**A**: 检查以下几点：
1. 是否有远程仓库：`git remote -v`
2. 是否有权限：检查 SSH 密钥或 Token
3. 分支名是否正确：`git branch`

### Q: 需要先拉取远程更改？

**A**: 如果远程有更新：
```bash
git pull origin main --rebase
git push origin main
```

### Q: 想要撤销提交？

**A**: 如果还没推送：
```bash
git reset --soft HEAD~1  # 保留更改
# 或
git reset --hard HEAD~1  # 丢弃更改
```

### Q: 推送到其他分支？

**A**: 
```bash
# 创建新分支
git checkout -b feature/docs-reorganization

# 推送到新分支
git push origin feature/docs-reorganization
```

## 🎉 完成

提交成功后，你的项目将：
- ✅ 拥有清晰的文档结构
- ✅ 完整的功能实现
- ✅ 专业的项目组织
- ✅ 易于维护和扩展

**准备好了吗？开始提交吧！** 🚀

---

**文档创建时间**: 2024-11-16
**状态**: 准备提交
