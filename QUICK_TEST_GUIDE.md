# 🚀 快速测试指南

## 一键测试

```bash
cd personal-knowledge-website
npm run dev
```

然后访问: **http://localhost:5173/platform-autofill-test**

## 测试内容

### 1. YouTube（对照组）✅
- 默认 URL 已填写
- 点击"测试 YouTube"
- 应该成功获取标题、作者和封面

### 2. Bilibili（已修复）🔧
- 默认 URL: `https://www.bilibili.com/video/BV1GJ411x7h7`
- 点击"测试 Bilibili"
- **现在应该成功**获取标题、UP主和封面
- 如果失败，查看控制台错误

### 3. GitHub（应该正常）✅
- 默认 URL: `https://github.com/facebook/react`
- 点击"测试 GitHub"
- 应该成功获取仓库名、作者和描述

## 在实际编辑器中测试

### GitHub 按钮测试
1. 访问主页
2. 点击"添加资源"
3. 输入: `https://github.com/facebook/react`
4. 选择: "GitHub 仓库"
5. **检查**: 是否有"自动填充"按钮？
6. 点击按钮测试

### Bilibili 功能测试
1. 点击"添加资源"
2. 输入: `https://www.bilibili.com/video/BV1GJ411x7h7`
3. 选择: "Bilibili 视频"
4. 点击"自动填充"
5. 检查是否填充了标题和作者

## 预期结果

✅ 所有三个平台都应该正常工作
✅ GitHub 按钮应该显示
✅ Bilibili 应该能获取信息（不再有 CORS 错误）

## 如果有问题

1. 打开浏览器控制台（F12）
2. 查看错误信息
3. 截图并反馈

---

**修复内容**:
- ✅ 添加了 Vite 代理解决 Bilibili CORS 问题
- ✅ 创建了独立测试页面
- ✅ 验证了 GitHub 按钮逻辑正确

**需要你做的**:
- 🧪 运行测试
- 📝 反馈结果
