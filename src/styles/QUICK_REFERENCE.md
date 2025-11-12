# 样式系统快速参考 🎨

## 颜色速查

| 用途 | Tailwind类 | CSS变量 | 值 |
|------|-----------|---------|-----|
| 主色调 | `bg-primary` `text-primary` | `var(--color-primary)` | #0047AB |
| 主色调悬停 | `bg-primary-hover` | `var(--color-primary-hover)` | #003580 |
| 主色调浅色 | `bg-primary-light` | `var(--color-primary-light)` | #E3F2FD |
| 主文本 | `text-text` | `var(--color-text)` | #333 |
| 次要文本 | `text-secondary` | `var(--color-secondary)` | #666 |
| 辅助文本 | `text-tertiary` | `var(--color-tertiary)` | #999 |
| 主背景 | `bg-background` | `var(--color-background)` | #FFFFFF |
| 次要背景 | `bg-background-secondary` | `var(--color-background-secondary)` | #F5F5F5 |
| 成功 | `text-success` | `var(--color-success)` | #2E7D32 |
| 错误 | `text-error` | `var(--color-error)` | #D32F2F |
| 警告 | `text-warning` | `var(--color-warning)` | #F57C00 |

## 字体速查

| 用途 | Tailwind类 | 大小 | 粗细 | 行高 |
|------|-----------|------|------|------|
| H1标题 | `text-h1` | 32px | 700 | 1.2 |
| H2标题 | `text-h2` | 24px | 600 | 1.3 |
| H3标题 | `text-h3` | 18px | 600 | 1.4 |
| 卡片标题 | `text-card-title` | 16px | 600 | 1.4 |
| 正文 | `text-body` | 16px | 400 | 1.6 |
| 次要文本 | `text-secondary` | 13px | 400 | 1.5 |
| 小文本 | `text-small` | 12px | 400 | 1.4 |

## 间距速查

| Tailwind类 | 值 | 用途 |
|-----------|-----|------|
| `p-xs` `m-xs` `gap-xs` | 4px | 超小间距 |
| `p-sm` `m-sm` `gap-sm` | 8px | 小间距 |
| `p-md` `m-md` `gap-md` | 16px | 中等间距 |
| `p-lg` `m-lg` `gap-lg` | 24px | 大间距 |
| `p-xl` `m-xl` `gap-xl` | 32px | 超大间距 |
| `p-xxl` `m-xxl` `gap-xxl` | 48px | 特大间距 |

## 圆角速查

| Tailwind类 | 值 | 用途 |
|-----------|-----|------|
| `rounded-small` | 4px | 标签 |
| `rounded-medium` | 6px | 按钮 |
| `rounded-card` | 8px | 卡片 |
| `rounded-large` | 12px | 大圆角 |

## 阴影速查

| Tailwind类 | 用途 |
|-----------|------|
| `shadow-card` | 卡片默认阴影 |
| `shadow-card-hover` | 卡片悬停阴影 |
| `shadow-modal` | 弹窗阴影 |

## 动画速查

### 过渡类
| 类名 | 用途 |
|------|------|
| `transition-fast` | 快速过渡 (200ms) |
| `transition-normal` | 正常过渡 (300ms) |
| `transition-slow` | 缓慢过渡 (500ms) |
| `transition-colors` | 颜色过渡 |
| `transition-transform` | 变换过渡 |
| `transition-opacity` | 透明度过渡 |

### 动画类
| 类名 | 效果 |
|------|------|
| `animate-fadeIn` | 淡入 |
| `animate-fadeOut` | 淡出 |
| `animate-slideInRight` | 从右滑入 |
| `animate-slideOutRight` | 向右滑出 |
| `animate-slideInLeft` | 从左滑入 |
| `animate-scaleIn` | 缩放进入 |
| `animate-scaleOut` | 缩放退出 |
| `animate-spin` | 旋转加载 |
| `animate-pulse` | 脉冲 |
| `animate-bounce` | 弹跳 |
| `card-hover` | 卡片悬停效果 |

## 工具类速查

| 类名 | 效果 |
|------|------|
| `text-ellipsis` | 单行文本截断 |
| `text-ellipsis-2` | 两行文本截断 |
| `text-ellipsis-3` | 三行文本截断 |
| `hide-scrollbar` | 隐藏滚动条 |
| `focus-ring` | 焦点轮廓 |
| `disabled` | 禁用状态 |

## 常用组合

### 主按钮
```jsx
className="bg-primary text-white px-lg py-sm rounded-medium transition-colors hover:bg-primary-hover"
```

### 次按钮
```jsx
className="bg-white text-primary border-2 border-primary px-lg py-sm rounded-medium transition-colors hover:bg-primary-light"
```

### 卡片
```jsx
className="bg-white rounded-card shadow-card p-md card-hover transition-normal"
```

### 标签
```jsx
className="inline-block px-sm py-xs bg-primary-light text-primary text-small rounded-small"
```

### 输入框
```jsx
className="w-full px-md py-sm border border-divider rounded-medium focus-ring transition-colors"
```

### 弹窗遮罩
```jsx
className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn"
```

### 弹窗内容
```jsx
className="bg-white rounded-card shadow-modal p-xl animate-scaleIn max-w-2xl w-full"
```

## 响应式前缀

| 前缀 | 断点 |
|------|------|
| `sm:` | ≥640px |
| `md:` | ≥768px |
| `lg:` | ≥1024px |
| `xl:` | ≥1280px |
| `2xl:` | ≥1536px |

## 状态前缀

| 前缀 | 状态 |
|------|------|
| `hover:` | 悬停 |
| `focus:` | 焦点 |
| `active:` | 激活 |
| `disabled:` | 禁用 |
| `group-hover:` | 组悬停 |

---

**提示**: 将此文件保存为书签，方便快速查找！
