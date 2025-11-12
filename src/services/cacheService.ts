/**
 * 缓存服务
 * 管理 LocalStorage 中的数据缓存
 */

// LocalStorage 键名常量
export const STORAGE_KEYS = {
    // 认证相关（由 AuthService 管理）
    TOKEN: 'pkw_github_token',
    GIST_ID: 'pkw_gist_id',
    MODE: 'pkw_mode',
    USER: 'pkw_user',

    // 数据缓存
    RESOURCES: 'pkw_resources',
    QUESTIONS: 'pkw_questions',
    SUB_QUESTIONS: 'pkw_sub_questions',
    ANSWERS: 'pkw_answers',
    METADATA: 'pkw_metadata',

    // 同步状态
    SYNC_STATUS: 'pkw_sync_status',
    LAST_SYNC: 'pkw_last_sync',
    PENDING_CHANGES: 'pkw_pending_changes',

    // 缓存元数据
    CACHE_TIMESTAMPS: 'pkw_cache_timestamps',
} as const;

/**
 * 缓存信息
 */
export interface CacheInfo {
    size: number; // 总大小（字节）
    keys: string[]; // 所有键
    lastUpdated: Record<string, string>; // 每个键的最后更新时间
}

/**
 * 缓存服务类
 */
class CacheService {
    /**
     * 保存数据到 LocalStorage
     * @param key - 存储键名
     * @param data - 要保存的数据
     */
    async saveData(key: string, data: any): Promise<void> {
        try {
            const jsonString = JSON.stringify(data);
            localStorage.setItem(key, jsonString);

            // 更新时间戳
            this.updateTimestamp(key);
        } catch (error) {
            console.error(`保存数据失败 (${key}):`, error);
            throw new Error(`保存数据失败: ${error}`);
        }
    }

    /**
     * 从 LocalStorage 读取数据
     * @param key - 存储键名
     * @returns 数据或 null
     */
    async getData<T>(key: string): Promise<T | null> {
        try {
            const jsonString = localStorage.getItem(key);
            if (!jsonString) {
                return null;
            }

            return JSON.parse(jsonString) as T;
        } catch (error) {
            console.error(`读取数据失败 (${key}):`, error);
            return null;
        }
    }

    /**
     * 清除指定键的数据
     * @param key - 存储键名
     */
    async clearData(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
            this.removeTimestamp(key);
        } catch (error) {
            console.error(`清除数据失败 (${key}):`, error);
        }
    }

    /**
     * 清除所有缓存数据（保留认证信息）
     */
    async clearAll(): Promise<void> {
        try {
            // 清除数据缓存
            localStorage.removeItem(STORAGE_KEYS.RESOURCES);
            localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
            localStorage.removeItem(STORAGE_KEYS.SUB_QUESTIONS);
            localStorage.removeItem(STORAGE_KEYS.ANSWERS);
            localStorage.removeItem(STORAGE_KEYS.METADATA);

            // 清除同步状态
            localStorage.removeItem(STORAGE_KEYS.SYNC_STATUS);
            localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
            localStorage.removeItem(STORAGE_KEYS.PENDING_CHANGES);

            // 清除时间戳
            localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMPS);
        } catch (error) {
            console.error('清除所有缓存失败:', error);
        }
    }

    /**
     * 获取缓存信息
     * @returns 缓存信息
     */
    async getCacheInfo(): Promise<CacheInfo> {
        const keys: string[] = [];
        const lastUpdated: Record<string, string> = {};
        let totalSize = 0;

        try {
            // 遍历所有 LocalStorage 键
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('pkw_')) {
                    keys.push(key);

                    // 计算大小
                    const value = localStorage.getItem(key);
                    if (value) {
                        totalSize += new Blob([value]).size;
                    }
                }
            }

            // 获取时间戳
            const timestamps = await this.getData<Record<string, string>>(
                STORAGE_KEYS.CACHE_TIMESTAMPS
            );
            if (timestamps) {
                Object.assign(lastUpdated, timestamps);
            }

            return {
                size: totalSize,
                keys,
                lastUpdated,
            };
        } catch (error) {
            console.error('获取缓存信息失败:', error);
            return {
                size: 0,
                keys: [],
                lastUpdated: {},
            };
        }
    }

    /**
     * 检查缓存是否过期
     * @param key - 存储键名
     * @param maxAge - 最大缓存时间（毫秒）
     * @returns 是否过期
     */
    async isStale(key: string, maxAge: number): Promise<boolean> {
        try {
            const timestamps = await this.getData<Record<string, string>>(
                STORAGE_KEYS.CACHE_TIMESTAMPS
            );

            if (!timestamps || !timestamps[key]) {
                return true; // 没有时间戳，视为过期
            }

            const lastUpdate = new Date(timestamps[key]).getTime();
            const now = Date.now();

            return now - lastUpdate > maxAge;
        } catch (error) {
            console.error('检查缓存过期失败:', error);
            return true; // 出错时视为过期
        }
    }

    /**
     * 更新时间戳
     * @param key - 存储键名
     */
    private updateTimestamp(key: string): void {
        try {
            const timestamps = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMPS) || '{}'
            );
            timestamps[key] = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMPS, JSON.stringify(timestamps));
        } catch (error) {
            console.error('更新时间戳失败:', error);
        }
    }

    /**
     * 移除时间戳
     * @param key - 存储键名
     */
    private removeTimestamp(key: string): void {
        try {
            const timestamps = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMPS) || '{}'
            );
            delete timestamps[key];
            localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMPS, JSON.stringify(timestamps));
        } catch (error) {
            console.error('移除时间戳失败:', error);
        }
    }

    /**
     * 获取缓存大小（格式化）
     * @returns 格式化的大小字符串
     */
    async getFormattedSize(): Promise<string> {
        const info = await this.getCacheInfo();
        const bytes = info.size;

        if (bytes < 1024) {
            return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
    }

    /**
     * 检查 LocalStorage 是否可用
     * @returns 是否可用
     */
    isAvailable(): boolean {
        try {
            const testKey = '__pkw_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 获取剩余存储空间（估算）
     * @returns 剩余空间（字节）
     */
    async getRemainingSpace(): Promise<number> {
        try {
            const info = await this.getCacheInfo();
            const used = info.size;
            // LocalStorage 通常限制为 5-10MB，这里假设 5MB
            const limit = 5 * 1024 * 1024;
            return Math.max(0, limit - used);
        } catch {
            return 0;
        }
    }
}

// 导出单例
export const cacheService = new CacheService();
