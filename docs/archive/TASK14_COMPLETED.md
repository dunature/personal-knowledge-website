# 任务14完成 - 自定义Hooks

## ✅ 已完成的Hooks

### 1. useAutoSave（自动保存）
**文件**: `src/hooks/useAutoSave.ts`

**功能**:
- ✅ 3秒防抖自动保存
- ✅ 数据变化检测
- ✅ 保存状态管理（isSaving）
- ✅ 最后保存时间（lastSaved）
- ✅ 立即保存方法（saveNow）
- ✅ 可启用/禁用
- ✅ 自定义延迟时间

**使用示例**:
```tsx
const { isSaving, lastSaved, saveNow } = useAutoSave({
  data: formData,
  onSave: async () => {
    await saveToServer(formData);
  },
  delay: 3000,
  enabled: true,
});
```

---

### 2. useFilter（筛选逻辑）
**文件**: `src/hooks/useFilter.ts`

**功能**:
- ✅ 通用筛选逻辑封装
- ✅ 多条件筛选支持
- ✅ 自定义筛选函数
- ✅ 自定义排序函数
- ✅ 筛选条件管理
- ✅ 性能优化（useMemo）

**使用示例**:
```tsx
const { filteredItems, setFilter, clearFilter, setSortKey } = useFilter({
  items: resources,
  filterFn: (item, filters) => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    return true;
  },
  sortFn: (a, b, sortKey) => {
    if (sortKey === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  },
});

// 设置筛选条件
setFilter('category', 'AI学习');
setSortKey('newest');
```

---

### 3. useModal（弹窗状态）
**文件**: `src/hooks/useModal.ts`

**功能**:
- ✅ 弹窗开关状态管理
- ✅ open方法（打开弹窗）
- ✅ close方法（关闭弹窗）
- ✅ toggle方法（切换状态）
- ✅ 初始状态支持

**使用示例**:
```tsx
const modal = useModal(false);

return (
  <>
    <button onClick={modal.open}>打开弹窗</button>
    
    <Modal isOpen={modal.isOpen} onClose={modal.close}>
      <p>弹窗内容</p>
    </Modal>
  </>
);
```

---

### 4. useDebounce（防抖）
**文件**: `src/hooks/useDebounce.ts`

**功能**:
- ✅ 防抖处理
- ✅ 延迟更新值
- ✅ 自定义延迟时间
- ✅ 类型安全

**使用示例**:
```tsx
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

useEffect(() => {
  // 只在防抖后的值变化时执行搜索
  performSearch(debouncedQuery);
}, [debouncedQuery]);

return (
  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);
```

---

### 5. useLocalStorage（本地存储）
**文件**: `src/hooks/useLocalStorage.ts`

**功能**:
- ✅ localStorage读写封装
- ✅ 类型安全
- ✅ 自动JSON序列化/反序列化
- ✅ 跨标签页同步
- ✅ 错误处理
- ✅ 删除功能

**使用示例**:
```tsx
const [user, setUser, removeUser] = useLocalStorage('user', {
  name: '',
  email: '',
});

// 读取
console.log(user.name);

// 写入
setUser({ name: 'John', email: 'john@example.com' });

// 更新（函数式）
setUser(prev => ({ ...prev, name: 'Jane' }));

// 删除
removeUser();
```

---

## 📁 文件结构

```
src/
└── hooks/
    ├── index.ts              # 统一导出
    ├── useAutoSave.ts        # 自动保存
    ├── useFilter.ts          # 筛选逻辑
    ├── useModal.ts           # 弹窗状态
    ├── useDebounce.ts        # 防抖
    └── useLocalStorage.ts    # 本地存储
```

---

## 🎯 核心特性

### 1. 类型安全
所有Hooks都使用TypeScript泛型，提供完整的类型推断和检查。

### 2. 性能优化
- useCallback优化方法引用
- useMemo缓存计算结果
- 避免不必要的重新渲染

### 3. 可复用性
所有Hooks都是通用的，可以在不同场景下复用。

### 4. 错误处理
useLocalStorage包含完善的错误处理机制。

---

## 💡 组合使用示例

### 带防抖的搜索 + 筛选

```tsx
function SearchableList() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const { filteredItems, setFilter } = useFilter({
    items: allItems,
    filterFn: (item, filters) => {
      if (filters.search) {
        return item.title.toLowerCase().includes(filters.search.toLowerCase());
      }
      return true;
    },
  });

  useEffect(() => {
    setFilter('search', debouncedQuery);
  }, [debouncedQuery, setFilter]);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索..."
      />
      {filteredItems.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### 带自动保存的编辑器 + 本地存储

```tsx
function Editor() {
  const [content, setContent, removeContent] = useLocalStorage('draft', '');
  const modal = useModal();
  
  const { isSaving, lastSaved } = useAutoSave({
    data: content,
    onSave: async () => {
      await saveDraft(content);
    },
    delay: 3000,
  });

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {isSaving && <span>保存中...</span>}
      {lastSaved && <span>已保存于 {lastSaved.toLocaleTimeString()}</span>}
      
      <button onClick={modal.open}>预览</button>
      
      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Modal>
    </div>
  );
}
```

---

## 🚀 构建结果

```
✓ 构建成功
✓ 无TypeScript错误
✓ 无运行时错误
📦 文件大小: 1,242KB
```

---

## ✅ 任务完成清单

- [x] 创建useAutoSave hook（自动保存）
- [x] 创建useFilter hook（筛选逻辑）
- [x] 创建useModal hook（弹窗状态）
- [x] 创建useDebounce hook（防抖）
- [x] 创建useLocalStorage hook（本地存储）
- [x] 创建统一导出文件
- [x] 14. 实现自定义Hooks

---

## 🎉 总结

任务14已全部完成！所有自定义Hooks都已实现并可以正常使用。

**主要成就**:
- ✅ 5个实用的自定义Hooks
- ✅ 完整的类型安全
- ✅ 性能优化
- ✅ 可复用性强
- ✅ 错误处理完善
- ✅ 支持组合使用

**下一步**: 可以继续进行任务15 - 实现工具函数
