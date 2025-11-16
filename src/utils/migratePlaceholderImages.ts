/**
 * 迁移工具：将旧的 via.placeholder.com 图片 URL 替换为本地 SVG 占位图
 */

import { getPlaceholderByType } from './placeholderUtils';
import type { Resource } from '@/types/resource';

/**
 * 检查 URL 是否是 via.placeholder.com
 */
function isViaPlaceholder(url: string): boolean {
    return url.includes('via.placeholder.com');
}

/**
 * 迁移单个资源的封面图
 */
export function migrateResourceCover(resource: Resource): Resource {
    if (!resource.cover || !isViaPlaceholder(resource.cover)) {
        return resource;
    }

    // 根据资源类型生成新的占位图
    const newCover = getPlaceholderByType(resource.type, resource.title);

    return {
        ...resource,
        cover: newCover,
    };
}

/**
 * 迁移资源数组
 */
export function migrateResources(resources: Resource[]): Resource[] {
    return resources.map(migrateResourceCover);
}

/**
 * 从 LocalStorage 迁移资源数据
 */
export function migrateLocalStorageResources(): void {
    try {
        const storageKey = 'pkw_resources';
        const data = localStorage.getItem(storageKey);

        if (!data) {
            console.log('[Migration] 没有找到需要迁移的资源数据');
            return;
        }

        const resources: Resource[] = JSON.parse(data);
        const migratedResources = migrateResources(resources);

        // 检查是否有变化
        const hasChanges = resources.some((r, i) => r.cover !== migratedResources[i].cover);

        if (hasChanges) {
            localStorage.setItem(storageKey, JSON.stringify(migratedResources));
            console.log(`[Migration] 已迁移 ${resources.length} 个资源的占位图`);
        } else {
            console.log('[Migration] 所有资源已经是最新格式');
        }
    } catch (error) {
        console.error('[Migration] 迁移失败:', error);
    }
}
