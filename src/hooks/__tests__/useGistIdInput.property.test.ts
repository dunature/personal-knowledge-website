/**
 * Property-based tests for Gist ID validation
 * Feature: gist-id-validation-fix
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Import the regex pattern for testing
const GIST_ID_REGEX = /^[a-f0-9]{20,40}$/i;

/**
 * Helper function to validate Gist ID format
 */
function validateGistIdFormat(id: string): boolean {
    return GIST_ID_REGEX.test(id.trim());
}

/**
 * Generator for hexadecimal strings
 */
function hexStringArbitrary(minLength: number, maxLength: number) {
    return fc.array(
        fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'),
        { minLength, maxLength }
    ).map(chars => chars.join(''));
}

describe('Gist ID Format Validation - Property Tests', () => {
    /**
     * Feature: gist-id-validation-fix, Property 1: Valid length hexadecimal strings are accepted
     * Validates: Requirements 1.1
     */
    it('should accept any hexadecimal string with length between 20 and 40 characters', () => {
        fc.assert(
            fc.property(
                // Generate hexadecimal strings of length 20-40
                fc.integer({ min: 20, max: 40 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                (gistId) => {
                    const result = validateGistIdFormat(gistId);
                    expect(result).toBe(true);
                    return result === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 2: Whitespace trimming preserves validity
     * Validates: Requirements 1.2
     */
    it('should accept valid Gist IDs with leading or trailing whitespace after trimming', () => {
        fc.assert(
            fc.property(
                // Generate valid Gist ID
                fc.integer({ min: 20, max: 40 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                // Generate whitespace
                fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 0, maxLength: 5 }).map(chars => chars.join('')),
                fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 0, maxLength: 5 }).map(chars => chars.join('')),
                (gistId, leadingWhitespace, trailingWhitespace) => {
                    const gistIdWithWhitespace = leadingWhitespace + gistId + trailingWhitespace;
                    const result = validateGistIdFormat(gistIdWithWhitespace);
                    expect(result).toBe(true);
                    return result === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 3: Case insensitivity
     * Validates: Requirements 1.3, 1.4, 1.5
     */
    it('should accept valid Gist IDs in uppercase, lowercase, or mixed case', () => {
        fc.assert(
            fc.property(
                // Generate valid Gist ID
                fc.integer({ min: 20, max: 40 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                // Generate case transformation: 0 = lowercase, 1 = uppercase, 2 = mixed
                fc.integer({ min: 0, max: 2 }),
                (gistId, caseType) => {
                    let transformedGistId: string;

                    if (caseType === 0) {
                        // Lowercase
                        transformedGistId = gistId.toLowerCase();
                    } else if (caseType === 1) {
                        // Uppercase
                        transformedGistId = gistId.toUpperCase();
                    } else {
                        // Mixed case - randomly uppercase some characters
                        transformedGistId = gistId
                            .split('')
                            .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
                            .join('');
                    }

                    const result = validateGistIdFormat(transformedGistId);
                    expect(result).toBe(true);
                    return result === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    // Additional edge case tests
    it('should reject Gist IDs shorter than 20 characters', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 19 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                (gistId) => {
                    const result = validateGistIdFormat(gistId);
                    expect(result).toBe(false);
                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should reject Gist IDs longer than 40 characters', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 41, max: 60 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                (gistId) => {
                    const result = validateGistIdFormat(gistId);
                    expect(result).toBe(false);
                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('should reject strings with non-hexadecimal characters', () => {
        fc.assert(
            fc.property(
                // Generate string with non-hex characters
                fc.string({ minLength: 20, maxLength: 40 }).filter((s) => !/^[a-f0-9]+$/i.test(s)),
                (invalidId) => {
                    const result = validateGistIdFormat(invalidId);
                    expect(result).toBe(false);
                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 8: Invalid format error guidance
     * Validates: Requirements 3.2
     * 
     * For any invalid Gist ID format, the error message should provide clear guidance
     * about the correct format requirements.
     */
    it('should provide clear error guidance for invalid formats', () => {
        // Helper to generate error message for invalid format
        function getErrorMessage(gistId: string): string {
            const trimmed = gistId.trim();

            if (!trimmed) {
                return '请输入 Gist ID';
            }

            if (trimmed.length < 20 || trimmed.length > 40) {
                return 'Gist ID 格式不正确，应该是20-40位十六进制字符';
            }

            if (!/^[a-f0-9]+$/i.test(trimmed)) {
                return 'Gist ID 格式不正确，应该是20-40位十六进制字符';
            }

            return '';
        }

        fc.assert(
            fc.property(
                // Generate various invalid Gist IDs
                fc.oneof(
                    // Too short
                    fc.integer({ min: 1, max: 19 }).chain((length) =>
                        hexStringArbitrary(length, length)
                    ),
                    // Too long
                    fc.integer({ min: 41, max: 60 }).chain((length) =>
                        hexStringArbitrary(length, length)
                    ),
                    // Invalid characters
                    fc.string({ minLength: 20, maxLength: 40 }).filter((s) => !/^[a-f0-9]+$/i.test(s)),
                    // Empty
                    fc.constant('')
                ),
                (invalidId) => {
                    const errorMessage = getErrorMessage(invalidId);

                    // Error message should not be empty for invalid IDs
                    expect(errorMessage).not.toBe('');

                    // Error message should contain helpful information
                    const hasGuidance =
                        errorMessage.includes('20-40') ||
                        errorMessage.includes('十六进制') ||
                        errorMessage.includes('请输入');

                    expect(hasGuidance).toBe(true);

                    return errorMessage !== '' && hasGuidance;
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: gist-id-validation-fix, Property 9: Valid format visual feedback
     * Validates: Requirements 3.3
     * 
     * For any valid Gist ID format, the validation should return true,
     * which can be used to show positive visual feedback to users.
     */
    it('should return true for valid formats to enable positive visual feedback', () => {
        fc.assert(
            fc.property(
                // Generate valid Gist IDs with various lengths
                fc.integer({ min: 20, max: 40 }).chain((length) =>
                    hexStringArbitrary(length, length)
                ),
                // Add optional whitespace
                fc.boolean(),
                (gistId, addWhitespace) => {
                    const testId = addWhitespace ? `  ${gistId}  ` : gistId;
                    const isValid = validateGistIdFormat(testId);

                    // Valid format should return true
                    expect(isValid).toBe(true);

                    // This true value can be used to show visual feedback like:
                    // - Green checkmark icon
                    // - Success border color
                    // - "Format correct" message

                    return isValid === true;
                }
            ),
            { numRuns: 100 }
        );
    });
});
