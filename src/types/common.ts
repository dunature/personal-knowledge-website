/**
 * 通用类型定义
 */

/**
 * 分类数据结构
 */
export interface Category {
    id: string;
    name: string;
    color: string;                    // 背景颜色，如 "#E3F2FD"
}

/**
 * 模态框状态
 */
export interface ModalState {
    isOpen: boolean;
    data?: any;
}

/**
 * 编辑器类型
 */
export type EditorType = 'resource' | 'question' | 'subQuestion' | 'answer' | 'summary';

/**
 * 编辑器状态
 */
export interface EditorState {
    isOpen: boolean;
    type: EditorType;
    data?: any;
    onSave?: (data: any) => void;
}

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * 通知消息
 */
export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;                // 显示时长（毫秒），默认2000
}

/**
 * 加载状态
 */
export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

/**
 * 分页参数
 */
export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

/**
 * API响应包装
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * 日期格式选项
 */
export type DateFormat = 'full' | 'date' | 'time' | 'relative';

/**
 * 视图模式
 */
export type ViewMode = 'all_time' | 'ALL_TIME';

/**
 * 确认对话框配置
 */
export interface ConfirmDialogConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}
