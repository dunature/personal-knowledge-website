# 平台自动填充功能测试指南

## 🎯 问题描述

用户报告：
1. **Bilibili**: 没有获取到视频标题和作者
2. **GitHub**: 连自动填充按钮都没有显示

## 🔍 测试步骤

### 1. 访问测试页面

启动开发服务器后，访问：
```
http://localhost:5173/platform-autofill-test
```

### 2. 测试 YouTube（对照组）

1. 使用默认 URL 或输入其他 YouTube 视频链接
2. 点击"测试 YouTube"按钮
3. 查看结果和控制台日志

**预期结果**: ✅ 应该成功获取标题、作者和封面

### 3. 测试 Bilibili

1. 使用默认 URL: `https://www.bilibili.com/video/BV1GJ411x7h7`
2. 点击"测试 Bilibili"按钮
3. **重要**: 打开浏览器控制台（F12）查看详细日志

**可能的结果**:

#### 情况 A: CORS 错误
```
Access to fetch at 'https://api.bilibili.com/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**原因**: Bilibili API 不允许跨域请求

**解决方案**:
- 使用 CORS 代理
- 或者接受这个限制，至少保证封面图可用

#### 情况 B: API 返回错误
```
[Bilibili] API 返回错误: -403
```

**原因**: API 可能需要特定的请求头或 Cookie

**解决方案**:
- 添加必要的请求头
- 使用备用方案

#### 情况 C: 成功
```
[Bilibili] API 响应: { code: 0, data: { title: "...", owner: { name: "..." } } }
```

**结果**: ✅ 功能正常

### 4. 测试 GitHub

1. 使用默认 URL: `https://github.com/facebook/react`
2. 点击"测试 GitHub"按钮
3. 查看结果

**可能的结果**:

#### 情况 A: 成功
```
[GitHub] API 响应: { name: "react", owner: { login: "facebook" }, ... }
```

**结果**: ✅ 功能正常

#### 情况 B: 速率限制
```
{
  "message": "API rate limit exceeded for ...",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
}
```

**原因**: GitHub API 限制未认证请求为 60 次/小时

**解决方案**:
- 等待一小时后重试
- 或添加 GitHub Token（需要实现）

## 🔧 在实际编辑器中测试

### 测试 GitHub 按钮显示

1. 访问主页
2. 点击"添加资源"
3. 输入 URL: `https://github.com/facebook/react`
4. 选择类型: "GitHub 仓库"
5. **检查**: 封面输入框旁边是否有"自动填充"按钮

**预期**: ✅ 按钮应该显示

**如果按钮不显示**:
- 检查 `EditorForm.tsx` 第 244 行的条件
- 确认 `data.type` 是否为 `'github_repo'`
- 确认 `data.url` 是否有值

### 测试 Bilibili 信息获取

1. 点击"添加资源"
2. 输入 URL: `https://www.bilibili.com/video/BV1GJ411x7h7`
3. 选择类型: "Bilibili 视频"
4. 点击"自动填充"按钮
5. 打开控制台查看日志

**预期日志**:
```
[EditorForm] 开始获取资源信息: { url: "...", type: "bilibili_video" }
[Bilibili] BV 号: BV1GJ411x7h7
[Bilibili] API 响应: ...
```

## 🐛 已知问题和解决方案

### 问题 1: Bilibili CORS 错误

**症状**: 
```
Access to fetch at 'https://api.bilibili.com/...' has been blocked by CORS policy
```

**临时解决方案**:

#### 方案 A: 使用 CORS 代理（开发环境）
```typescript
// 在 platformInfoUtils.ts 中
const apiUrl = import.meta.env.DEV 
    ? `https://cors-anywhere.herokuapp.com/https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
    : `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
```

#### 方案 B: 使用 Vite 代理
在 `vite.config.ts` 中添加：
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/bilibili-api': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili-api/, '')
      }
    }
  }
})
```

然后修改 API 调用：
```typescript
const apiUrl = `/bilibili-api/x/web-interface/view?bvid=${bvid}`;
```

#### 方案 C: 后端代理（生产环境）
创建一个后端 API 端点来代理 Bilibili 请求。

### 问题 2: GitHub 按钮不显示

**检查清单**:
1. ✅ URL 已输入
2. ✅ 类型选择为 "GitHub 仓库"
3. ✅ `resourceTypeOptions` 中包含 `github_repo`
4. ✅ 按钮条件包含 `data.type === 'github_repo'`

**调试代码**:
在 `EditorForm.tsx` 中添加日志：
```typescript
console.log('[EditorForm] 按钮显示条件:', {
    type: data.type,
    url: data.url,
    shouldShow: (data.type === 'youtube_video' || data.type === 'bilibili_video' || data.type === 'github_repo') && data.url
});
```

## 📊 测试结果记录

### YouTube
- [ ] 按钮显示: ✅ / ❌
- [ ] API 调用: ✅ / ❌
- [ ] 信息获取: ✅ / ❌
- [ ] 错误信息: ___________

### Bilibili
- [ ] 按钮显示: ✅ / ❌
- [ ] API 调用: ✅ / ❌
- [ ] 信息获取: ✅ / ❌
- [ ] 错误类型: CORS / API错误 / 其他
- [ ] 错误信息: ___________

### GitHub
- [ ] 按钮显示: ✅ / ❌
- [ ] API 调用: ✅ / ❌
- [ ] 信息获取: ✅ / ❌
- [ ] 错误信息: ___________

## 🚀 下一步行动

根据测试结果：

1. **如果 Bilibili 是 CORS 问题**: 实施上述解决方案之一
2. **如果 GitHub 按钮不显示**: 检查代码逻辑和类型匹配
3. **如果 GitHub API 失败**: 检查速率限制或网络问题

请运行测试并告诉我具体的错误信息！
