# 平台自动填充功能调试指南

## 🔍 调试步骤

### 1. 检查 GitHub 按钮是否显示

**测试步骤**:
1. 打开"添加资源"
2. 输入 GitHub URL: `https://github.com/facebook/react`
3. 选择类型: "GitHub 仓库"
4. 检查封面输入框旁是否有"自动填充"按钮

**预期结果**: 按钮应该显示

**如果按钮不显示**:
- 检查类型选项中是否有"GitHub 仓库"
- 检查 URL 是否已输入
- 打开控制台查看是否有错误

### 2. 测试 Bilibili 信息获取

**测试步骤**:
1. 打开"添加资源"
2. 输入 Bilibili URL: `https://www.bilibili.com/video/BV1GJ411x7h7`
3. 选择类型: "Bilibili 视频"
4. 点击"自动填充"按钮
5. 打开浏览器控制台（F12）

**查看控制台日志**:
```
[EditorForm] 开始获取资源信息: { url: "...", type: "bilibili_video" }
[Bilibili] BV 号: BV1GJ411x7h7
[Bilibili] API 响应: { ... }
[EditorForm] Bilibili 视频信息: { title: "...", author: "...", thumbnail: "..." }
```

**可能的错误**:

#### CORS 错误
```
Access to fetch at 'https://api.bilibili.com/...' from origin '...' has been blocked by CORS policy
```

**原因**: Bilibili API 不允许跨域请求

**解决方案**: 
- 方案 1: 使用 CORS 代理
- 方案 2: 使用 JSONP（如果 API 支持）
- 方案 3: 后端代理

#### 网络错误
```
[Bilibili] API 请求失败: 403
```

**原因**: API 拒绝访问

**解决方案**: 
- 检查 URL 格式
- 尝试添加请求头
- 使用备用方案

### 3. 测试 GitHub 信息获取

**测试步骤**:
1. 输入 GitHub URL: `https://github.com/facebook/react`
2. 选择类型: "GitHub 仓库"
3. 点击"自动填充"
4. 查看控制台

**预期日志**:
```
[EditorForm] 开始获取资源信息: { url: "...", type: "github_repo" }
[GitHub] 仓库: facebook react
[GitHub] API 响应: { name: "react", owner: { login: "facebook" }, ... }
[EditorForm] GitHub 仓库信息: { title: "react", author: "facebook", ... }
```

**可能的错误**:

#### 速率限制
```
{
  "message": "API rate limit exceeded",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
}
```

**解决方案**: 等待一小时或使用 GitHub Token

## 🛠️ 快速修复

### 修复 Bilibili CORS 问题

如果 Bilibili 遇到 CORS 问题，可以使用以下方案：

#### 方案 1: 使用 CORS 代理（临时）
```typescript
const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
```

#### 方案 2: 使用备用 API
Bilibili 可能有其他不受 CORS 限制的端点。

#### 方案 3: 仅使用封面
如果无法获取完整信息，至少保证封面可用。

### 修复 GitHub 速率限制

#### 方案 1: 添加 Token（推荐）
```typescript
const response = await fetch(apiUrl, {
    headers: {
        'Authorization': 'token YOUR_GITHUB_TOKEN'
    }
});
```

#### 方案 2: 缓存结果
避免重复请求同一个仓库。

## 📊 当前状态

| 平台 | 按钮显示 | API 调用 | 信息获取 | 状态 |
|------|---------|---------|---------|------|
| YouTube | ✅ | ✅ | ✅ | 正常 |
| Bilibili | ✅ | ⚠️ | ⚠️ | CORS? |
| GitHub | ❓ | ❓ | ❓ | 待测试 |

## 🔧 调试命令

### 测试 Bilibili API（在控制台运行）
```javascript
fetch('https://api.bilibili.com/x/web-interface/view?bvid=BV1GJ411x7h7')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### 测试 GitHub API（在控制台运行）
```javascript
fetch('https://api.github.com/repos/facebook/react')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

## 📝 下一步

1. **测试 GitHub**: 确认按钮是否显示
2. **查看 Bilibili 错误**: 检查控制台的具体错误信息
3. **根据错误调整**: 如果是 CORS，需要使用代理或备用方案

请测试并告诉我控制台显示的具体错误信息！
