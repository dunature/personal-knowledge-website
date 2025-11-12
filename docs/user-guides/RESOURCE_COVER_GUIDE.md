# 资源封面图片使用指南

## 📸 如何添加资源封面图片

### 方法1：在添加/编辑资源时输入图片URL

1. 点击"+ 添加资源"或编辑现有资源
2. 在表单中找到"封面图片URL"字段
3. 输入图片的完整URL，例如：
   ```
   https://example.com/image.jpg
   ```
4. 输入后会立即显示预览
5. 点击"保存"

### 方法2：使用图床服务

推荐的免费图床服务：

#### 1. **Imgur** (推荐)
- 网址：https://imgur.com
- 特点：免费、稳定、无需注册
- 使用步骤：
  1. 访问 imgur.com
  2. 点击"New post"上传图片
  3. 上传后右键图片 → "复制图片地址"
  4. 粘贴到"封面图片URL"字段

#### 2. **ImgBB**
- 网址：https://imgbb.com
- 特点：免费、支持中文
- 使用步骤：
  1. 访问 imgbb.com
  2. 点击"Start uploading"上传图片
  3. 复制"Direct link"
  4. 粘贴到"封面图片URL"字段

#### 3. **Cloudinary**
- 网址：https://cloudinary.com
- 特点：专业、功能强大、有免费额度
- 需要注册账号

### 方法3：使用占位图服务

如果暂时没有图片，可以使用占位图服务：

#### Placeholder.com
```
https://via.placeholder.com/320x180/0047AB/FFFFFF?text=Your+Text
```

参数说明：
- `320x180` - 图片尺寸（宽x高）
- `0047AB` - 背景颜色（十六进制）
- `FFFFFF` - 文字颜色（十六进制）
- `text=Your+Text` - 显示的文字（用+代替空格）

示例：
```
https://via.placeholder.com/320x180/2E7D32/FFFFFF?text=React+Tutorial
https://via.placeholder.com/320x180/E65100/FFFFFF?text=TypeScript
https://via.placeholder.com/320x180/0047AB/FFFFFF?text=AI+Learning
```

### 方法4：从视频平台获取缩略图

#### YouTube视频
```
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```
或
```
https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
```

例如，视频链接是 `https://youtube.com/watch?v=dQw4w9WgXcQ`
缩略图URL就是：
```
https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
```

#### Bilibili视频
Bilibili的缩略图需要从视频页面获取，通常在视频播放器的封面上右键 → "复制图片地址"

---

## 🎨 推荐的图片尺寸

- **标准尺寸**：320 x 180 像素（16:9比例）
- **最小尺寸**：320 x 180 像素
- **最大尺寸**：1280 x 720 像素
- **文件格式**：JPG、PNG、WebP
- **文件大小**：建议 < 500KB

---

## 💡 图片选择建议

### 视频资源
- 使用视频的缩略图或关键帧
- 确保图片清晰，能代表视频内容
- 避免使用纯黑或纯白的图片

### 博客文章
- 使用文章的首图或配图
- 可以使用文章网站的favicon + 纯色背景
- 使用与主题相关的图标或插图

### GitHub项目
- 使用项目的README首图或Banner
- 使用项目Logo
- 使用代码截图或架构图

### 工具/网站
- 使用网站的截图
- 使用产品Logo
- 使用产品界面的关键截图

---

## 🔧 常见问题

### Q: 图片显示不出来怎么办？
A: 检查以下几点：
1. URL是否正确（以http://或https://开头）
2. 图片是否可以公开访问（不需要登录）
3. 图片服务器是否支持跨域访问
4. 尝试在浏览器新标签页直接打开URL

### Q: 图片加载很慢？
A: 可能的原因：
1. 图片文件太大（建议压缩到500KB以下）
2. 图床服务器在国外（考虑使用国内图床）
3. 网络问题

### Q: 可以上传本地图片吗？
A: 当前版本不支持直接上传本地图片，需要先上传到图床服务，然后使用图片URL。未来版本会添加本地上传功能。

### Q: 图片比例不对怎么办？
A: 资源卡片会自动裁剪图片为16:9比例（320x180），建议使用相同比例的图片以获得最佳效果。

### Q: 可以不添加封面图片吗？
A: 可以。如果不填写封面图片URL，系统会使用默认的占位图。

---

## 📝 示例

### 示例1：添加YouTube视频资源
```
标题：Deep Dive into React Hooks
链接：https://youtube.com/watch?v=dpw9EHDh2bM
封面图片URL：https://img.youtube.com/vi/dpw9EHDh2bM/maxresdefault.jpg
分类：编程
作者：Tech Channel
推荐语：深入讲解React Hooks的最佳实践
```

### 示例2：添加博客文章
```
标题：TypeScript Best Practices
链接：https://blog.example.com/typescript-best-practices
封面图片URL：https://via.placeholder.com/320x180/2E7D32/FFFFFF?text=TypeScript
分类：编程
作者：John Doe
推荐语：TypeScript开发必读文章
```

### 示例3：添加GitHub项目
```
标题：Awesome React Components
链接：https://github.com/example/awesome-react
封面图片URL：https://repository-images.githubusercontent.com/123456789/abc123
分类：编程
作者：awesome-react
推荐语：精选React组件库集合
```

---

## 🚀 未来功能

计划在未来版本中添加：

1. **本地图片上传**
   - 直接从电脑上传图片
   - 自动压缩和优化
   - 存储到云端

2. **自动获取封面**
   - 输入URL后自动抓取网页的og:image
   - 自动获取视频缩略图
   - 智能推荐封面图片

3. **图片编辑**
   - 裁剪和调整大小
   - 添加滤镜和效果
   - 添加文字和Logo

4. **图片库**
   - 保存常用图片
   - 图片分类管理
   - 快速选择历史图片

---

## 📚 相关资源

- [Imgur API文档](https://apidocs.imgur.com/)
- [Cloudinary文档](https://cloudinary.com/documentation)
- [YouTube缩略图API](https://developers.google.com/youtube/v3/docs/thumbnails)
- [图片优化指南](https://web.dev/fast/#optimize-your-images)

---

需要帮助？查看 [QUICK_TEST_CRUD.md](./QUICK_TEST_CRUD.md) 了解如何测试资源添加功能。
