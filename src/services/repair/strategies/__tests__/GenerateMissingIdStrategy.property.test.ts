/**
 * Property-Based Tests for GenerateMissingIdStrategy
 * 
 * Feature: gist-data-repair, Property 13: Missing ID generation
 * Validates: Requirements 3.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { GenerateMissingIdStrategy } from '../GenerateMissingIdStrategy';
import type { ItemError } from '@/types/dataRepair';

describe('GenerateMissingIdStrategy - Property Tests', () => {
    const strategy = new GenerateMissingIdStrategy();

    /**
     * Property 13: Missing ID generation
     * For any data item missing an ID field, 
     * applying the repair strategy should generate a unique UUID format ID.
     */
    it('Property 13: should generate valid UUID for any missing ID field', () => {
        fc.assert(
            fc.property(
                // Generate random ID field names
                fc.constantFrom('id', 'uuid', 'guid'),
                // Generate random item index
                fc.nat({ max: 1000 }),
                // Generate random data item
                fc.record({
                    someField: fc.anything(),
                }),
                (fieldName, itemIndex, item) => {
                    // Create an error for a missing ID field
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'UUID',
                        message: `Missing required ID field: ${fieldName}`,
                    };

                    // Generate repair value
                    const repairValue = strategy.generateRepairValue(error, item);

                    // Property: The repair value must be a string
                    expect(typeof repairValue).toBe('string');

                    // Property: The string should match UUID format (8-4-4-4-12)
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    expect(repairValue).toMatch(uuidRegex);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should generate unique IDs', () => {
        const error: ItemError = {
            itemIndex: 0,
            field: 'id',
            errorType: 'missing_field',
            currentValue: undefined,
            expectedFormat: 'UUID',
            message: 'Missing ID',
        };

        // Generate multiple IDs
        const generatedIds = new Set<string>();
        const numIds = 100;

        for (let i = 0; i < numIds; i++) {
            const id = strategy.generateRepairValue(error, {});
            generatedIds.add(id);
        }

        // Property: All generated IDs should be unique
        expect(generatedIds.size).toBe(numIds);
    });

    it('should apply to ID-related fields with missing_field error', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('id', 'uuid', 'guid'),
                fc.nat(),
                (fieldName, itemIndex) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'UUID',
                        message: 'Missing ID',
                    };

                    // Strategy should apply to ID fields with missing_field
                    expect(strategy.canApply(error)).toBe(true);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-ID fields', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(
                    s => !['id', 'uuid', 'guid'].includes(s)
                ),
                fc.nat(),
                (fieldName, itemIndex) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: 'missing_field',
                        currentValue: undefined,
                        expectedFormat: 'some format',
                        message: `Missing field: ${fieldName}`,
                    };

                    // Strategy should not apply to non-ID fields
                    expect(strategy.canApply(error)).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should not apply to non-missing_field errors on ID fields', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('id', 'uuid', 'guid'),
                fc.nat(),
                fc.constantFrom('invalid_type', 'invalid_value', 'invalid_format'),
                (fieldName, itemIndex, errorType) => {
                    const error: ItemError = {
                        itemIndex,
                        field: fieldName,
                        errorType: errorType as any,
                        currentValue: 'some-id',
                        expectedFormat: 'UUID',
                        message: 'Error in ID',
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
});
