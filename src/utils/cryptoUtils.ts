/**
 * 加密工具
 * 使用 Web Crypto API 加密和解密敏感数据（如 GitHub Token）
 */

/**
 * 加密数据结构
 */
interface EncryptedData {
    encrypted: string; // Base64 编码的加密数据
    iv: string; // Base64 编码的初始化向量
    salt: string; // Base64 编码的盐值
}

/**
 * 从密码派生加密密钥
 * @param password - 密码（使用设备指纹或固定密钥）
 * @param salt - 盐值
 * @returns 加密密钥
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: 100000,
            hash: 'SHA-256',
        },
        passwordKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * 获取设备指纹作为加密密码
 * 使用浏览器和设备信息生成唯一标识
 * @returns 设备指纹字符串
 */
function getDeviceFingerprint(): string {
    // 使用多个浏览器特征生成指纹
    const features = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
    ];

    return features.join('|');
}

/**
 * 加密 Token
 * @param token - 要加密的 Token
 * @returns 加密后的数据（JSON 字符串）
 */
export async function encryptToken(token: string): Promise<string> {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(token);

        // 生成随机盐值和初始化向量
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // 使用设备指纹派生密钥
        const password = getDeviceFingerprint();
        const key = await deriveKey(password, salt);

        // 加密数据
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

        // 转换为 Base64 并返回
        const encryptedData: EncryptedData = {
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            iv: btoa(String.fromCharCode(...iv)),
            salt: btoa(String.fromCharCode(...salt)),
        };

        return JSON.stringify(encryptedData);
    } catch (error) {
        console.error('Token 加密失败:', error);
        throw new Error('Token 加密失败');
    }
}

/**
 * 解密 Token
 * @param encryptedString - 加密的数据（JSON 字符串）
 * @returns 解密后的 Token
 */
export async function decryptToken(encryptedString: string): Promise<string> {
    try {
        const encryptedData: EncryptedData = JSON.parse(encryptedString);

        // 将 Base64 转换回 Uint8Array
        const encrypted = Uint8Array.from(atob(encryptedData.encrypted), (c) => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(encryptedData.iv), (c) => c.charCodeAt(0));
        const salt = Uint8Array.from(atob(encryptedData.salt), (c) => c.charCodeAt(0));

        // 使用设备指纹派生密钥
        const password = getDeviceFingerprint();
        const key = await deriveKey(password, salt);

        // 解密数据
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

        // 转换为字符串
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Token 解密失败:', error);
        throw new Error('Token 解密失败');
    }
}

/**
 * 验证加密数据格式
 * @param encryptedString - 加密的数据字符串
 * @returns 是否为有效的加密数据
 */
export function isValidEncryptedData(encryptedString: string): boolean {
    try {
        const data = JSON.parse(encryptedString);
        return (
            typeof data === 'object' &&
            typeof data.encrypted === 'string' &&
            typeof data.iv === 'string' &&
            typeof data.salt === 'string'
        );
    } catch {
        return false;
    }
}
