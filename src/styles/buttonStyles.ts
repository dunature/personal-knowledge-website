/**
 * 统一的按钮样式工具
 * 提供一致的按钮样式类，确保整个应用的按钮视觉统一
 */

/**
 * 基础按钮样式
 * 所有按钮共享的基础样式
 */
export const baseButtonStyles = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'px-4',
    'py-2.5',
    'rounded-xl', // 20px 圆角
    'font-medium',
    'text-sm',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none'
].join(' ');

/**
 * 主按钮样式
 * 用于主要操作（如提交、确认等）
 */
export const primaryButtonStyles = [
    baseButtonStyles,
    'bg-primary',
    'text-white',
    'hover:bg-primary-hover',
    'active:bg-primary-active',
    'focus:ring-primary/30',
    'shadow-sm',
    'hover:shadow-md'
].join(' ');

/**
 * 次按钮样式
 * 用于次要操作（如取消、返回等）
 */
export const secondaryButtonStyles = [
    baseButtonStyles,
    'bg-white',
    'text-text-primary',
    'border',
    'border-gray-300',
    'hover:bg-gray-50',
    'hover:border-gray-400',
    'active:bg-gray-100',
    'focus:ring-gray-300/30',
    'shadow-sm'
].join(' ');

/**
 * 图标按钮样式
 * 用于只有图标的按钮（如关闭、编辑等）
 */
export const iconButtonStyles = [
    'inline-flex',
    'items-center',
    'justify-center',
    'w-9',
    'h-9',
    'rounded-xl', // 20px 圆角
    'text-text-secondary',
    'hover:text-primary',
    'hover:bg-gray-100',
    'active:bg-gray-200',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary/30',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
].join(' ');

/**
 * 危险按钮样式
 * 用于危险操作（如删除、清空等）
 */
export const dangerButtonStyles = [
    baseButtonStyles,
    'bg-error',
    'text-white',
    'hover:bg-red-600',
    'active:bg-red-700',
    'focus:ring-error/30',
    'shadow-sm',
    'hover:shadow-md'
].join(' ');

/**
 * 幽灵按钮样式
 * 用于不太重要的操作，透明背景
 */
export const ghostButtonStyles = [
    baseButtonStyles,
    'bg-transparent',
    'text-text-primary',
    'hover:bg-gray-100',
    'active:bg-gray-200',
    'focus:ring-gray-300/30'
].join(' ');

/**
 * 链接按钮样式
 * 看起来像链接的按钮
 */
export const linkButtonStyles = [
    'inline-flex',
    'items-center',
    'gap-1',
    'text-sm',
    'font-medium',
    'text-primary',
    'hover:text-primary-hover',
    'hover:underline',
    'active:text-primary-active',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary/30',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
].join(' ');

/**
 * 大号按钮样式修饰符
 * 可以与其他按钮样式组合使用
 */
export const largeButtonModifier = 'px-6 py-3 text-base';

/**
 * 小号按钮样式修饰符
 * 可以与其他按钮样式组合使用
 */
export const smallButtonModifier = 'px-3 py-1.5 text-xs';

/**
 * 全宽按钮样式修饰符
 * 可以与其他按钮样式组合使用
 */
export const fullWidthModifier = 'w-full';

/**
 * 按钮样式类型
 */
export type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'danger' | 'ghost' | 'link';

/**
 * 按钮尺寸类型
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * 获取按钮样式类名
 * @param variant - 按钮变体
 * @param size - 按钮尺寸
 * @param fullWidth - 是否全宽
 * @param className - 额外的类名
 * @returns 完整的按钮类名字符串
 */
export function getButtonStyles(
    variant: ButtonVariant = 'primary',
    size: ButtonSize = 'medium',
    fullWidth: boolean = false,
    className: string = ''
): string {
    const variantStyles = {
        primary: primaryButtonStyles,
        secondary: secondaryButtonStyles,
        icon: iconButtonStyles,
        danger: dangerButtonStyles,
        ghost: ghostButtonStyles,
        link: linkButtonStyles
    };

    const sizeModifier = {
        small: smallButtonModifier,
        medium: '',
        large: largeButtonModifier
    };

    const styles = [
        variantStyles[variant],
        size !== 'medium' && variant !== 'icon' ? sizeModifier[size] : '',
        fullWidth && variant !== 'icon' ? fullWidthModifier : '',
        className
    ].filter(Boolean).join(' ');

    return styles;
}
