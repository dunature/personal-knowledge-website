# 样式系统文档

本项目使用 Tailwind CSS + CSS 变量的混合样式系统，提供一致的设计语言和可维护的样式代码。

## 📁 文件结构

```
src/
├── index.css              # 全局样式、CSS变量、动画
└── styles/
    └── README.md          # 本文档
```

## 🎨 颜色系统

### 主要颜色
```css
--color-primary: #0047AB          /* 主色调 - 蓝色 */
--color-primary-hover: #003580    /* 主色调悬停 */
--color-primary-light: #E3F2FD    /* 主色调浅色 */
```

### 文本颜色
```css
--color-text: #333                /* 主文本 */
--color-text-light: #555          /* 次要文本 */
--color-secondary: #666           /* 辅助文本 */
--color-tertiary: #999            /* 三级文本 */
```

### 背景颜色
```css
--color-background: #FFFFFF       /* 主背景 */
--color-background-secondary: #F5F5F5  /* 次要背景 */
--color-background-hover: #EEEEEE /* 悬停背景 */
```

### 状态颜色
```css
--color-success: #2E7D32          /* 成功 - 绿色 */
--color-error: #D32F2F            /* 错误 - 红色 */
--color-warning: #F57C00          /* 警告 - 橙色 */
--color-divider: #E0E0E0          /* 分隔线 */
```

### Tailwind 使用
```jsx
<div className="bg-primary text-white">主色调背景</div>
<div className="text-secondary">辅助文本</div>
<div className="bg-background-secondary">次要背景</div>
```

## 📏 字体系统

### 字体大小
```css
--font-size-h1: 32px              /* 一级标题 */
--font-size-h2: 24px              /* 二级标题 */
--font-size-h3: 18px              /* 三级标题 */
--font-size-card-title: 16px      /* 卡片标题 */
--font-size-body: 16px            /* 正文 */
--font-size-secondary: 13px       /* 次要文本 */
--font-size-small: 12px           /* 小文本 */
```

### 字体粗细
```css
--font-weight-bold: 700           /* 粗体 */
--font-weight-semibold: 600       /* 半粗体 */
--font-weight-normal: 400         /* 正常 */
```

### 行高
```css
--line-height-tight: 1.2          /* 紧凑 */
--line-height-normal: 1.4         /* 正常 */
--line-height-relaxed: 1.6        /* 宽松 */
```

### Tailwind 使用
```jsx
<h1 className="text-h1">一级标题</h1>
<h2 className="text-h2">二级标题</h2>
<p className="text-body">正文内容</p>
<span className="text-small text-secondary">小文本</span>
```

## 📐 间距系统

```css
--spacing-xs: 4px                 /* 超小间距 */
--spacing-sm: 8px                 /* 小间距 */
--spacing-md: 16px                /* 中等间距 */
--spacing-lg: 24px                /* 大间距 */
--spacing-xl: 32px                /* 超大间距 */
--spacing-xxl: 48px               /* 特大间距 */
```

### Tailwind 使用
```jsx
<div className="p-md">内边距 16px</div>
<div className="m-lg">外边距 24px</div>
<div className="gap-sm">间隙 8px</div>
```

## 🔲 圆角系统

```css
--radius-small: 4px               /* 小圆角 - 标签 */
--radius-medium: 6px              /* 中圆角 - 按钮 */
--radius-card: 8px                /* 卡片圆角 */
--radius-large: 12px              /* 大圆角 */
```

### Tailwind 使用
```jsx
<div className="rounded-small">小圆角</div>
<button className="rounded-medium">按钮</button>
<div className="rounded-card">卡片</div>
```

## 🌑 阴影系统

```css
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1)
--shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.15)
--shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.2)
```

### Tailwind 使用
```jsx
<div className="shadow-card">卡片阴影</div>
<div className="shadow-card-hover">悬停阴影</div>
<div className="shadow-modal">弹窗阴影</div>
```

## ⏱️ 动画系统

### 动画时长
```css
--duration-fast: 200ms            /* 快速 - 颜色变化 */
--duration-normal: 300ms          /* 正常 - 大多数动画 */
--duration-slow: 500ms            /* 缓慢 - 复杂动画 */
```

