/**
 * 存储服务
 * 封装localStorage操作，提供类型安全的存储接口
 */

import { ErrorType, createAppError } from '@/types';

class StorageService {
    private static instance: StorageService;

    private constructor() { }

    /**
     * 获取单例实例
     */
    static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    /**
     * 保存数据到localStorage
     */
    setItem<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                `无法保存数据到 ${key}`,
                error
            );
        }
    }

    /**
     * 从localStorage读取数据
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return null;
            }
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                `无法读取数据从 ${key}`,
                error
            );
        }
    }

    /**
     * 从localStorage删除数据
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                `无法删除数据 ${key}`,
                error
            );
        }
    }

    /**
     * 清空localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            throw createAppError(
                ErrorType.STORAGE_ERROR,
                '无法清空存储',
                error
            );
        }
    }

    /**
     * 检查key是否存在
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * 获取所有keys
     */
    getAllKeys(): string[] {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                keys.push(key);
            }
        }
        return keys;
    }
}

export default StorageService.getInstance();
