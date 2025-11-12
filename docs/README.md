# 📚 项目文档目录

本目录包含项目的所有文档，按类别组织。

## 📁 文档结构

```
docs/
├── user-guides/          # 用户使用指南
├── development/          # 开发相关文档
├── deployment/           # 部署相关文档
├── fixes/                # 问题修复记录
└── archive/              # 历史文档归档
```

---

## 📖 用户使用指南 (user-guides/)

面向最终用户的使用文档。

### 主要文档
- **USER_GUIDE_CN.md** - 完整的中文使用指南
  - 快速开始
  - 资源管理详细教程
  - 问答管理详细教程
  - Markdown编辑技巧
  - 常见问题和使用技巧

- **RESOURCE_COVER_GUIDE.md** - 资源封面图片使用指南
  - 4种添加封面图片的方法
  - 推荐的免费图床服务
  - YouTube/Bilibili缩略图获取
  - 占位图服务使用

- **TESTING_GUIDE.md** - 测试指南
  - 功能测试步骤
  - 测试工具使用

- **QUICK_TEST_CRUD.md** - CRUD功能快速测试
  - 分模块测试步骤
  - UI元素识别指南
  - 测试检查清单

- **QUICK_TEST_CHECKLIST.md** - 快速测试检查清单
- **QUICK_TEST_SUB_QUESTIONS.md** - 小问题功能测试

---

## 💻 开发文档 (development/)

面向开发者的技术文档。

### 主要文档
- **CRUD_COMPLETE.md** - CRUD功能完整说明
  - 所有增删改查功能详解
  - 技术实现细节
  - 数据流说明
  - 用户体验优化

- **DOCUMENTATION_SUMMARY.md** - 文档总览
  - 所有文档列表
  - 文档使用建议
  - 快速查找指南

- **README_UPDATE_SUMMARY.md** - README更新总结
  - 更新内容说明
  - 新增功能列表

- **COMMIT_MESSAGE.md** - 详细的commit说明
  - 改动内容详解
  - 技术亮点
  - 影响范围

- **PUSH_SUMMARY.md** - GitHub推送总结
  - 推送信息
  - 变更统计
  - 后续步骤

---

## 🚀 部署文档 (deployment/)

部署和发布相关文档。

### 主要文档
- **DEPLOYMENT.md** - 完整部署指南
  - 部署前准备
  - Vercel部署详细步骤
  - Netlify部署详细步骤
  - 自定义域名配置
  - 环境变量设置
  - 故障排查

- **QUICK_DEPLOY.md** - 快速部署指南
  - 5分钟快速部署
  - Vercel一键部署
  - Netlify一键部署

- **GITHUB_SETUP.md** - GitHub仓库设置
  - 创建GitHub仓库
  - 推送代码步骤
  - 仓库设置建议

- **READY_TO_DEPLOY.md** - 部署准备清单
  - 部署前检查
  - 必要配置

---

## 🔧 问题修复记录 (fixes/)

记录项目开发过程中遇到的问题及解决方案。

### 主要文档
- **ADD_QUESTION_BUTTON_FIX.md** - 添加大问题按钮修复
  - 问题描述：按钮不可见
  - 解决方案：移出条件渲染
  - 修改文件：QASection.tsx

- **IMAGE_DISPLAY_FIX.md** - 图片显示问题修复
  - 问题描述：外部图片服务不可访问
  - 解决方案：本地SVG生成
  - 新增文件：placeholderUtils.ts

- **SAMPLE_DATA_FIX.md** - 示例数据修复
  - 问题描述：示例图片URL失效
  - 解决方案：使用占位图服务

- **DROPDOWN_FIX_SIMPLE.md** - 下拉菜单简单修复
- **DROPDOWN_FINAL_SOLUTION.md** - 下拉菜单最终方案
- **DROPDOWN_SOLUTIONS.md** - 下拉菜单解决方案集合
- **DROPDOWN_ULTIMATE_FIX.md** - 下拉菜单终极修复

---

## 📦 历史文档归档 (archive/)

已完成任务的记录和历史文档。

### 任务完成记录
- **TASK11_COMPLETED.md** - 任务11完成记录
- **TASK12_COMPLETED.md** - 任务12完成记录
- **TASK13_COMPLETED.md** - 任务13完成记录
- **TASK14_COMPLETED.md** - 任务14完成记录
- **TASK15_COMPLETED.md** - 任务15完成记录
- **TASK_18_23_COMPLETED.md** - 任务18和23完成记录

### 功能开发记录
- **INLINE_EDIT_COMPLETE.md** - 内联编辑功能完成
- **INLINE_EDIT_FEATURE.md** - 内联编辑功能说明
- **INLINE_EDIT_STATUS.md** - 内联编辑状态
- **INLINE_EDIT_TEST.md** - 内联编辑测试
- **SUB_QUESTION_EDIT_COMPLETE.md** - 小问题编辑完成

### 修复记录
- **FIXED.md** - 修复记录1
- **FIXED_ROUND2.md** - 修复记录2

### 其他
- **PROJECT_PROGRESS.md** - 项目进度
- **PROGRESS.md** - 进度记录
- **FINAL_SUMMARY.md** - 最终总结
- **COMPONENT_TEST.md** - 组件测试
- **GETTING_STARTED.md** - 入门指南
- **REMAINING_TASKS.md** - 剩余任务

---

## 🔍 快速查找

### 我想...

- **学习如何使用** → [user-guides/USER_GUIDE_CN.md](./user-guides/USER_GUIDE_CN.md)
- **添加资源封面** → [user-guides/RESOURCE_COVER_GUIDE.md](./user-guides/RESOURCE_COVER_GUIDE.md)
- **测试功能** → [user-guides/QUICK_TEST_CRUD.md](./user-guides/QUICK_TEST_CRUD.md)
- **部署应用** → [deployment/QUICK_DEPLOY.md](./deployment/QUICK_DEPLOY.md)
- **了解技术细节** → [development/CRUD_COMPLETE.md](./development/CRUD_COMPLETE.md)
- **查看修复记录** → [fixes/](./fixes/)
- **查看历史文档** → [archive/](./archive/)

---

## 📝 文档维护

### 添加新文档
1. 确定文档类型（用户指南/开发/部署/修复）
2. 放入对应的文件夹
3. 更新本README的相关部分

### 归档文档
当文档过时或任务完成后，将文档移至 `archive/` 文件夹。

---

## 🔗 相关链接

- [项目README](../README.md) - 项目主文档
- [GitHub仓库](https://github.com/dunature/personal-knowledge-website)

---

**文档结构最后更新**: 2024-01-XX
