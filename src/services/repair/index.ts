/**
 * Data Repair Service Exports
 * 数据修复服务导出
 */

// 导出类型
export type {
    DataType,
    ErrorType,
    ItemError,
    ErrorSummary,
    DetectionResult,
    FieldChange,
    RepairAction,
    RepairPlan,
    RepairStrategy,
    IsolatedItem,
    RepairResult,
    RepairConfig,
    ReportMetadata,
    EnhancedValidationResult,
    RepairContext,
    RecoveryResult,
    FallbackAction,
} from '@/types/dataRepair';

// 导出基类和注册表
export { BaseRepairStrategy } from './BaseRepairStrategy';
export { RepairStrategyRegistry, repairStrategyRegistry } from './RepairStrategyRegistry';
export { DataDetector, dataDetector } from './DataDetector';
export { RepairAnalyzer, repairAnalyzer } from './RepairAnalyzer';
export { DataRepairer, dataRepairer } from './DataRepairer';
export { ErrorReporter, errorReporter } from './ErrorReporter';
export { repairSyncIntegration } from './RepairSyncIntegration';
export type { RepairSyncOptions, RepairSyncResult } from './RepairSyncIntegration';

// 导出修复策略
export { AddMissingStringFieldStrategy } from './strategies/AddMissingStringFieldStrategy';
export { AddMissingArrayFieldStrategy } from './strategies/AddMissingArrayFieldStrategy';
export { FixInvalidStatusStrategy } from './strategies/FixInvalidStatusStrategy';
export { FixInvalidDateStrategy } from './strategies/FixInvalidDateStrategy';
export { GenerateMissingIdStrategy } from './strategies/GenerateMissingIdStrategy';

// 导入策略类用于自动注册
import { AddMissingStringFieldStrategy } from './strategies/AddMissingStringFieldStrategy';
import { AddMissingArrayFieldStrategy } from './strategies/AddMissingArrayFieldStrategy';
import { FixInvalidStatusStrategy } from './strategies/FixInvalidStatusStrategy';
import { FixInvalidDateStrategy } from './strategies/FixInvalidDateStrategy';
import { GenerateMissingIdStrategy } from './strategies/GenerateMissingIdStrategy';
import { repairStrategyRegistry } from './RepairStrategyRegistry';

// 自动注册所有策略
repairStrategyRegistry.register(new AddMissingStringFieldStrategy());
repairStrategyRegistry.register(new AddMissingArrayFieldStrategy());
repairStrategyRegistry.register(new FixInvalidStatusStrategy());
repairStrategyRegistry.register(new FixInvalidDateStrategy());
repairStrategyRegistry.register(new GenerateMissingIdStrategy());