### 缓动函数
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)        /* 进入 */
--ease-out: cubic-bezier(0, 0, 0.2, 1)       /* 退出 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  /* 进入退出 */
```

### 过渡工具类
```jsx
<div className="transition-fast">快速过渡</div>
<div className="transition-normal">正常过渡</div>
<div className="transition-colors">颜色过渡</div>
<div className="transition-transform">变换过渡</div>
<div className="transition-opacity">透明度过渡</div>
```

### 预定义动画

#### 淡入淡出
```jsx
<div className="animate-fadeIn">淡入</div>
<div className="animate-fadeOut">淡出</div>
```

#### 滑动
```jsx
<div className="animate-slideInRight">从右滑入</div>
<div className="animate-slideOutRight">向右滑出</div>
<div className="animate-slideInLeft">从左滑入</div>
```

#### 缩放
```jsx
<div className="animate-scaleIn">缩放进入</div>
<div className="animate-scaleOut">缩放退出</div>
```

#### 加载动画
```jsx
<div className="animate-spin">旋转加载</div>
<div className="animate-pulse">脉冲</div>
<div className="animate-bounce">弹跳</div>
```

### 卡片悬停效果
```jsx
<div className="card-hover">
  {/* 悬停时上浮 4px 并增强阴影 */}
</div>
```

## 🛠️ 工具类

### 文本截断
```jsx
<div className="text-ellipsis">单行截断...</div>
<div className="text-ellipsis-2">两行截断...</div>
<div className="text-ellipsis-3">三行截断...</div>
```

### 隐藏滚动条
```jsx
<div className="hide-scrollbar overflow-auto">
  {/* 内容可滚动但不显示滚动条 */}
</div>
```

### 焦点样式
```jsx
<button className="focus-ring">
  {/* 获得焦点时显示蓝色轮廓 */}
</button>
```

### 禁用状态
```jsx
<button className="disabled">
  {/* 半透明且不可点击 */}
</button>
```

## 🎯 使用示例

### 卡片组件
```jsx
<div className="
  bg-white 
  rounded-card 
  shadow-card 
  p-md 
  card-hover
  transition-normal
">
  <h3 className="text-card-title text-primary mb-sm">卡片标题</h3>
  <p className="text-body text-secondary">卡片内容</p>
</div>
```

### 按钮组件
```jsx
<button className="
  bg-primary 
  text-white 
  px-lg 
  py-sm 
  rounded-medium 
  transition-colors
  hover:bg-primary-hover
">
  点击按钮
</button>
```

### 标签组件
```jsx
<span className="
  inline-block 
  px-sm 
  py-xs 
  bg-primary-light 
  text-primary 
  text-small 
  rounded-small
">
  标签
</span>
```

### 弹窗组件
```jsx
<div className="
  fixed 
  inset-0 
  bg-black/50 
  flex 
  items-center 
  justify-center
  animate-fadeIn
">
  <div className="
    bg-white 
    rounded-card 
    shadow-modal 
    p-xl 
    animate-scaleIn
  ">
    弹窗内容
  </div>
</div>
```

## 📱 响应式设计

虽然项目设置了最小宽度 1200px，但仍可使用 Tailwind 的响应式前缀：

```jsx
<div className="
  p-md 
  md:p-lg 
  lg:p-xl
">
  响应式内边距
</div>
```

## 🎨 自定义滚动条

全局滚动条样式已定义：
- 宽度：8px
- 轨道：浅灰色 (#F5F5F5)
- 滑块：主色调 (#0047AB)
- 悬停：深蓝色 (#003580)

## 💡 最佳实践

### 1. 优先使用 Tailwind 类
```jsx
// ✅ 推荐
<div className="bg-primary text-white p-md rounded-card">

// ❌ 避免
<div style={{ backgroundColor: '#0047AB', color: 'white' }}>
```

### 2. 使用 CSS 变量保持一致性
```css
/* ✅ 推荐 */
.custom-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
}

/* ❌ 避免 */
.custom-component {
  color: #0047AB;
  padding: 16px;
}
```

### 3. 使用预定义动画
```jsx
// ✅ 推荐
<div className="animate-fadeIn">

// ❌ 避免
<div style={{ animation: 'fadeIn 0.3s ease-out' }}>
```

### 4. 组合工具类
```jsx
// ✅ 推荐 - 清晰易读
<div className="
  flex 
  items-center 
  gap-sm 
  p-md 
  bg-white 
  rounded-card 
  shadow-card
">

// ❌ 避免 - 难以阅读
<div className="flex items-center gap-sm p-md bg-white rounded-card shadow-card">
```

## 🔄 更新日志

- **v1.0.0** - 初始样式系统
  - 完整的颜色系统
  - 字体和间距系统
  - 动画和过渡
  - 工具类

---

**维护者**: 开发团队  
**最后更新**: 2025-01-XX
