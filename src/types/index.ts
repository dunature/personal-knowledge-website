/**
 * 类型定义统一导出
 */

// 资源相关类型
export type {
    Resource,
    ResourceType,
    ResourceMetadata,
    ResourceInput,
    ResourceFilter,
    ResourceSortOption,
} from './resource';

export { CONTENT_TAG_COLORS } from './resource';

// 问答相关类型
export type {
    BigQuestion,
    SubQuestion,
    TimelineAnswer,
    QuestionStatus,
    BigQuestionInput,
    SubQuestionInput,
    TimelineAnswerInput,
    QuestionFilter,
    QuestionSortOption,
    QuestionWithDetails,
} from './question';

export { STATUS_COLORS } from './question';

// 通用类型
export type {
    Category,
    ModalState,
    EditorType,
    EditorState,
    NotificationType,
    Notification,
    LoadingState,
    Pagination,
    ApiResponse,
    DateFormat,
    ViewMode,
    ConfirmDialogConfig,
} from './common';

// 错误类型
export type {
    AppError,
    ValidationError,
    FormErrors,
    ErrorHandler,
} from './error';

export {
    ErrorType,
    createAppError,
    ERROR_MESSAGES,
} from './error';
