/**
 * Property-based tests for data validation
 * Feature: gist-id-validation-fix
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateGistDataDetailed } from '../dataValidation';

describe('Data Validation - Property Tests', () => {
    /**
     * Feature: gist-id-validation-fix, Property 4: Missing files error specificity
     * Validates: Requirements 2.1
     */
    it('should report specific missing fields in error messages', () => {
        fc.assert(
            fc.property(
                // Generate a subset of required fields to omit
                fc.subarray(['resources', 'questions', 'subQuestions', 'answers', 'metadata'], { minLength: 1, maxLength: 5 }),
                (fieldsToOmit) => {
                    // Create data object missing some fields
                    const data: any = {
                        resources: [],
                        questions: [],
                        subQuestions: [],
                        answers: [],
                        metadata: { version: '1.0', lastSync: '2024-01-01', owner: 'test' },
                    };

                    // Remove the selected fields
                    fieldsToOmit.forEach(field => delete data[field]);

                    const result = validateGistDataDetailed(data);

                    // Should be invalid
                    expect(result.valid).toBe(false);

                    // Should have errors
                    expect(result.errors).toBeDefined();
                    expect(result.errors!.length).toBeGreaterThan(0);

                    // Error message should mention the missing fields
                    const errorMessage = result.errors!.join(' ');
                    fieldsToOmit.forEach(field => {
                        expect(errorMessage).toContain(field);
                    });

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 5: Invalid structure error specificity
     * Validates: Requirements 2.2
     */
    it('should report specific data type errors when structure is invalid', () => {
        fc.assert(
            fc.property(
                // Generate which field to make invalid
                fc.constantFrom('resources', 'questions', 'subQuestions', 'answers'),
                (fieldToInvalidate) => {
                    // Create valid data
                    const data: any = {
                        resources: [],
                        questions: [],
                        subQuestions: [],
                        answers: [],
                        metadata: { version: '1.0', lastSync: '2024-01-01', owner: 'test' },
                    };

                    // Make the selected field invalid (not an array)
                    data[fieldToInvalidate] = 'not an array';

                    const result = validateGistDataDetailed(data);

                    // Should be invalid
                    expect(result.valid).toBe(false);

                    // Should have errors
                    expect(result.errors).toBeDefined();
                    expect(result.errors!.length).toBeGreaterThan(0);

                    // Error message should mention the specific field
                    const errorMessage = result.errors!.join(' ');
                    expect(errorMessage).toContain(fieldToInvalidate);
                    expect(errorMessage).toContain('数组');

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 6: Missing fields error specificity
     * Validates: Requirements 2.3
     */
    it('should list all missing required fields in error message', () => {
        fc.assert(
            fc.property(
                // Generate multiple fields to omit
                fc.subarray(['resources', 'questions', 'subQuestions', 'answers', 'metadata'], { minLength: 2, maxLength: 5 }),
                (_fieldsToOmit) => {
                    // Create incomplete data
                    const data: any = {};

                    const result = validateGistDataDetailed(data);

                    // Should be invalid
                    expect(result.valid).toBe(false);

                    // Should have errors
                    expect(result.errors).toBeDefined();
                    expect(result.errors!.length).toBeGreaterThan(0);

                    // Error message should list all missing fields
                    const errorMessage = result.errors!.join(' ');
                    expect(errorMessage).toContain('缺少必需的数据字段');

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 7: Valid data produces no errors
     * Validates: Requirements 2.4
     */
    it('should return valid with no errors for complete and valid data', () => {
        fc.assert(
            fc.property(
                // Generate valid data
                fc.record({
                    resources: fc.constant([]),
                    questions: fc.constant([]),
                    subQuestions: fc.constant([]),
                    answers: fc.constant([]),
                    metadata: fc.record({
                        version: fc.string(),
                        lastSync: fc.string(),
                        owner: fc.string(),
                    }),
                }),
                (data) => {
                    const result = validateGistDataDetailed(data);

                    // Should be valid
                    expect(result.valid).toBe(true);

                    // Should have no errors
                    expect(result.errors).toBeUndefined();

                    return true;
                }
            ),
            { numRuns: 50 }
        );
    });

    // Additional edge case tests
    it('should handle null data gracefully', () => {
        const result = validateGistDataDetailed(null);

        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors![0]).toContain('数据不是有效的对象');
    });

    it('should handle undefined data gracefully', () => {
        const result = validateGistDataDetailed(undefined);

        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors![0]).toContain('数据不是有效的对象');
    });

    it('should handle empty object', () => {
        const result = validateGistDataDetailed({});

        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors!.some(e => e.includes('缺少必需的数据字段'))).toBe(true);
    });
});
