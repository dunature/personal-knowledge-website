/**
 * Property-Based Tests for AddMissingStringFieldStrategy
 * 
 * Feature: gist-data-repair, Property 9: Missing string field repair
 * Validates: Requirements 3.1
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { AddMissingStringFieldStrategy } from '../AddMissingStringFieldStrategy';
import type { ItemError } from '@/types/dataRepair';

describe('AddMissingStringFieldStrategy - Property Tests', () => {
    const strategy = new AddMissingStringFieldStrategy();

    /**
     * Property 9: Missing string field repair
     * For any data item missing a required string field, 
     * applying the repair strategy should add that field with a string value (empty or default).
     */
    it('Property 9: should add string value for any missing string field', () => {
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
                    // Create an error for a missing string field
                    const error: ItemError = {
                        itemIndex,
                        itemId: item.id,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'string',
                        message: `Missing required field: ${fieldName}`,
                    };

                    // Generate repair value
                    const repairValue = strategy.generateRepairValue(error, item);

                    // Property: The repair value must be a string
                    expect(typeof repairValue).toBe('string');
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
                        expectedFormat: 'string',
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
                        currentValue: 'some value',
                        expectedFormat: 'string',
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

    it('should return known defaults for common fields', () => {
        const commonFields = ['title', 'question', 'answer', 'content', 'description', 'name'];

        commonFields.forEach(fieldName => {
            const error: ItemError = {
                itemIndex: 0,
                field: fieldName,
                errorType: 'missing_field',
                currentValue: undefined,
                expectedFormat: 'string',
                message: `Missing field: ${fieldName}`,
            };

            const repairValue = strategy.generateRepairValue(error, {});

            // Should return a string (empty or default)
            expect(typeof repairValue).toBe('string');
        });
    });
});
