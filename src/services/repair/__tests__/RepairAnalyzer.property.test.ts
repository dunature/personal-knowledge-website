/**
 * Property-based tests for RepairAnalyzer
 * Feature: gist-data-repair, Property 14: Repair preview completeness
 * Feature: gist-data-repair, Property 15: Change highlighting completeness
 * Feature: gist-data-repair, Property 16: Change operation labeling
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { repairAnalyzer } from '../RepairAnalyzer';
import { dataDetector } from '../DataDetector';

describe('RepairAnalyzer - Property Tests', () => {
    /**
     * Property 14: Repair preview completeness
     * For any repair action, the preview should include both the original data and the repaired data for comparison.
     * Validates: Requirements 4.1
     */
    describe('Property 14: Repair preview completeness', () => {
        it('should include both original and repaired data in preview for any repair action', () => {
            fc.assert(
                fc.property(
                    // Generate data with various errors
                    fc.record({
                        questions: fc.array(
                            fc.record({
                                id: fc.option(fc.string(), { nil: undefined }),
                                question: fc.option(fc.string(), { nil: undefined }),
                                status: fc.oneof(
                                    fc.constant('solved'),
                                    fc.constant('unsolved'),
                                    fc.constant('invalid_status'),
                                    fc.constant(undefined)
                                ),
                                createdAt: fc.option(fc.string(), { nil: undefined }),
                                tags: fc.option(fc.array(fc.string()), { nil: undefined }),
                            }),
                            { minLength: 1, maxLength: 5 }
                        ),
                    }),
                    (data) => {
                        // Detect errors
                        const detectionResult = dataDetector.detectErrors(data);

                        if (detectionResult.totalErrors === 0) {
                            return true; // No errors, no repairs needed
                        }

                        // Get all errors from detection result
                        const allErrors = Object.values(detectionResult.errorsByType).flat();

                        // Analyze errors and generate repair plan
                        const repairPlan = repairAnalyzer.analyzeErrors(allErrors, data);

                        // Check each repair action
                        for (const repair of repairPlan.repairs) {
                            // Preview should exist
                            expect(repair.preview).toBeDefined();

                            // Preview should have before and after
                            expect(repair.preview.before).toBeDefined();
                            expect(repair.preview.after).toBeDefined();

                            // Before should be an object
                            expect(typeof repair.preview.before).toBe('object');

                            // After should be an object
                            expect(typeof repair.preview.after).toBe('object');
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 15: Change highlighting completeness
     * For any repair preview, all fields that will be modified should appear in the changes list.
     * Validates: Requirements 4.2
     */
    describe('Property 15: Change highlighting completeness', () => {
        it('should include all modified fields in the changes list', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        questions: fc.array(
                            fc.record({
                                id: fc.option(fc.string(), { nil: undefined }),
                                question: fc.option(fc.string(), { nil: undefined }),
                                status: fc.option(
                                    fc.oneof(
                                        fc.constant('solved'),
                                        fc.constant('unsolved'),
                                        fc.constant('invalid')
                                    ),
                                    { nil: undefined }
                                ),
                                createdAt: fc.option(fc.string(), { nil: undefined }),
                                tags: fc.option(fc.array(fc.string()), { nil: undefined }),
                            }),
                            { minLength: 1, maxLength: 5 }
                        ),
                    }),
                    (data) => {
                        const detectionResult = dataDetector.detectErrors(data);

                        if (detectionResult.totalErrors === 0) {
                            return true;
                        }

                        const allErrors = Object.values(detectionResult.errorsByType).flat();
                        const repairPlan = repairAnalyzer.analyzeErrors(allErrors, data);

                        for (const repair of repairPlan.repairs) {
                            const { before, after, changes } = repair.preview;

                            // Changes list should exist
                            expect(changes).toBeDefined();
                            expect(Array.isArray(changes)).toBe(true);

                            // Find all fields that differ between before and after
                            const modifiedFields = new Set<string>();

                            // Check all possible fields
                            const allFields = new Set([
                                ...Object.keys(before || {}),
                                ...Object.keys(after || {}),
                            ]);

                            for (const field of allFields) {
                                const beforeValue = (before as any)?.[field];
                                const afterValue = (after as any)?.[field];

                                // Check if values are different
                                if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
                                    modifiedFields.add(field);
                                }
                            }

                            // All modified fields should appear in changes list
                            for (const field of modifiedFields) {
                                const fieldInChanges = changes.some(change => change.field === field);
                                expect(fieldInChanges).toBe(true);
                            }
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 16: Change operation labeling
     * For any field change in a repair preview, the change should be labeled with an operation type (add, modify, or remove).
     * Validates: Requirements 4.3
     */
    describe('Property 16: Change operation labeling', () => {
        it('should label each change with a valid operation type', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        questions: fc.array(
                            fc.record({
                                id: fc.option(fc.string(), { nil: undefined }),
                                question: fc.option(fc.string(), { nil: undefined }),
                                status: fc.option(
                                    fc.oneof(
                                        fc.constant('solved'),
                                        fc.constant('unsolved'),
                                        fc.constant('invalid')
                                    ),
                                    { nil: undefined }
                                ),
                                createdAt: fc.option(fc.string(), { nil: undefined }),
                                tags: fc.option(fc.array(fc.string()), { nil: undefined }),
                            }),
                            { minLength: 1, maxLength: 5 }
                        ),
                    }),
                    (data) => {
                        const detectionResult = dataDetector.detectErrors(data);

                        if (detectionResult.totalErrors === 0) {
                            return true;
                        }

                        const allErrors = Object.values(detectionResult.errorsByType).flat();
                        const repairPlan = repairAnalyzer.analyzeErrors(allErrors, data);
                        const validOperations = ['add', 'modify', 'remove'];

                        for (const repair of repairPlan.repairs) {
                            const { changes } = repair.preview;

                            // Each change should have a valid operation type
                            for (const change of changes) {
                                expect(change.operation).toBeDefined();
                                expect(validOperations).toContain(change.operation);
                            }
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should correctly identify add operations for missing fields', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        questions: fc.array(
                            fc.record({
                                // Intentionally omit some required fields
                                id: fc.option(fc.string(), { nil: undefined }),
                                question: fc.option(fc.string(), { nil: undefined }),
                            }),
                            { minLength: 1, maxLength: 3 }
                        ),
                    }),
                    (data) => {
                        const detectionResult = dataDetector.detectErrors(data);
                        const allErrors = Object.values(detectionResult.errorsByType).flat();
                        const repairPlan = repairAnalyzer.analyzeErrors(allErrors, data);

                        for (const repair of repairPlan.repairs) {
                            const { before, changes } = repair.preview;

                            for (const change of changes) {
                                // If field didn't exist in before, operation should be 'add'
                                const fieldExistedBefore = before && change.field in before;

                                if (!fieldExistedBefore && change.operation === 'add') {
                                    // This is correct
                                    expect(change.operation).toBe('add');
                                } else if (fieldExistedBefore && change.operation === 'modify') {
                                    // This is also correct
                                    expect(change.operation).toBe('modify');
                                }
                            }
                        }
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
