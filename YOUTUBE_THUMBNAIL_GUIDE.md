# YouTube 视频缩略图加载指南

## 概述

当你添加 YouTube 视频资源时，系统可以自动从 YouTube 获取视频的缩略图作为封面图。

## 使用方法

### 方法 1：自动获取（推荐）

在添加资源时，如果 URL 是 YouTube 视频链接，可以使用 `getYouTubeThumbnail()` 函数自动获取缩略图：

```typescript
import { getYouTubeThumbnail } from '@/utils/videoThumbnailUtils';

// YouTube 视频 URL
const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// 获取缩略图（默认高质量）
const thumbnail = getYouTubeThumbnail(videoUrl);
// 返回: https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg
```

### 方法 2：指定质量

YouTube 提供多种质量的缩略图：

```typescript
// 默认质量 (120x90)
const defaultThumb = getYouTubeThumbnail(videoUrl, 'default');

// 中等质量 (320x180) - 适合卡片显示
const mediumThumb = getYouTubeThumbnail(videoUrl, 'medium');

// 高质量 (480x360) - 推荐使用
const highThumb = getYouTubeThumbnail(videoUrl, 'high');

// 标准质量 (640x480)
const standardThumb = getYouTubeThumbnail(videoUrl, 'standard');

// 最高质量 (1280x720) - 不是所有视频都有
const maxresThumb = getYouTubeThumbnail(videoUrl, 'maxres');
```

### 方法 3：通用视频缩略图

使用 `getVideoThumbnail()` 函数可以自动识别视频类型：

```typescript
import { getVideoThumbnail } from '@/utils/videoThumbnailUtils';

// 自动识别 YouTube
const ytThumb = getVideoThumbnail('https://www.youtube.com/watch?v=xxx');

// 自动识别 Bilibili
const biliThumb = getVideoThumbnail('https://www.bilibili.com/video/BVxxx');
```

## 支持的 URL 格式

### YouTube

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID&feature=xxx`

### Bilibili

- `https://www.bilibili.com/video/BVxxx`
- `https://www.bilibili.com/video/avxxx`

## 在 HomePage 中集成

修改 `HomePage.tsx` 中的 `handleSaveResource` 函数：

```typescript
import { getVideoThumbnail } from '@/utils/videoThumbnailUtils';

const handleSaveResource = async () => {
    // ... 其他代码

    // 如果是视频类型且没有提供封面，自动获取
    let cover = editorData.cover;
    if (!cover && (editorData.type === 'youtube_video' || editorData.type === 'bilibili_video')) {
        cover = getVideoThumbnail(editorData.url, editorData.type);
    }

    const newResource: Omit<Resource, 'id' | 'created_at' | 'updated_at'> = {
        title: editorData.title,
        url: editorData.url,
        type: editorData.type || 'blog',
        cover: cover || generatePlaceholder({
            backgroundColor: '#0047AB',
            textColor: '#FFFFFF',
            text: 'New Resource'
        }),
        // ... 其他字段
    };

    await addResource(newResource);
};
```

## 在 EditorForm 中添加自动获取按钮

可以在编辑器表单中添加一个"自动获取封面"按钮：

```typescript
// 在 EditorForm.tsx 中
import { getVideoThumbnail } from '@/utils/videoThumbnailUtils';

const handleAutoFetchCover = () => {
    if (data.url && (type === 'youtube_video' || type === 'bilibili_video')) {
        const thumbnail = getVideoThumbnail(data.url, type);
        onChange({ ...data, cover: thumbnail });
    }
};

// 在表单中添加按钮
<div className="flex gap-2">
    <Input
        label="封面图片URL"
        value={data.cover || ''}
        onChange={(e) => updateField('cover', e.target.value)}
        placeholder="https://example.com/image.jpg"
        fullWidth
    />
    {(type === 'youtube_video' || type === 'bilibili_video') && (
        <Button
            variant="secondary"
            onClick={handleAutoFetchCover}
            className="whitespace-nowrap"
        >
            自动获取
        </Button>
    )}
</div>
```

## 示例：完整流程

1. 用户点击"添加资源"
2. 选择类型为"YouTube 视频"
3. 输入 YouTube URL：`https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. 点击"自动获取"按钮（或保存时自动获取）
5. 系统自动填充封面图 URL：`https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`
6. 保存资源

## 优势

1. **无需手动查找**：自动从 YouTube 获取官方缩略图
2. **多种质量选择**：根据需要选择不同分辨率
3. **可靠性高**：YouTube 缩略图服务稳定
4. **无需 API Key**：直接使用公开的缩略图 URL
5. **即时加载**：缩略图由 YouTube CDN 提供，加载快速

## 注意事项

1. **YouTube 缩略图**：
   - 所有公开视频都有缩略图
   - `maxres` 质量不是所有视频都有，建议使用 `high`
   - 缩略图 URL 格式固定，无需 API 调用

2. **Bilibili 缩略图**：
   - 需要调用 Bilibili API 才能获取真实缩略图
   - 当前实现返回占位图
   - 如需真实缩略图，需要实现 API 调用

3. **错误处理**：
   - 如果 URL 格式不正确，会返回占位图
   - 如果视频被删除，缩略图可能无法加载
   - 建议在图片组件中添加 `onError` 处理

## 测试

```typescript
// 测试 YouTube 缩略图提取
import { getYouTubeThumbnail, extractYouTubeVideoId } from '@/utils/videoThumbnailUtils';

// 测试视频 ID 提取
console.log(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
// 输出: dQw4w9WgXcQ

// 测试缩略图 URL
console.log(getYouTubeThumbnail('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
// 输出: https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg
```

## 相关文件

- `src/utils/videoThumbnailUtils.ts` - 视频缩略图工具函数
- `src/utils/placeholderUtils.ts` - 占位图生成工具
- `src/pages/HomePage.tsx` - 资源添加逻辑
- `src/components/editor/EditorForm.tsx` - 编辑器表单
