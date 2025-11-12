/**
 * 动画工具函数
 * 提供缓动函数和动画辅助功能
 */

/**
 * 缓动函数类型
 */
export type EasingFunction = (t: number) => number;

/**
 * 线性缓动
 */
export const linear: EasingFunction = (t: number) => t;

/**
 * ease-in (加速)
 */
export const easeIn: EasingFunction = (t: number) => t * t;

/**
 * ease-out (减速)
 */
export const easeOut: EasingFunction = (t: number) => t * (2 - t);

/**
 * ease-in-out (先加速后减速)
 */
export const easeInOut: EasingFunction = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

/**
 * ease-in-cubic (三次方加速)
 */
export const easeInCubic: EasingFunction = (t: number) => t * t * t;

/**
 * ease-out-cubic (三次方减速)
 */
export const easeOutCubic: EasingFunction = (t: number) => {
    return --t * t * t + 1;
};

/**
 * ease-in-out-cubic (三次方先加速后减速)
 */
export const easeInOutCubic: EasingFunction = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

/**
 * 动画帧函数
 * @param from 起始值
 * @param to 结束值
 * @param duration 持续时间（毫秒）
 * @param easing 缓动函数
 * @param onUpdate 更新回调
 * @param onComplete 完成回调
 */
export const animate = (
    from: number,
    to: number,
    duration: number,
    easing: EasingFunction = easeOut,
    onUpdate: (value: number) => void,
    onComplete?: () => void
): (() => void) => {
    const startTime = Date.now();
    const change = to - from;
    let animationFrameId: number;

    const step = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        const currentValue = from + change * easedProgress;

        onUpdate(currentValue);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
        } else {
            onComplete?.();
        }
    };

    animationFrameId = requestAnimationFrame(step);

    // 返回取消函数
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
};

/**
 * 平滑滚动到指定位置
 */
export const smoothScrollTo = (
    element: HTMLElement | Window,
    to: number,
    duration: number = 300
): Promise<void> => {
    return new Promise((resolve) => {
        const start = element === window ? window.pageYOffset : (element as HTMLElement).scrollTop;

        animate(
            start,
            to,
            duration,
            easeInOut,
            (value) => {
                if (element === window) {
                    window.scrollTo(0, value);
                } else {
                    (element as HTMLElement).scrollTop = value;
                }
            },
            () => resolve()
        );
    });
};

/**
 * 延迟执行
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
