/**
 * Property-Based Tests for FixInvalidStatusStrategy
 * 
 * Feature: gist-data-repair, Property 11: Invalid status repair
 * Validates: Requirements 3.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FixInvalidStatusStrategy } from '../FixInvalidStatusStrategy';
import type { ItemError } from '@/types/dataRepair';

describe('FixInvalidStatusStrategy - Property Tests', () => {
    const strategy = new FixInvalidStatusStrategy();

    /**
     * Property 11: Invalid status repair
     * For any data item with an invalid status value, 
     * applying the repair strategy should set the status field to 'unsolved'.
     */
    it('Property 11: should set status to "unsolved" for any invalid status value', () => {
        fc.assert(
            fc.property(
                // Generate random invalid status values (anything except valid statuses)
                fc.oneof(
                    fc.string(),
                    fc.integer(),
                    fc.boolean(),
                    fc.constant(null),
                    fc.constant(undefined),
                    fc.array(fc.anything()),
                    fc.object()
                ),
                // Generate random item index
                fc.nat({ max: 1000 }),
                // Generate random data item
                fc.record({
                    id: fc.string(),
                    status: fc.anything(),
                }),
                (invalidStatus, itemIndex, item) => {
                    // Create an error for an invalid status field
                    const error: ItemError = {
                        itemIndex,
                        itemId: item.id,
                        field: 'status',
                        errorType: 'invalid_value',
                        currentValue: invalidStatus,
                        expectedFormat: 'one of: solved, unsolved, in_progress',
                        message: `Invalid status value: ${invalidStatus}`,
                    };

                    // Generate repair value
                    const repairValue = strategy.generateRepairValue(error, item);

                    // Property: The repair value must be 'unsolved'
                    expect(repairValue).toBe('unsolved');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should only apply to status field with invalid_value error', () => {
        fc.assert(
            fc.property(
                fc.nat(),
                fc.anything(),
                (itemIndex, invalidValue) => {
                    const error: ItemError = {
                        itemIndex,
                        field: 'status',
                        errorType: 'invalid_value',
                        currentValue: invalidValue,
                        expectedFormat: 'valid status',
                        message: 'Invalid status',
                    };

                    // Strategy should apply to status field with invalid_value
                    expect(strategy.canApply(error)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-status fields', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(s => s !== 'status'),
                fc.nat(),
                (fieldName, itemIndex) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'invalid_value',
                        currentValue: 'some value',
                        expectedFormat: 'some format',
                        message: `Invalid field: ${fieldName}`,
                    };

                    // Strategy should not apply to non-status fields
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-invalid_value errors on status field', () => {
        fc.assert(
            fc.property(
                fc.nat(),
                fc.constantFrom('missing_field', 'invalid_type', 'invalid_format'),
                (itemIndex, errorType) => {
                    const error: ItemError = {
                        itemIndex,
                        field: 'status',
                        errorType: errorType as any,
                        currentValue: undefined,
                        expectedFormat: 'valid status',
                        message: 'Error in status',
                    };

                    // Strategy should not apply to other error types
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should have low risk', () => {
        const risk = strategy.estimateRisk();
        expect(['none', 'low']).toContain(risk);
    });
});
