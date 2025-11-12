# 性能优化文档

本文档记录了项目中实施的性能优化措施。

## 🎯 优化目标

1. 减少不必要的组件重渲染
2. 优化大列表渲染性能
3. 减少初始加载时间
4. 优化图片加载
5. 代码分割和懒加载

## ✅ 已实施的优化

### 1. React.memo 优化

使用React.memo包装纯组件，避免不必要的重渲染：

```tsx
// 优化前
export const MyComponent = ({ data }) => {
  return <div>{data}</div>;
};

// 优化后
export const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

**已优化的组件：**
- ResourceCard及其子组件（VideoCard, BlogCard, GitHubCard等）
- QuestionItem
- SubQuestion
- TimelineAnswer
- Toast
- ErrorMessage
- EmptyState
- LoadingState组件

### 2. useMemo 优化

缓存计算结果，避免重复计算：

```tsx
// 优化前
const filteredData = data.filter(item => item.active);

// 优化后
const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
);
```

**已优化的场景：**
- 资源列表筛选
- 问题列表筛选
- 搜索结果计算
- 分类标签列表

### 3. useCallback 优化

缓存回调函数，避免子组件不必要的重渲染：

```tsx
// 优化前
const handleClick = (id) => {
  doSomething(id);
};

// 优化后
const handleClick = useCallback((id) => {
  doSomething(id);
}, []);
```

**已优化的场景：**
- 事件处理函数
- 传递给子组件的回调
- Context中的方法

### 4. 图片懒加载

使用原生lazy loading和Intersection Observer：

```tsx
// 使用原生lazy loading
<img src={url} loading="lazy" alt={alt} />

// 使用自定义LazyImage组件
<LazyImage src={url} alt={alt} />
```

**已优化的组件：**
- ResourceCard中的封面图
- 用户头像
- Markdown中的图片

### 5. 代码分割

使用React.lazy和Suspense进行路由级代码分割：

```tsx
// 优化前
import HomePage from './pages/HomePage';

// 优化后
const HomePage = React.lazy(() => import('./pages/HomePage'));

<Suspense fallback={<LoadingState />}>
  <HomePage />
</Suspense>
```

**已分割的路由：**
- 测试页面（ErrorHandlingTest, NotificationTest等）
- 非关键页面

### 6. 虚拟滚动

对于长列表使用虚拟滚动（如果需要）：

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ResourceCard resource={items[index]} />
    </div>
  )}
</FixedSizeList>
```

**注意：** 当前项目资源数量较少，暂未实施虚拟滚动。如果资源超过100个，建议启用。

## 📊 性能指标

### 优化前
- 首次内容绘制(FCP): ~1.5s
- 最大内容绘制(LCP): ~2.5s
- 首次输入延迟(FID): ~100ms
- 累积布局偏移(CLS): ~0.1

### 优化后（目标）
- 首次内容绘制(FCP): <1.0s
- 最大内容绘制(LCP): <2.0s
- 首次输入延迟(FID): <50ms
- 累积布局偏移(CLS): <0.05

## 🔧 优化建议

### 1. 组件优化原则

**何时使用React.memo：**
- 组件接收相同props时渲染结果相同
- 组件渲染频繁
- 组件渲染成本较高

**何时使用useMemo：**
- 计算成本高
- 依赖项变化不频繁
- 结果被多次使用

**何时使用useCallback：**
- 函数作为props传递给子组件
- 函数作为useEffect的依赖
- 函数在memo组件中使用

### 2. 避免过度优化

```tsx
// ❌ 不必要的优化
const simpleValue = useMemo(() => a + b, [a, b]);

// ✅ 简单计算不需要memo
const simpleValue = a + b;
```

### 3. 正确的依赖项

```tsx
// ❌ 错误：缺少依赖项
const memoValue = useMemo(() => data.filter(item => item.id === id), [data]);

// ✅ 正确：包含所有依赖项
const memoValue = useMemo(() => data.filter(item => item.id === id), [data, id]);
```

## 🚀 未来优化计划

### 1. Service Worker
- 实现离线缓存
- 预缓存关键资源
- 后台同步

### 2. 图片优化
- 使用WebP格式
- 响应式图片
- 图片CDN

### 3. 打包优化
- 分析bundle大小
- 移除未使用的代码
- 优化第三方库

### 4. 数据获取优化
- 实现数据预取
- 使用SWR或React Query
- 优化API调用

## 📝 性能监控

### 开发环境
使用React DevTools Profiler监控组件渲染：

```tsx
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### 生产环境
使用Web Vitals监控：

```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔍 性能检查清单

- [ ] 所有列表组件使用key prop
- [ ] 大型组件使用React.memo
- [ ] 昂贵计算使用useMemo
- [ ] 回调函数使用useCallback
- [ ] 图片使用lazy loading
- [ ] 路由使用代码分割
- [ ] 避免在渲染中创建新对象/数组
- [ ] 使用生产构建部署
- [ ] 启用gzip压缩
- [ ] 使用CDN加速静态资源

## 📚 参考资源

- [React性能优化](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**最后更新**: 2024-01-XX  
**维护者**: 开发团队
