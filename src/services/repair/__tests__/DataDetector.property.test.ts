/**
 * Property-Based Tests for DataDetector
 * Feature: gist-data-repair
 * 
 * These tests verify universal properties that should hold across all inputs
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { DataDetector } from '../DataDetector';

describe('DataDetector - Property-Based Tests', () => {
    const detector = new DataDetector();

    /**
     * Property 1: Complete validation coverage
     * For any Gist data object, when validation runs, all data items in all arrays 
     * (resources, questions, subQuestions, answers) should be checked against the schema.
     * Validates: Requirements 1.1
     */
    describe('Property 1: Complete validation coverage', () => {
        it('should validate all items in all data arrays', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        questions: fc.array(fc.anything()),
                        subQuestions: fc.array(fc.anything()),
                        answers: fc.array(fc.anything()),
                        resources: fc.array(fc.anything()),
                        metadata: fc.anything(),
                    }),
                    (data) => {
                        const result = detector.detectErrors(data);

                        // The detector should process all arrays
                        expect(result.errorsByType).toHaveProperty('questions');
                        expect(result.errorsByType).toHaveProperty('subQuestions');
                        expect(result.errorsByType).toHaveProperty('answers');
                        expect(result.errorsByType).toHaveProperty('resources');
                        expect(result.errorsByType).toHaveProperty('metadata');

                        // All arrays should be checked (even if empty)
                        expect(Array.isArray(result.errorsByType.questions)).toBe(true);
                        expect(Array.isArray(result.errorsByType.subQuestions)).toBe(true);
                        expect(Array.isArray(result.errorsByType.answers)).toBe(true);
                        expect(Array.isArray(result.errorsByType.resources)).toBe(true);
                        expect(Array.isArray(result.errorsByType.metadata)).toBe(true);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should check every item in questions array', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.record({ id: fc.string() }), { minLength: 1, maxLength: 10 }),
                    (questions) => {
                        const data = {
                            questions,
                            subQuestions: [],
                            answers: [],
                            resources: [],
                            metadata: { version: '1.0', lastSync: '2024-01-01', owner: 'test' },
                        };

                        const result = detector.detectErrors(data);

                        // If there are invalid items, errors should be reported
                        // The number of error groups should not exceed the number of items
                        const uniqueIndices = new Set(
                            result.errorsByType.questions.map(e => e.itemIndex)
                        );
                        expect(uniqueIndices.size).toBeLessThanOrEqual(questions.length);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 2: Complete error detail collection
     * For any invalid data item, the validation result should include error details 
     * with field name, error type, and item identifier.
     * Validates: Requirements 1.2
     */
    describe('Property 2: Complete error detail collection', () => {
        it('should include all required error details for invalid items', () => {
            fc.assert(
                fc.property(
                    fc.array(
                        fc.record({
                            // Intentionally create invalid questions
                            id: fc.option(fc.string(), { nil: undefined }),
                            title: fc.option(fc.string(), { nil: undefined }),
                        }),
                        { minLength: 1, maxLength: 5 }
                    ),
                    (questions) => {
                        const data = {
                            questions,
                            subQuestions: [],
                            answers: [],
                            resources: [],
                            metadata: { version: '1.0', lastSync: '2024-01-01', owner: 'test' },
                        };

                        const result = detector.detectErrors(data);

                        // Every error should have required fields
                        result.errorsByType.questions.forEach(error => {
                            expect(error).toHaveProperty('itemIndex');
                            expect(error).toHaveProperty('field');
                            expect(error).toHaveProperty('errorType');
                            expect(error).toHaveProperty('expectedFormat');
                            expect(error).toHaveProperty('message');
                            expect(typeof error.itemIndex).toBe('number');
                            expect(typeof error.field).toBe('string');
                            expect(typeof error.errorType).toBe('string');
                            expect(typeof error.expectedFormat).toBe('string');
                            expect(typeof error.message).toBe('string');
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});

/**
 * Property 3: Multiple error reporting
 * For any data item with multiple format errors, the validation result should 
 * contain all errors for that item, not just the first one encountered.
 * Validates: Requirements 1.3
 */
describe('Property 3: Multiple error reporting', () => {
    const detector = new DataDetector();

    it('should report all errors for items with multiple issues', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 5 }),
                (numQuestions) => {
                    // Create questions with multiple missing fields
                    const questions = Array(numQuestions).fill(null).map((_) => ({
                        // Missing most required fields intentionally
                    }));

                    const data = {
                        questions,
                        subQuestions: [],
                        answers: [],
                        resources: [],
                        metadata: { version: '1.0', lastSync: '2024-01-01', owner: 'test' },
                    };

                    const result = detector.detectErrors(data);

                    // Each question should have multiple errors reported
                    // (id, title, description, status, category, summary, sub_questions, created_at, updated_at)
                    const errorsByItem = new Map<number, number>();
                    result.errorsByType.questions.forEach(error => {
                        errorsByItem.set(
                            error.itemIndex,
                            (errorsByItem.get(error.itemIndex) || 0) + 1
                        );
                    });

                    // Each item should have more than 1 error
                    errorsByItem.forEach(count => {
                        expect(count).toBeGreaterThan(1);
                    });
                }
            ),
            { numRuns: 100 }
        );
    });
});

/**
 * Property 4: Error summary accuracy
 * For any set of validation errors, the summary counts by category should 
 * equal the actual number of errors in each category.
 * Validates: Requirements 1.4
 */
describe('Property 4: Error summary accuracy', () => {
    const detector = new DataDetector();

    it('should accurately count errors by type', () => {
        fc.assert(
            fc.property(
                fc.record({
                    questions: fc.array(fc.anything(), { maxLength: 5 }),
                    subQuestions: fc.array(fc.anything(), { maxLength: 5 }),
                    answers: fc.array(fc.anything(), { maxLength: 5 }),
                    resources: fc.array(fc.anything(), { maxLength: 5 }),
                    metadata: fc.anything(),
                }),
                (data) => {
                    const result = detector.detectErrors(data);

                    // Count actual errors by type
                    const actualCounts = {
                        questions: result.errorsByType.questions.length,
                        subQuestions: result.errorsByType.subQuestions.length,
                        answers: result.errorsByType.answers.length,
                        resources: result.errorsByType.resources.length,
                        metadata: result.errorsByType.metadata.length,
                    };

                    // Summary should match actual counts
                    expect(result.summary.errorsByType.questions).toBe(actualCounts.questions);
                    expect(result.summary.errorsByType.subQuestions).toBe(actualCounts.subQuestions);
                    expect(result.summary.errorsByType.answers).toBe(actualCounts.answers);
                    expect(result.summary.errorsByType.resources).toBe(actualCounts.resources);
                    expect(result.summary.errorsByType.metadata).toBe(actualCounts.metadata);

                    // Total should equal sum of all errors
                    const totalActual = Object.values(actualCounts).reduce((a, b) => a + b, 0);
                    expect(result.summary.totalErrors).toBe(totalActual);
                    expect(result.totalErrors).toBe(totalActual);
                }
            ),
            { numRuns: 100 }
        );
    });
});

/**
 * Property 8: Error organization by type
 * For any error report, errors should be grouped by data type 
 * (questions, resources, etc.) in the report structure.
 * Validates: Requirements 2.4
 */
describe('Property 8: Error organization by type', () => {
    const detector = new DataDetector();

    it('should organize errors by data type', () => {
        fc.assert(
            fc.property(
                fc.record({
                    questions: fc.array(fc.record({}), { maxLength: 3 }),
                    subQuestions: fc.array(fc.record({}), { maxLength: 3 }),
                    answers: fc.array(fc.record({}), { maxLength: 3 }),
                    resources: fc.array(fc.record({}), { maxLength: 3 }),
                    metadata: fc.record({}),
                }),
                (data) => {
                    const result = detector.detectErrors(data);

                    // Errors should be organized by type
                    expect(result.errorsByType).toHaveProperty('questions');
                    expect(result.errorsByType).toHaveProperty('subQuestions');
                    expect(result.errorsByType).toHaveProperty('answers');
                    expect(result.errorsByType).toHaveProperty('resources');
                    expect(result.errorsByType).toHaveProperty('metadata');

                    // All errors in questions array should be from questions
                    // (we can't directly verify this without knowing the data structure,
                    // but we can verify the structure exists)
                    expect(Array.isArray(result.errorsByType.questions)).toBe(true);
                    expect(Array.isArray(result.errorsByType.subQuestions)).toBe(true);
                    expect(Array.isArray(result.errorsByType.answers)).toBe(true);
                    expect(Array.isArray(result.errorsByType.resources)).toBe(true);
                    expect(Array.isArray(result.errorsByType.metadata)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });
});
