# 平台资源自动填充功能指南

## 🎯 功能概述

系统现在支持从多个平台自动获取资源信息，包括：

### ✅ YouTube
- **标题**: 视频标题
- **作者**: 频道名称
- **封面**: 视频缩略图

### ✅ Bilibili
- **标题**: 视频标题
- **作者**: UP主名称
- **封面**: 视频封面图

### ✅ GitHub
- **标题**: 仓库名称
- **作者**: 仓库所有者
- **推荐语**: 仓库描述

## 📝 使用方法

### 通用步骤

1. 点击"添加资源"
2. 输入资源 URL
3. 选择对应的资源类型
4. 点击"自动填充"按钮
5. 系统自动填充信息
6. 检查并保存

### YouTube 视频

```
URL 示例: https://www.youtube.com/watch?v=VIDEO_ID
类型: YouTube 视频
自动获取: 标题、频道名、封面
```

### Bilibili 视频

```
URL 示例: https://www.bilibili.com/video/BV1234567890
类型: Bilibili 视频
自动获取: 标题、UP主、封面
```

### GitHub 仓库

```
URL 示例: https://github.com/owner/repo
类型: GitHub 仓库
自动获取: 仓库名、作者、描述
```

## 🔧 技术实现

### YouTube
- **API**: YouTube oEmbed API
- **无需密钥**: ✅
- **CORS**: ✅ 支持

### Bilibili
- **API**: Bilibili Web API
- **无需密钥**: ✅
- **CORS**: ⚠️ 可能有限制
- **端点**: `https://api.bilibili.com/x/web-interface/view?bvid=BV号`

### GitHub
- **API**: GitHub REST API v3
- **无需密钥**: ✅（有速率限制）
- **CORS**: ✅ 支持
- **端点**: `https://api.github.com/repos/owner/repo`
- **速率限制**: 60 请求/小时（未认证）

## 💡 智能填充规则

系统只会填充**空白字段**，不会覆盖已有内容：

- ✅ 标题为空 → 自动填充
- ✅ 作者为空或为"未知" → 自动填充
- ✅ 推荐语为空 → 自动填充（仅 GitHub）
- ❌ 字段已有内容 → 保持不变

## 🎨 UI 特性

### 按钮显示条件
- 选择了支持的资源类型（YouTube/Bilibili/GitHub）
- 输入了有效的 URL
- 按钮文字："自动填充"
- 提示文字："自动获取资源信息（标题、作者等）"

### 视觉反馈
- 点击按钮后立即处理
- 控制台显示详细日志
- 字段实时更新

## 🔍 调试信息

打开浏览器控制台可以看到详细的调试信息：

```
[EditorForm] 开始获取资源信息: { url: "...", type: "..." }
[Platform] API 响应: { ... }
[EditorForm] 将更新标题: ...
[EditorForm] 将更新作者: ...
[EditorForm] 应用更新: { ... }
```

## ⚠️ 注意事项

### YouTube
- ✅ 稳定可靠
- ✅ 无 CORS 问题
- ✅ 无速率限制

### Bilibili
- ⚠️ 可能遇到 CORS 问题
- ⚠️ API 可能变化
- ✅ 无速率限制
- 💡 如果失败，会使用占位图

### GitHub
- ✅ 稳定可靠
- ⚠️ 有速率限制（60/小时）
- ⚠️ 超过限制会失败
- 💡 建议适度使用

## 🚀 支持的 URL 格式

### YouTube
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

### Bilibili
```
https://www.bilibili.com/video/BV1234567890
https://bilibili.com/video/BV1234567890
```

### GitHub
```
https://github.com/owner/repo
https://github.com/owner/repo/
```

## 🐛 故障排除

### 问题：Bilibili 信息获取失败

**可能原因**:
- CORS 限制
- API 变化
- 网络问题

**解决方案**:
1. 检查控制台错误信息
2. 手动输入标题和作者
3. 至少会获取到占位图

### 问题：GitHub 速率限制

**错误信息**: `API rate limit exceeded`

**解决方案**:
1. 等待一小时后重试
2. 手动输入信息
3. 考虑使用 GitHub Token（未来功能）

### 问题：按钮不显示

**检查清单**:
- ✅ 已输入 URL
- ✅ 已选择支持的类型
- ✅ URL 格式正确

## 📊 功能对比

| 平台 | 标题 | 作者 | 封面 | 描述 | 其他 |
|------|------|------|------|------|------|
| YouTube | ✅ | ✅ | ✅ | ❌ | - |
| Bilibili | ✅ | ✅ | ✅ | ❌ | - |
| GitHub | ✅ | ✅ | ❌ | ✅ | 星标数 |

## 🎉 使用示例

### 添加 YouTube 视频
1. URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. 类型: YouTube 视频
3. 点击"自动填充"
4. 自动获取: 标题、频道名、封面

### 添加 Bilibili 视频
1. URL: `https://www.bilibili.com/video/BV1GJ411x7h7`
2. 类型: Bilibili 视频
3. 点击"自动填充"
4. 自动获取: 标题、UP主、封面

### 添加 GitHub 仓库
1. URL: `https://github.com/facebook/react`
2. 类型: GitHub 仓库
3. 点击"自动填充"
4. 自动获取: 仓库名、作者、描述

现在你可以轻松添加各种平台的资源，系统会自动帮你填充信息！🚀
