/**
 * Property-based tests for ErrorReporter
 * Feature: gist-data-repair, Property 23: JSON export completeness
 * Feature: gist-data-repair, Property 24: Text export completeness
 * Feature: gist-data-repair, Property 25: Report metadata presence
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { errorReporter } from '../ErrorReporter';
import { dataDetector } from '../DataDetector';

describe('ErrorReporter - Property Tests', () => {
    /**
     * Property 23: JSON export completeness
     * For any error report, the JSON export should contain all error details including
     * field names, error types, current values, expected formats, and item identifiers.
     * Validates: Requirements 7.2
     */
    describe('Property 23: JSON export completeness', () => {
        it('should include all error details in JSON export', () => {
            fc.assert(
                fc.property(
                    fc.record({
                        questions: fc.array(
                            fc.record({
                                id: fc.option(fc.string(), { nil: undefined }),
                                title: fc.option(fc.string(), { nil: undefined }),
                                description: fc.option(fc.string(), { nil: undefined }),
                                status: fc.option(fc.string(), { nil: undefined }),
                            }),
                            { minLength: 1, maxLength: 3 },
                        ),
                    }),
                    fc.record({
                        gistId: fc.string({ minLength: 1 }),
                        timestamp: fc.date().map((d) => d.toISOString()),
                        version: fc.string({ minLength: 1 }),
                    }),
                    (data, metadata) => {
                        // Detect errors
                        const detectionResult = dataDetector.detectErrors(data);

                        if (detectionResult.totalErrors === 0) {
                            return true; // No errors to export
                        }

                        // Export to JSON
                        const jsonExport = errorReporter.exportJSON(
                            detectionResult,
                            metadata,
                        );

                        // Parse JSON to verify it's valid
                        const parsed = JSON.parse(jsonExport);

                        // Verify metadata is present
                        expect(parsed.metadata).toBeDefined();
                        expect(parsed.metadata.gistId).toBe(metadata.gistId);
                        expect(parsed.metadata.timestamp).toBe(metadata.timestamp);
                        expect(parsed.metadata.version).toBe(metadata.version);

                        // Verify summary is present
                        expect(parsed.summary).toBeDefined();
                        expect(parsed.summary.totalErrors).toBe(
                            detectionResult.totalErrors,
                        );

                        // Verify errors are present
                        expect(parsed.errors).toBeDefined();

                        // Check that all errors have required fields
                        const allErrors = Object.values(parsed.errors).flat() as any[];
                        for (const error of allErrors) {
                            expect(error.field).toBeDefined();
                            expect(error.errorType).toBeDefined();
                            expect(error.expectedFormat).toBeDefined();
                            expect(error.message).toBeDefined();
                            expect(error.itemIndex).toBeDefined();
                        }
                    },
                ),
                { numRuns: 50 },
            );
        });
    });
});

/**
 * Property 24: Text export completeness
 * For any error report, the text export should contain all error details in a human-readable format
 * including field names, error types, and messages.
 * Validates: Requirements 7.3
 */
describe('Property 24: Text export completeness', () => {
    it('should include all error details in text export', () => {
        fc.assert(
            fc.property(
                fc.record({
                    questions: fc.array(
                        fc.record({
                            id: fc.option(fc.string(), { nil: undefined }),
                            title: fc.option(fc.string(), { nil: undefined }),
                            description: fc.option(fc.string(), { nil: undefined }),
                        }),
                        { minLength: 1, maxLength: 2 },
                    ),
                }),
                fc.record({
                    gistId: fc.string({ minLength: 1 }),
                    timestamp: fc.date().map((d) => d.toISOString()),
                    version: fc.string({ minLength: 1 }),
                }),
                (data, metadata) => {
                    // Detect errors
                    const detectionResult = dataDetector.detectErrors(data);

                    if (detectionResult.totalErrors === 0) {
                        return true; // No errors to export
                    }

                    // Export to text
                    const textExport = errorReporter.exportText(
                        detectionResult,
                        metadata,
                    );

                    // Verify text is not empty
                    expect(textExport.length).toBeGreaterThan(0);

                    // Verify metadata is present in text
                    expect(textExport).toContain(metadata.gistId);
                    expect(textExport).toContain(metadata.timestamp);
                    expect(textExport).toContain(metadata.version);

                    // Verify summary information is present
                    expect(textExport).toContain('错误摘要');
                    expect(textExport).toContain(
                        `总错误数: ${detectionResult.totalErrors}`,
                    );

                    // Verify error details are present
                    const allErrors = Object.values(
                        detectionResult.errorsByType,
                    ).flat();
                    for (const error of allErrors) {
                        // Each error should have its field name mentioned
                        expect(textExport).toContain(error.field);
                        // Each error should have its error type mentioned
                        expect(textExport).toContain(error.errorType);
                    }
                },
            ),
            { numRuns: 50 },
        );
    });
});

/**
 * Property 25: Report metadata presence
 * For any error report (JSON or text), the export should include metadata
 * (Gist ID, timestamp, version).
 * Validates: Requirements 7.4
 */
describe('Property 25: Report metadata presence', () => {
    it('should include metadata in all report formats', () => {
        fc.assert(
            fc.property(
                fc.record({
                    questions: fc.array(
                        fc.record({
                            id: fc.option(fc.string(), { nil: undefined }),
                        }),
                        { minLength: 1, maxLength: 2 },
                    ),
                }),
                fc.record({
                    gistId: fc.string({ minLength: 1 }),
                    timestamp: fc.date().map((d) => d.toISOString()),
                    version: fc.string({ minLength: 1 }),
                }),
                (data, metadata) => {
                    // Detect errors
                    const detectionResult = dataDetector.detectErrors(data);

                    // Export to JSON
                    const jsonExport = errorReporter.exportJSON(
                        detectionResult,
                        metadata,
                    );
                    const parsed = JSON.parse(jsonExport);

                    // Verify JSON metadata
                    expect(parsed.metadata).toBeDefined();
                    expect(parsed.metadata.gistId).toBe(metadata.gistId);
                    expect(parsed.metadata.timestamp).toBe(metadata.timestamp);
                    expect(parsed.metadata.version).toBe(metadata.version);

                    // Export to text
                    const textExport = errorReporter.exportText(
                        detectionResult,
                        metadata,
                    );

                    // Verify text metadata
                    expect(textExport).toContain(metadata.gistId);
                    expect(textExport).toContain(metadata.timestamp);
                    expect(textExport).toContain(metadata.version);
                },
            ),
            { numRuns: 50 },
        );
    });
});
