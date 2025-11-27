// src/utils/dateUtils.js
import { AppError } from './AppError.js';

/**
 * Parse various date input formats and return a valid Date object or null
 * @param {string|Date} fechaInput - The date input to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const parseFechaInput = (fechaInput) => {
    if (!fechaInput) {
        return null;
    }

    if (fechaInput instanceof Date) {
        return Number.isNaN(fechaInput.getTime()) ? null : fechaInput;
    }

    if (typeof fechaInput === 'string') {
        const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
        const trimmed = fechaInput.trim();

        // Handle YYYY-MM-DD format specifically
        if (dateOnlyRegex.test(trimmed)) {
            return new Date(`${trimmed}T00:00:00`);
        }

        const parsed = new Date(trimmed);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(fechaInput);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Validate that a date string is in a valid format
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateFormat = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
        return false;
    }

    const parsed = parseFechaInput(dateString);
    return parsed !== null;
};

/**
 * Validate that startDate is before or equal to endDate
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean} - True if valid range
 */
export const isValidDateRange = (startDate, endDate) => {
    const start = parseFechaInput(startDate);
    const end = parseFechaInput(endDate);

    if (!start || !end) {
        return false;
    }

    return start <= end;
};

/**
 * Parse and validate a date input, throwing an error if invalid
 * @param {string|Date} fechaInput - The date input to parse
 * @param {string} fieldName - Name of the field for error message
 * @returns {Date} - Parsed date
 * @throws {AppError} - If date is invalid
 */
export const parseFechaOrThrow = (fechaInput, fieldName = 'fecha') => {
    const parsed = parseFechaInput(fechaInput);

    if (!parsed) {
        throw new AppError(`${fieldName} inválida`, 400);
    }

    return parsed;
};
