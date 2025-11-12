/**
 * 函数工具
 * 提供防抖、节流等函数式编程工具
 */

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
};

/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let previous = 0;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;
        const now = Date.now();
        const remaining = wait - (now - previous);

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(context, args);
            }, remaining);
        }
    };
};

/**
 * 只执行一次的函数
 */
export const once = <T extends (...args: any[]) => any>(
    func: T
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
    let called = false;
    let result: ReturnType<T>;

    return function (this: any, ...args: Parameters<T>) {
        if (!called) {
            called = true;
            result = func.apply(this, args);
        }
        return result;
    };
};

/**
 * 记忆化函数（缓存函数结果）
 */
export const memoize = <T extends (...args: any[]) => any>(
    func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
    const cache = new Map<string, ReturnType<T>>();

    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

/**
 * 函数组合
 */
export const compose = <T>(...funcs: Array<(arg: T) => T>) => {
    return (arg: T): T => {
        return funcs.reduceRight((acc, func) => func(acc), arg);
    };
};

/**
 * 管道函数
 */
export const pipe = <T>(...funcs: Array<(arg: T) => T>) => {
    return (arg: T): T => {
        return funcs.reduce((acc, func) => func(acc), arg);
    };
};

/**
 * 柯里化函数
 */
export const curry = <T extends (...args: any[]) => any>(
    func: T,
    arity: number = func.length
): any => {
    return function curried(this: any, ...args: any[]): any {
        if (args.length >= arity) {
            return func.apply(this, args);
        }
        return function (this: any, ...nextArgs: any[]) {
            return curried.apply(this, [...args, ...nextArgs]);
        };
    };
};
