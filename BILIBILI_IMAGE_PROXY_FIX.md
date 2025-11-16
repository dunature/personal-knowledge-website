# Bilibili 封面防盗链问题修复

## 🐛 问题根本原因

Bilibili 的图片服务器（`i0.hdslb.com`, `i1.hdslb.com`, `i2.hdslb.com`）有**防盗链保护**。

当浏览器直接加载这些图片时，Bilibili 服务器会检查 HTTP Referer 头：
- ❌ 如果 Referer 不是 `bilibili.com`，图片加载失败
- ✅ 如果 Referer 是 `bilibili.com`，图片正常加载

## ✅ 解决方案：图片代理

### 实施的修复

#### 1. 添加 Vite 图片代理

在 `vite.config.ts` 中添加了三个图片代理：

```typescript
proxy: {
  // API 代理
  '/api/bilibili': { ... },
  
  // 图片代理 - i0.hdslb.com
  '/bilibili-img': {
    target: 'https://i0.hdslb.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/bilibili-img/, ''),
    headers: {
      'Referer': 'https://www.bilibili.com',
      'User-Agent': 'Mozilla/5.0 ...'
    }
  },
  
  // 图片代理 - i1.hdslb.com
  '/bilibili-img2': {
    target: 'https://i1.hdslb.com',
    ...
  },
  
  // 图片代理 - i2.hdslb.com
  '/bilibili-img3': {
    target: 'https://i2.hdslb.com',
    ...
  }
}
```

#### 2. 自动替换图片 URL

在 `platformInfoUtils.ts` 中，开发环境自动将图片 URL 替换为代理路径：

```typescript
// 原始 URL
https://i2.hdslb.com/bfs/archive/82e52df...jpg

// 替换为代理路径（开发环境）
/bilibili-img3/bfs/archive/82e52df...jpg
```

**工作原理**:
1. 浏览器请求 `/bilibili-img3/bfs/archive/xxx.jpg`（同源请求，无 CORS）
2. Vite 代理转发到 `https://i2.hdslb.com/bfs/archive/xxx.jpg`
3. Vite 添加 `Referer: https://www.bilibili.com` 头
4. Bilibili 服务器验证通过，返回图片
5. Vite 将图片返回给浏览器

## 🧪 测试方法

### 步骤 1: 重启开发服务器

**重要**: 必须重启服务器才能应用新的代理配置！

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
cd personal-knowledge-website
npm run dev
```

### 步骤 2: 测试 Bilibili 封面

访问: `http://localhost:5173/platform-autofill-test`

1. 打开浏览器控制台（F12）
2. 输入 Bilibili URL: `https://www.bilibili.com/video/BV1uv411q7Mv`
3. 点击"测试 Bilibili"
4. 查看日志

### 预期日志

```
[Bilibili] BV 号: BV1uv411q7Mv
[Bilibili] API URL: /api/bilibili/x/web-interface/view?bvid=BV1uv411q7Mv
[Bilibili] API 响应: { code: 0, data: { ... } }
[Bilibili] 封面 URL 已转换为 HTTPS: https://i2.hdslb.com/bfs/archive/xxx.jpg
[Bilibili] 使用图片代理 (i2): /bilibili-img3/bfs/archive/xxx.jpg
[Bilibili] 最终封面 URL: /bilibili-img3/bfs/archive/xxx.jpg
```

### 预期结果

✅ **封面图片正常显示**

图片 URL 应该是 `/bilibili-img3/bfs/archive/xxx.jpg` 格式，而不是 `https://i2.hdslb.com/...`

## 📊 对比

### 修复前

```
封面 URL: https://i2.hdslb.com/bfs/archive/xxx.jpg
❌ 浏览器直接请求 Bilibili 服务器
❌ 没有正确的 Referer 头
❌ 图片加载失败（防盗链）
```

### 修复后

```
封面 URL: /bilibili-img3/bfs/archive/xxx.jpg
✅ 浏览器请求本地代理
✅ Vite 添加正确的 Referer 头
✅ 图片正常加载
```

## 🔍 验证方法

### 方法 1: 查看控制台日志

应该看到：
```
[Bilibili] 使用图片代理 (i2): /bilibili-img3/bfs/archive/xxx.jpg
```

### 方法 2: 查看网络请求

1. 打开开发者工具 → Network 标签
2. 测试 Bilibili 视频
3. 查找图片请求
4. URL 应该是 `/bilibili-img3/...` 而不是 `https://i2.hdslb.com/...`

### 方法 3: 检查图片显示

封面图片应该正常显示，不再是破损图标。

## ⚠️ 重要提示

### 1. 必须重启服务器

修改 `vite.config.ts` 后，**必须重启开发服务器**才能生效！

```bash
# 停止服务器（Ctrl+C）
npm run dev  # 重新启动
```

### 2. 仅在开发环境生效

图片代理仅在开发环境（`npm run dev`）中生效。

生产环境需要其他解决方案：
- 后端图片代理
- Serverless 函数
- 或接受使用占位图

### 3. 支持三个图片域名

Bilibili 使用多个图片 CDN 域名：
- `i0.hdslb.com` → `/bilibili-img`
- `i1.hdslb.com` → `/bilibili-img2`
- `i2.hdslb.com` → `/bilibili-img3`

代码会自动识别并使用对应的代理。

## 📝 修改的文件

1. **vite.config.ts**
   - 添加了 3 个图片代理配置

2. **src/utils/platformInfoUtils.ts**
   - 添加了图片 URL 替换逻辑
   - 仅在开发环境生效

## 🎯 测试清单

- [ ] 重启开发服务器
- [ ] 访问测试页面
- [ ] 测试 Bilibili 视频
- [ ] 查看控制台日志（应该看到"使用图片代理"）
- [ ] 验证封面图片正常显示
- [ ] 检查 Network 标签（URL 应该是 `/bilibili-img3/...`）

## 💬 反馈

测试后请告诉我：

1. ✅ 封面是否正常显示？
2. 📝 控制台日志是什么？
3. 🌐 Network 标签中的图片 URL 是什么格式？

---

**修复状态**: ✅ 已完成
**测试状态**: ⏳ 等待验证（记得重启服务器！）
**预期结果**: 封面正常显示
