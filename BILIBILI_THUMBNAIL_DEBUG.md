# Bilibili 封面问题调试指南

## 🐛 问题

Bilibili 视频的封面无法获取或显示。

## 🔍 可能的原因

### 1. API 返回的封面 URL 为空
```json
{
  "code": 0,
  "data": {
    "title": "视频标题",
    "owner": { "name": "UP主" },
    "pic": ""  // ❌ 空字符串
  }
}
```

### 2. 封面 URL 是 HTTP 而不是 HTTPS
```
http://i0.hdslb.com/bfs/archive/xxx.jpg  // ❌ HTTP
https://i0.hdslb.com/bfs/archive/xxx.jpg // ✅ HTTPS
```

### 3. 封面 URL 有 CORS 限制
浏览器可能阻止加载跨域图片。

### 4. 封面 URL 格式不正确
API 返回的字段名可能不是 `pic`。

## ✅ 已实施的修复

### 1. HTTP 转 HTTPS

在 `platformInfoUtils.ts` 中添加了转换逻辑：

```typescript
// 获取封面 URL
let thumbnail = data.data.pic || '';

// Bilibili 的封面 URL 可能是 http:// 开头，需要转换为 https://
if (thumbnail && thumbnail.startsWith('http://')) {
    thumbnail = thumbnail.replace('http://', 'https://');
    console.log('[Bilibili] 封面 URL 已转换为 HTTPS:', thumbnail);
}
```

### 2. 空封面处理

在 `EditorForm.tsx` 中添加了空值检查：

```typescript
// 使用 API 返回的封面，如果为空则使用占位图
if (videoInfo.thumbnail && videoInfo.thumbnail.trim() !== '') {
    updates.cover = videoInfo.thumbnail;
    console.log('[EditorForm] 将更新封面:', videoInfo.thumbnail);
} else {
    console.log('[EditorForm] API 返回的封面为空，使用占位图');
    updates.cover = getVideoThumbnail(data.url, 'bilibili_video');
}
```

### 3. 详细日志

添加了详细的调试日志：

```typescript
console.log('[Bilibili] 封面 URL:', thumbnail);
console.log('[Bilibili] 完整视频数据:', {
    title: data.data.title,
    author: data.data.owner?.name,
    pic: data.data.pic,
    thumbnail: thumbnail
});
```

## 🧪 调试步骤

### 步骤 1: 查看控制台日志

1. 打开浏览器控制台（F12）
2. 访问测试页面或使用编辑器
3. 点击"自动填充"
4. 查看日志输出

**期望看到的日志**:
```
[Bilibili] BV 号: BV1uv411q7Mv
[Bilibili] API URL: /api/bilibili/x/web-interface/view?bvid=BV1uv411q7Mv
[Bilibili] API 响应: { code: 0, data: { ... } }
[Bilibili] 封面 URL: https://i0.hdslb.com/bfs/archive/xxx.jpg
[Bilibili] 完整视频数据: { title: "...", author: "...", pic: "...", thumbnail: "..." }
[EditorForm] Bilibili 视频信息: { title: "...", author: "...", thumbnail: "..." }
[EditorForm] 将更新封面: https://i0.hdslb.com/bfs/archive/xxx.jpg
```

### 步骤 2: 检查封面 URL

如果日志显示封面 URL，复制它并：

1. 在新标签页中打开
2. 检查是否能正常显示
3. 检查是否有 CORS 错误

### 步骤 3: 检查 API 响应

在控制台中展开 API 响应对象，查看：

```javascript
// 检查这些字段
data.data.pic          // 封面 URL
data.data.title        // 标题
data.data.owner.name   // UP主
```

### 步骤 4: 手动测试 API

在控制台中运行：

```javascript
fetch('/api/bilibili/x/web-interface/view?bvid=BV1uv411q7Mv')
  .then(r => r.json())
  .then(d => {
    console.log('完整响应:', d);
    console.log('封面 URL:', d.data?.pic);
  });
```

## 📊 常见情况

### 情况 A: 封面 URL 为空

**日志**:
```
[Bilibili] 封面 URL: 
[EditorForm] API 返回的封面为空，使用占位图
```

**原因**: API 没有返回封面 URL

**解决方案**: 使用占位图（已自动处理）

### 情况 B: 封面 URL 是 HTTP

**日志**:
```
[Bilibili] 封面 URL 已转换为 HTTPS: https://...
```

**原因**: API 返回的是 HTTP URL

**解决方案**: 已自动转换为 HTTPS

### 情况 C: 封面无法加载

**现象**: URL 存在但图片不显示

**可能原因**:
1. CORS 限制
2. 图片已被删除
3. 需要 Referer 头

**解决方案**: 使用占位图或代理图片

### 情况 D: 字段名不对

**日志**:
```
[Bilibili] API 响应: { code: 0, data: { ... } }
[Bilibili] 封面 URL: 
```

**检查**: API 响应中是否有 `pic` 字段

**可能的字段名**:
- `pic`
- `cover`
- `thumbnail`
- `image`

## 🔧 进一步修复

### 如果封面字段名不对

修改 `platformInfoUtils.ts`:

```typescript
// 尝试多个可能的字段名
let thumbnail = data.data.pic 
    || data.data.cover 
    || data.data.thumbnail 
    || data.data.image 
    || '';
```

### 如果需要代理图片

可以创建一个图片代理端点：

```typescript
// vite.config.ts
'/api/bilibili-image': {
  target: 'https://i0.hdslb.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/bilibili-image/, '')
}
```

然后修改封面 URL：

```typescript
if (thumbnail && thumbnail.includes('i0.hdslb.com')) {
    thumbnail = thumbnail.replace('https://i0.hdslb.com', '/api/bilibili-image');
}
```

## 📝 测试清单

- [ ] 打开控制台
- [ ] 测试 Bilibili 视频
- [ ] 检查日志中的封面 URL
- [ ] 验证封面 URL 是否为 HTTPS
- [ ] 尝试在新标签页打开封面 URL
- [ ] 检查是否显示占位图（如果 URL 为空）
- [ ] 记录具体的错误信息

## 💬 反馈信息

请提供以下信息：

1. **控制台日志**: 完整的 Bilibili 相关日志
2. **封面 URL**: 从日志中复制的封面 URL
3. **API 响应**: 完整的 API 响应数据
4. **现象描述**: 
   - [ ] 封面完全不显示
   - [ ] 显示占位图
   - [ ] 显示破损图片图标
   - [ ] 其他: ___________

---

**调试状态**: ⏳ 等待用户反馈
**预期结果**: 封面正常显示或使用占位图
