import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
}

// 默认占位图 - 使用 SVG data URL
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f5f5f5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3E%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%B8%AD...%3C/text%3E%3C/svg%3E';

// 错误占位图 - 显示加载失败
const ERROR_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23666"%3E%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5%3C/text%3E%3C/svg%3E';

/**
 * LazyImage 组件
 * 使用Intersection Observer实现图片懒加载
 * 包含错误处理和默认占位图
 */
const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = DEFAULT_PLACEHOLDER,
    onLoad,
    onError,
}) => {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 只有在没有错误的情况下才加载图片
                        if (!hasError) {
                            setImageSrc(src);
                        }
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // 提前50px开始加载
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, [src, hasError]);

    const handleLoad = () => {
        setIsLoaded(true);
        setHasError(false);
        onLoad?.();
    };

    const handleError = () => {
        console.warn(`图片加载失败: ${src}`);
        setHasError(true);
        setIsLoaded(false);
        // 设置错误占位图
        setImageSrc(ERROR_PLACEHOLDER);
        onError?.();
    };

    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
        />
    );
};

export default React.memo(LazyImage);
