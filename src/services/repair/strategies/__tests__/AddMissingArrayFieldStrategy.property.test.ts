/**
 * Property-Based Tests for AddMissingArrayFieldStrategy
 * 
 * Feature: gist-data-repair, Property 10: Missing array field repair
 * Validates: Requirements 3.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { AddMissingArrayFieldStrategy } from '../AddMissingArrayFieldStrategy';
import type { ItemError } from '@/types/dataRepair';

describe('AddMissingArrayFieldStrategy - Property Tests', () => {
    const strategy = new AddMissingArrayFieldStrategy();

    /**
     * Property 10: Missing array field repair
     * For any data item missing a required array field, 
     * applying the repair strategy should add that field with an empty array value.
     */
    it('Property 10: should add empty array for any missing array field', () => {
        fc.assert(
            fc.property(
                // Generate random field names
                fc.string({ minLength: 1, maxLength: 20 }),
                // Generate random item index
                fc.nat({ max: 1000 }),
                // Generate random data item
                fc.record({
                    id: fc.string(),
                    someOtherField: fc.anything(),
                }),
                (fieldName, itemIndex, item) => {
                    // Create an error for a missing array field
                    const error: ItemError = {
                        itemIndex,
                        itemId: item.id,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'array',
                        message: `Missing required array field: ${fieldName}`,
                    };

                    // Generate repair value
                    const repairValue = strategy.generateRepairValue(error, item);

                    // Property: The repair value must be an array
                    expect(Array.isArray(repairValue)).toBe(true);
                    // Property: The array must be empty
                    expect(repairValue).toHaveLength(0);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should apply to missing_field errors', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.nat(),
                (fieldName, itemIndex) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'array',
                        message: `Missing field: ${fieldName}`,
                    };

                    // Strategy should apply to missing_field errors
                    expect(strategy.canApply(error)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-missing_field errors', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.nat(),
                fc.constantFrom('invalid_type', 'invalid_value', 'invalid_format'),
                (fieldName, itemIndex, errorType) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: errorType as any,
                        currentValue: [],
                        expectedFormat: 'array',
                        message: `Error in field: ${fieldName}`,
                    };

                    // Strategy should not apply to other error types
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should have none or low risk', () => {
        const risk = strategy.estimateRisk();
        expect(['none', 'low']).toContain(risk);
    });

    it('should always return a new empty array instance', () => {
        const error: ItemError = {
            itemIndex: 0,
            field: 'items',
            errorType: 'missing_field',
            currentValue: undefined,
            expectedFormat: 'array',
            message: 'Missing field: items',
        };

        const repairValue1 = strategy.generateRepairValue(error, {});
        const repairValue2 = strategy.generateRepairValue(error, {});

        // Should return different array instances
        expect(repairValue1).not.toBe(repairValue2);
        // Both should be empty arrays
        expect(repairValue1).toEqual([]);
        expect(repairValue2).toEqual([]);
    });
});
