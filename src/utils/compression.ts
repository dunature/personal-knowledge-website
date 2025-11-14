/**
 * 数据压缩工具
 * 使用 CompressionStream API 进行 gzip 压缩
 */

const COMPRESSION_THRESHOLD = 50 * 1024; // 50KB

/**
 * 压缩数据
 * @param data 要压缩的字符串数据
 * @returns 压缩后的 base64 字符串，如果数据小于阈值则返回原数据
 */
export async function compressData(data: string): Promise<string> {
    // 如果数据小于阈值，不压缩
    if (data.length < COMPRESSION_THRESHOLD) {
        return data;
    }

    try {
        // 检查浏览器是否支持 CompressionStream
        if (typeof CompressionStream === 'undefined') {
            console.warn('CompressionStream 不支持，跳过压缩');
            return data;
        }

        const encoder = new TextEncoder();
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();

        // 写入数据
        await writer.write(encoder.encode(data));
        await writer.close();

        // 读取压缩后的数据
        const compressed = await new Response(stream.readable).arrayBuffer();

        // 转换为 base64
        const base64 = btoa(String.fromCharCode(...new Uint8Array(compressed)));

        // 添加压缩标记
        return `GZIP:${base64}`;
    } catch (error) {
        console.error('压缩数据失败:', error);
        return data; // 压缩失败时返回原数据
    }
}

/**
 * 解压数据
 * @param data 压缩的数据或原始数据
 * @returns 解压后的字符串
 */
export async function decompressData(data: string): Promise<string> {
    // 检查是否是压缩数据
    if (!data.startsWith('GZIP:')) {
        return data; // 不是压缩数据，直接返回
    }

    try {
        // 检查浏览器是否支持 DecompressionStream
        if (typeof DecompressionStream === 'undefined') {
            console.warn('DecompressionStream 不支持');
            throw new Error('浏览器不支持解压缩');
        }

        // 移除压缩标记
        const base64 = data.substring(5);

        // 从 base64 解码
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // 解压
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        await writer.write(bytes);
        await writer.close();

        // 读取解压后的数据
        const decompressed = await new Response(stream.readable).arrayBuffer();

        // 转换为字符串
        const decoder = new TextDecoder();
        return decoder.decode(decompressed);
    } catch (error) {
        console.error('解压数据失败:', error);
        throw new Error('数据解压失败');
    }
}

/**
 * 计算压缩率
 * @param original 原始数据大小（字节）
 * @param compressed 压缩后数据大小（字节）
 * @returns 压缩率百分比
 */
export function calculateCompressionRatio(original: number, compressed: number): number {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
}

/**
 * 格式化数据大小
 * @param bytes 字节数
 * @returns 格式化的字符串（如 "1.5 MB"）
 */
export function formatDataSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * 检查是否应该压缩数据
 * @param data 数据字符串
 * @returns 是否应该压缩
 */
export function shouldCompress(data: string): boolean {
    return data.length >= COMPRESSION_THRESHOLD;
}
