# YouTube 视频封面集成测试指南

## 功能概述

现在系统已经集成了 YouTube 视频封面自动获取功能，支持：
1. 在编辑器中手动点击"自动获取"按钮
2. 保存资源时自动获取（如果没有提供封面）

## 测试步骤

### 测试 1：手动获取封面

1. **打开资源编辑器**
   - 点击主页的"添加资源"按钮

2. **填写基本信息**
   - 输入标题（必填）
   - 输入视频 URL（必填），例如：
     ```
     https://www.youtube.com/watch?v=dQw4w9WgXcQ
     ```

3. **选择视频类型**
   - 在"类型"下拉菜单中选择"YouTube 视频"或"Bilibili 视频"
   - ⚠️ **重要**：必须先输入 URL 并选择视频类型，按钮才会显示

4. **点击自动获取**
   - 在"封面图片URL"字段旁边会出现"自动获取"按钮
   - 点击按钮，封面 URL 会自动填充

5. **验证结果**
   - 封面 URL 应该类似：`https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`
   - 下方的预览图应该显示 YouTube 视频缩略图

### 测试 2：自动获取封面（保存时）

1. **创建视频资源**
   - 输入标题（必填）
   - 输入 YouTube URL（必填）
   - 在"类型"下拉菜单中选择"YouTube 视频"
   - **不填写**封面图片 URL（留空）

2. **保存资源**
   - 点击"保存"按钮

3. **验证结果**
   - 资源应该成功保存
   - 在资源列表中，该资源应该显示 YouTube 视频的缩略图
   - 系统会自动从 YouTube 获取封面

### 测试 3：支持的 URL 格式

测试以下 YouTube URL 格式：

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/watch?v=VIDEO_ID&feature=xxx
```

### 测试 4：错误处理

1. **无效 URL**
   - 输入无效的 YouTube URL
   - 点击"自动获取"
   - 应该显示红色的 YouTube 占位图

2. **空 URL**
   - 不输入 URL
   - "自动获取"按钮应该被禁用

## 预期行为

### 成功情况
- ✅ 自动提取视频 ID
- ✅ 生成正确的缩略图 URL
- ✅ 预览图正常显示
- ✅ 保存后资源卡片显示缩略图

### 错误情况
- ✅ 无效 URL 显示占位图
- ✅ 网络错误时显示占位图
- ✅ 按钮状态正确（禁用/启用）

## UI 改进

### 资源类型选择器
- 新增"类型"下拉菜单，包含以下选项：
  - 博客文章
  - YouTube 视频
  - Bilibili 视频
  - GitHub 仓库
  - 工具
  - Reddit 帖子

### 自动获取按钮
- 只在选择视频类型（YouTube/Bilibili）且输入 URL 后显示
- 按钮样式：次要按钮，高度与输入框对齐
- 文字："自动获取"
- 按钮位置：封面输入框右侧

### 视觉反馈
- 点击按钮后立即更新封面 URL
- 预览图实时更新
- 如果获取失败，显示占位图

## 技术实现

### EditorForm.tsx 改动
1. 导入 `getVideoThumbnail` 和 `Button`
2. 添加 `resourceTypeOptions` 资源类型选项
3. 添加资源类型选择器（Dropdown）
4. 添加 `handleAutoFetchCover` 函数
5. 在封面输入字段旁添加"自动获取"按钮
6. 条件显示按钮（仅视频类型且有 URL）

### HomePage.tsx 改动
1. 导入 `getVideoThumbnail`
2. 在保存前检查是否需要自动获取封面
3. 使用用户选择的资源类型

## 相关文件

- `src/utils/videoThumbnailUtils.ts` - 核心工具函数
- `src/components/editor/EditorForm.tsx` - 编辑器界面
- `src/pages/HomePage.tsx` - 资源保存逻辑
- `YOUTUBE_THUMBNAIL_GUIDE.md` - 详细使用指南

## 扩展功能

### 未来可以添加：
1. **质量选择**：让用户选择缩略图质量
2. **批量获取**：支持批量导入视频并自动获取封面
3. **Bilibili 支持**：实现 Bilibili API 调用获取真实缩略图
4. **其他平台**：支持更多视频平台

### 示例代码

```typescript
// 手动获取封面
const handleAutoFetchCover = () => {
    if (data.url && data.type === 'youtube_video') {
        const thumbnail = getVideoThumbnail(data.url, 'youtube_video');
        updateField('cover', thumbnail);
    }
};

// 自动获取封面（保存时）
let cover = editorData.cover;
if (!cover && editorData.type === 'youtube_video' && editorData.url) {
    cover = getVideoThumbnail(editorData.url, 'youtube_video');
}
```

## 测试用例

| 测试场景 | 输入 | 预期输出 |
|---------|------|---------|
| 标准 YouTube URL | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg` |
| 短链接 | `https://youtu.be/dQw4w9WgXcQ` | `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg` |
| 无效 URL | `https://invalid-url.com` | 红色 YouTube 占位图 |
| 空 URL | `` | 按钮禁用 |

现在你可以测试 YouTube 视频封面的自动获取功能了！
