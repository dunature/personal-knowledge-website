/**
 * 验证工具函数
 * 提供表单验证和数据验证功能
 */

/**
 * 验证结果类型
 */
export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * 验证规则类型
 */
export type ValidationRule = (value: any) => ValidationResult;

/**
 * 必填验证
 */
export const required = (message: string = '此字段为必填项'): ValidationRule => {
    return (value: any): ValidationResult => {
        const valid = value !== null && value !== undefined && value !== '';
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * 最小长度验证
 */
export const minLength = (min: number, message?: string): ValidationRule => {
    return (value: string): ValidationResult => {
        const valid = !value || value.length >= min;
        return {
            valid,
            message: valid ? undefined : message || `最少需要${min}个字符`,
        };
    };
};

/**
 * 最大长度验证
 */
export const maxLength = (max: number, message?: string): ValidationRule => {
    return (value: string): ValidationResult => {
        const valid = !value || value.length <= max;
        return {
            valid,
            message: valid ? undefined : message || `最多允许${max}个字符`,
        };
    };
};

/**
 * 邮箱验证
 */
export const email = (message: string = '请输入有效的邮箱地址'): ValidationRule => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: string): ValidationResult => {
        const valid = !value || emailRegex.test(value);
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * URL验证
 */
export const url = (message: string = '请输入有效的URL'): ValidationRule => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return (value: string): ValidationResult => {
        const valid = !value || urlRegex.test(value);
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * 数字验证
 */
export const number = (message: string = '请输入有效的数字'): ValidationRule => {
    return (value: any): ValidationResult => {
        const valid = !value || !isNaN(Number(value));
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * 最小值验证
 */
export const min = (minValue: number, message?: string): ValidationRule => {
    return (value: any): ValidationResult => {
        const num = Number(value);
        const valid = !value || num >= minValue;
        return {
            valid,
            message: valid ? undefined : message || `值不能小于${minValue}`,
        };
    };
};

/**
 * 最大值验证
 */
export const max = (maxValue: number, message?: string): ValidationRule => {
    return (value: any): ValidationResult => {
        const num = Number(value);
        const valid = !value || num <= maxValue;
        return {
            valid,
            message: valid ? undefined : message || `值不能大于${maxValue}`,
        };
    };
};

/**
 * 正则表达式验证
 */
export const pattern = (regex: RegExp, message: string = '格式不正确'): ValidationRule => {
    return (value: string): ValidationResult => {
        const valid = !value || regex.test(value);
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * 自定义验证
 */
export const custom = (
    validator: (value: any) => boolean,
    message: string
): ValidationRule => {
    return (value: any): ValidationResult => {
        const valid = validator(value);
        return { valid, message: valid ? undefined : message };
    };
};

/**
 * 组合多个验证规则
 */
export const validate = (value: any, rules: ValidationRule[]): ValidationResult => {
    for (const rule of rules) {
        const result = rule(value);
        if (!result.valid) {
            return result;
        }
    }
    return { valid: true };
};

/**
 * 验证对象的所有字段
 */
export const validateObject = (
    data: Record<string, any>,
    rules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
    const results: Record<string, ValidationResult> = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
        results[field] = validate(data[field], fieldRules);
    }

    return results;
};

/**
 * 检查验证结果是否全部通过
 */
export const isValidationPassed = (results: Record<string, ValidationResult>): boolean => {
    return Object.values(results).every(result => result.valid);
};
