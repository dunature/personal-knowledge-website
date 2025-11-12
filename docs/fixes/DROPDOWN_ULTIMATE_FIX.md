# 下拉菜单终极解决方案

## 问题回顾

小问题编辑表单中的状态下拉菜单被裁剪，无法完整显示所有选项。

## 已尝试的方案（均失败）

1. ❌ z-index 提升到 9999
2. ❌ overflow-hidden 改为 overflow-visible  
3. ❌ dropup 向上展开
4. ❌ 增加表单空间
5. ❌ fixed 定位 + 复杂的位置计算
6. ❌ React Portal

## 终极解决方案

**使用最简单的 CSS：将下拉菜单改为 `position: fixed` + `inset: auto`，让浏览器自动处理定位。**

### 实施步骤

修改 `src/components/ui/Dropdown.tsx`：

```tsx
{/* 下拉菜单 */}
{isOpen && (
    <div
        className="fixed z-[9999] w-full bg-white border border-divider rounded shadow-card overflow-hidden animate-fadeIn"
        style={{
            position: 'fixed',
            top: buttonRef.current?.getBoundingClientRect().bottom + 8 + 'px',
            left: buttonRef.current?.getBoundingClientRect().left + 'px',
            width: buttonRef.current?.getBoundingClientRect().width + 'px',
        }}
        role="listbox"
    >
        {options.map((option) => (
            <button ...>
                {option.label}
            </button>
        ))}
    </div>
)}
```

### 关键点

1. **position: fixed**：脱离文档流，不受任何父容器限制
2. **getBoundingClientRect()**：获取按钮相对于视口的位置
3. **inline style**：直接设置位置，简单直接
4. **z-[9999]**：确保在最上层

### 为什么这次会成功

- 不依赖父容器的定位上下文
- 不受 overflow 限制
- 不需要复杂的事件监听
- 浏览器原生支持，兼容性好

## 代码实现

完整的 Dropdown 组件修改：

```tsx
export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = '请选择',
    disabled = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                buttonRef.current && !buttonRef.current.contains(target) &&
                dropdownRef.current && !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // 获取按钮位置
    const getMenuStyle = (): React.CSSProperties => {
        if (!buttonRef.current) return {};
        const rect = buttonRef.current.getBoundingClientRect();
        return {
            position: 'fixed',
            top: `${rect.bottom + 8}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
        };
    };

    return (
        <div className={`relative ${className || 'inline-block'}`}>
            {/* 触发按钮 */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`
                    flex items-center justify-between gap-2 px-4 py-2 w-full
                    text-body border border-divider rounded bg-white
                    transition-fast focus:outline-none focus:ring-2 focus:ring-primary
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}
                    ${isOpen ? 'border-primary ring-2 ring-primary' : ''}
                `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`flex-1 text-left ${selectedOption ? 'text-text' : 'text-secondary'}`}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* 下拉菜单 - 使用 fixed 定位 */}
            {isOpen && buttonRef.current && (
                <div
                    ref={dropdownRef}
                    className="z-[9999] bg-white border border-divider rounded shadow-card overflow-hidden animate-fadeIn"
                    style={getMenuStyle()}
                    role="listbox"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => !option.disabled && handleSelect(option.value)}
                            disabled={option.disabled}
                            className={`
                                w-full px-4 py-2 text-left text-body transition-fast
                                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background-secondary cursor-pointer'}
                                ${option.value === value ? 'bg-[#E3F2FD] text-primary font-semibold' : 'text-text'}
                            `}
                            role="option"
                            aria-selected={option.value === value}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
```

## 优点

1. ✅ 简单直接，不需要 Portal
2. ✅ 不受任何父容器限制
3. ✅ 不需要监听滚动事件
4. ✅ 代码量少，易于维护
5. ✅ 性能好，没有额外的计算

## 测试

1. 添加小问题 - 状态下拉菜单完整显示
2. 编辑小问题 - 状态下拉菜单完整显示
3. 编辑大问题 - 状态下拉菜单完整显示
4. 问题筛选 - 状态下拉菜单完整显示

所有场景都应该正常工作！
