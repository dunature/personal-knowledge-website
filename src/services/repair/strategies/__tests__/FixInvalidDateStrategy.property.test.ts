/**
 * Property-Based Tests for FixInvalidDateStrategy
 * 
 * Feature: gist-data-repair, Property 12: Invalid date repair
 * Validates: Requirements 3.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FixInvalidDateStrategy } from '../FixInvalidDateStrategy';
import type { ItemError } from '@/types/dataRepair';

describe('FixInvalidDateStrategy - Property Tests', () => {
    const strategy = new FixInvalidDateStrategy();

    /**
     * Property 12: Invalid date repair
     * For any data item with a missing or invalid date field, 
     * applying the repair strategy should set the field to a valid ISO 8601 timestamp.
     */
    it('Property 12: should generate valid ISO 8601 timestamp for any invalid date', () => {
        fc.assert(
            fc.property(
                // Generate random date field names
                fc.constantFrom('created_at', 'updated_at', 'date', 'timestamp'),
                // Generate random invalid date values
                fc.oneof(
                    fc.string(),
                    fc.integer(),
                    fc.boolean(),
                    fc.constant(null),
                    fc.constant(undefined),
                    fc.constant('invalid-date'),
                    fc.constant('2024-13-45') // Invalid date
                ),
                // Generate random item index
                fc.nat({ max: 1000 }),
                (fieldName, invalidDate, itemIndex) => {
                    // Create an error for an invalid date field
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'invalid_value',
                        currentValue: invalidDate,
                        expectedFormat: 'ISO 8601 date string',
                        message: `Invalid date value: ${invalidDate}`,
                    };

                    // Generate repair value
                    const repairValue = strategy.generateRepairValue(error, {});

                    // Property: The repair value must be a valid ISO 8601 string
                    expect(typeof repairValue).toBe('string');

                    // Property: The string should be parseable as a valid date
                    const parsedDate = new Date(repairValue);
                    expect(parsedDate.toString()).not.toBe('Invalid Date');

                    // Property: The ISO string should match the expected format
                    expect(repairValue).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should apply to date-related fields with invalid_value error', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('created_at', 'updated_at', 'date', 'timestamp'),
                fc.nat(),
                fc.anything(),
                (fieldName, itemIndex, invalidValue) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'invalid_value',
                        currentValue: invalidValue,
                        expectedFormat: 'ISO 8601',
                        message: 'Invalid date',
                    };

                    // Strategy should apply to date fields with invalid_value
                    expect(strategy.canApply(error)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-date fields', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(
                    s => !['created_at', 'updated_at', 'date', 'timestamp'].includes(s)
                ),
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

                    // Strategy should not apply to non-date fields
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-date-related error types on date fields', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('created_at', 'updated_at', 'date', 'timestamp'),
                fc.nat(),
                fc.constantFrom('invalid_type', 'invalid_format'),
                (fieldName, itemIndex, errorType) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: errorType as any,
                        currentValue: undefined,
                        expectedFormat: 'ISO 8601',
                        message: 'Error in date',
                    };

                    // Strategy should not apply to these error types
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should have medium risk', () => {
        const risk = strategy.estimateRisk();
        expect(risk).toBe('medium');
    });

    it('should generate timestamps close to current time', () => {
        const error: ItemError = {
            itemIndex: 0,
            field: 'created_at',
            errorType: 'invalid_value',
            currentValue: 'invalid',
            expectedFormat: 'ISO 8601',
            message: 'Invalid date',
        };

        const beforeTime = Date.now();
        const repairValue = strategy.generateRepairValue(error, {});
        const afterTime = Date.now();

        const repairedTime = new Date(repairValue).getTime();

        // The generated timestamp should be between before and after
        expect(repairedTime).toBeGreaterThanOrEqual(beforeTime);
        expect(repairedTime).toBeLessThanOrEqual(afterTime);
    });
});
