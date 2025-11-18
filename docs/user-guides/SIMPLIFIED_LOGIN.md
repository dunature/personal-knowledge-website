# 简化的登录流程

## 概述

登录流程已经简化，现在只需要通过点击头像的弹窗即可完成登录，不再需要跳转到其他页面。

## 登录步骤

### 方式一：从访客模式切换到拥有者模式

1. **点击左上角的"访客模式"按钮**
2. **在弹出的模式选择弹窗中，点击"拥有者模式"卡片**
3. **输入你的 GitHub Personal Access Token**
4. **点击"验证并切换"按钮**
5. **完成！** 你现在已经登录并切换到拥有者模式

### 方式二：首次访问网站

1. **首次访问时，默认是访客模式**
2. **点击左上角的"访客模式"按钮**
3. **按照上述步骤 2-5 完成登录**

## 改进说明

### 之前的流程（已废弃）

1. 点击头像 → 弹窗输入 Token
2. 跳转到配置向导页面 → 再次输入 Token
3. 选择模式 → 完成

**问题**：需要输入两次 Token，流程冗长

### 现在的流程

1. 点击头像 → 弹窗输入 Token
2. 完成！

**优势**：
- ✅ 只需输入一次 Token
- ✅ 不需要页面跳转
- ✅ 流程简洁直观
- ✅ 所有操作在一个弹窗中完成

## 技术实现

### 禁用的组件

1. **SetupGuard**：不再自动检测并跳转到配置向导
2. **SetupWizard 路由**：移除了 `/setup` 路由

### 保留的组件

1. **ModeSwitcherModal**：唯一的登录入口
2. **TokenInputForm**：Token 输入表单
3. **ModeCard**：模式选择卡片

## 相关文件

- `personal-knowledge-website/src/components/setup/SetupGuard.tsx` - 简化为直接渲染子组件
- `personal-knowledge-website/src/main.tsx` - 移除 `/setup` 路由
- `personal-knowledge-website/src/components/mode/ModeSwitcherModal.tsx` - 主要登录组件

## 用户体验

### 访客模式
- 可以浏览所有内容
- 无法编辑或添加内容
- 不需要登录

### 拥有者模式
- 需要 GitHub Token
- 可以编辑和添加内容
- 可以同步数据到 GitHub Gist
- 可以分享自己的知识库

## 常见问题

### Q: 如何获取 GitHub Token？

A: 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) 创建一个新的 Token，需要 `gist` 权限。

### Q: Token 会保存在哪里？

A: Token 会加密后保存在浏览器的 LocalStorage 中，只有你自己可以访问。

### Q: 如何退出登录？

A: 点击头像，在弹窗中选择"访客模式"即可退出。

### Q: 忘记 Token 怎么办？

A: 需要在 GitHub 上重新生成一个新的 Token，然后重新登录。

## 安全提示

- ⚠️ 不要将 Token 分享给他人
- ⚠️ 定期更换 Token
- ⚠️ 如果 Token 泄露，立即在 GitHub 上撤销
