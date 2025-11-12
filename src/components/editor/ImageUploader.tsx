/**
 * 图片上传组件
 * 支持文件选择、拖拽上传和粘贴Markdown语法
 */

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface ImageUploaderProps {
    onInsert: (markdown: string) => void;
    onClose: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onInsert,
    onClose,
}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [altText, setAltText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 模拟图片上传到图床
    const simulateUpload = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 在实际应用中，这里应该上传到真实的图床服务
                // 现在只是创建一个本地URL作为示例
                const url = URL.createObjectURL(file);
                resolve(url);
            }, 1000);
        });
    };

    // 处理文件选择
    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }

        setIsUploading(true);
        try {
            const url = await simulateUpload(file);
            setImageUrl(url);
            setAltText(file.name.replace(/\.[^/.]+$/, ''));
        } catch (error) {
            alert('上传失败，请重试');
        } finally {
            setIsUploading(false);
        }
    };

    // 处理文件输入变化
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // 处理拖拽
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // 插入Markdown语法
    const handleInsert = () => {
        if (!imageUrl) {
            alert('请输入图片URL或上传图片');
            return;
        }

        const markdown = `![${altText || '图片'}](${imageUrl})`;
        onInsert(markdown);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-modal w-full max-w-md p-6">
                {/* 标题栏 */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#333]">插入图片</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-[#F5F5F5] transition-fast"
                        aria-label="关闭"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 拖拽上传区域 */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-lg p-8
                        text-center cursor-pointer
                        transition-fast
                        ${isDragging
                            ? 'border-[#0047AB] bg-[#E3F2FD]'
                            : 'border-[#E0E0E0] hover:border-[#0047AB] hover:bg-[#F5F5F5]'
                        }
                    `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={48} className="mx-auto mb-4 text-[#999]" />
                    <p className="text-sm text-[#666] mb-2">
                        {isUploading ? '上传中...' : '点击或拖拽图片到此处上传'}
                    </p>
                    <p className="text-xs text-[#999]">
                        支持 JPG、PNG、GIF 格式
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* 分隔线 */}
                <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 border-t border-[#E0E0E0]" />
                    <span className="text-sm text-[#999]">或</span>
                    <div className="flex-1 border-t border-[#E0E0E0]" />
                </div>

                {/* URL输入 */}
                <div className="space-y-3">
                    <Input
                        label="图片URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        fullWidth
                    />
                    <Input
                        label="图片描述（可选）"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="图片描述"
                        fullWidth
                    />
                </div>

                {/* 按钮组 */}
                <div className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        fullWidth
                    >
                        取消
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleInsert}
                        disabled={!imageUrl || isUploading}
                        fullWidth
                    >
                        插入
                    </Button>
                </div>
            </div>
        </div>
    );
};
