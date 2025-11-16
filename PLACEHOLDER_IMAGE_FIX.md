# 占位图片加载问题修复

## 问题描述

应用中使用的 `via.placeholder.com` 服务无法连接（`ERR_CONNECTION_CLOSED`），导致：
1. 资源卡片的默认封面图无法加载
2. 编辑器中的图片预览失败时无法显示错误占位图
3. 控制台出现大量网络错误

## 根本原因

`via.placeholder.com` 是一个外部占位图服务，可能被墙或不稳定，导致无法访问。

## 解决方案

使用本地 SVG 生成的占位图替代外部服务。

### 已有工具

项目中已经存在 `src/utils/placeholderUtils.ts` 工具文件，提供了：
- `generatePlaceholder()` - 生成 SVG Data URL 格式的占位图
- `getPlaceholderByType()` - 根据资源类型生成占位图
- `PLACEHOLDER_COLORS` - 预定义的颜色方案

### 修复内容

#### 1. HomePage.tsx
- 导入 `generatePlaceholder` 函数
- 替换新资源的默认封面图：
  ```typescript
  cover: editorData.cover || generatePlaceholder({
      backgroundColor: '#0047AB',
      textColor: '#FFFFFF',
      text: 'New Resource'
  })
  ```

#### 2. EditorForm.tsx
- 导入 `generatePlaceholder` 函数
- 替换图片加载失败时的占位图：
  ```typescript
  onError={(e) => {
      (e.target as HTMLImageElement).src = generatePlaceholder({
          backgroundColor: '#E0E0E0',
          textColor: '#666666',
          text: '图片加载失败'
      });
  }}
  ```

## 优势

1. **无依赖外部服务**：完全本地生成，不受网络影响
2. **即时加载**：SVG Data URL 无需网络请求
3. **可定制**：可以自定义颜色、文字、尺寸
4. **轻量级**：SVG 格式体积小
5. **可靠性高**：不会出现连接失败的情况

## 工作原理

`generatePlaceholder()` 函数：
1. 创建一个 SVG 字符串，包含矩形背景和居中文字
2. 将 SVG 编码为 URL 安全的格式
3. 返回 `data:image/svg+xml,` 格式的 Data URL
4. 浏览器可以直接将其作为图片源使用

## 数据迁移

为了处理已存储在 LocalStorage 中的旧资源数据，创建了迁移工具：

### migratePlaceholderImages.ts
- `migrateResourceCover()` - 迁移单个资源的封面图
- `migrateResources()` - 迁移资源数组
- `migrateLocalStorageResources()` - 从 LocalStorage 迁移数据

### 自动迁移
在 `main.tsx` 中，应用启动时会自动运行迁移：
```typescript
// 迁移旧的占位图 URL
migrateLocalStorageResources();
```

这会：
1. 读取 LocalStorage 中的资源数据
2. 检查每个资源的 `cover` 字段
3. 如果包含 `via.placeholder.com`，替换为本地 SVG 占位图
4. 根据资源类型选择合适的颜色
5. 保存更新后的数据

## 测试验证

修复后：
1. 新建资源时，如果不提供封面图，会显示蓝色背景的 "New Resource" 占位图
2. 编辑器中图片加载失败时，会显示灰色背景的 "图片加载失败" 占位图
3. 已存在的资源会自动迁移到新的占位图格式
4. 不再出现 `via.placeholder.com` 的网络错误

## 其他使用 via.placeholder.com 的文件

以下文件仍在使用 `via.placeholder.com`，但它们是测试文件，不影响生产环境：
- `src/App.tsx` - 示例数据
- `src/pages/GistServiceTest.tsx` - 测试页面
- `src/pages/MarkdownEditorTest.tsx` - 测试页面

如需修复，可以使用相同的方法替换。

## 扩展使用

如果需要为不同类型的资源生成不同颜色的占位图，可以使用：

```typescript
import { getPlaceholderByType } from '@/utils/placeholderUtils';

// 根据资源类型自动选择颜色
const cover = getPlaceholderByType('youtube_video', 'Video Title');
```

支持的类型：
- `youtube_video` - 红色 (#FF0000)
- `bilibili_video` - 青色 (#00A1D6)
- `blog` - 绿色 (#2E7D32)
- `github` - 深灰 (#24292E)
- `reddit` - 橙红 (#FF4500)
- `tool` - 灰色 (#607D8B)
