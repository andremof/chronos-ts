/**
 * chronos-ts
 * A powerful date manipulation library for TypeScript
 * Provides timezone-aware date operations with edge cases handling
 * @module chronos-ts
 */

import { ChronosDate } from './ChronosDate';
import type {
  // Core types for date manipulation
  TimeUnit,
  ChronosDateInput,
  DateBoundary,
  ParseOptions,
} from './types';
/**
 * Export the main ChronosDate class
 */
export { ChronosDate } from './ChronosDate';

/**
 * Export all type definitions for library users
 */
export type {
  // Core types for date manipulation
  TimeUnit,
  ChronosDateInput,

  // Formatting related types
  FormatOptions,
  DatabaseFormat,
  RegionalFormat,

  // Comparison and boundary types
  ComparisonResult,
  DateBoundary,

  // Parsing and difference calculation types
  ParseOptions,
  DateDifference,
} from './types';

/**
 * Creates a ChronosDate instance with the current date and time
 * @example
 * const today = now();
 * console.log(today.formatBR()); // '04/02/2024'
 */
export const now = () => ChronosDate.now();

/**
 * Creates a ChronosDate instance with a specific date
 * @param date Optional date input (Date object, ISO string, or timestamp)
 * @example
 * const date = create('2024-02-04');
 * const date2 = create(new Date());
 * const date3 = create(1706976000000);
 */
export const create = (date?: ChronosDateInput) => ChronosDate.create(date);

/**
 * Helper function to parse a date string with options
 * @param dateStr Date string to parse
 * @param options Parsing options
 * @example
 * const date = parse('2024-02-04', { strict: true });
 */
export const parse = (dateStr: string, options?: ParseOptions) =>
  ChronosDate.parse(dateStr, options);

/**
 * Helper function to get current UTC timestamp
 * Useful for database operations
 * @example
 * const timestamp = getUtcNow();
 * await db.insert({ created_at: timestamp });
 */
export const getUtcNow = () => ChronosDate.now().toDatabase();

/**
 * Helper function to create a date boundary
 * @param unit Time unit to get boundary for
 * @param type Start or end of the boundary
 * @example
 * const startOfMonth = getBoundary('month', 'start');
 * const endOfDay = getBoundary('day', 'end');
 */
export const getBoundary = (unit: DateBoundary['unit'], type: DateBoundary['type']) =>
  ChronosDate.now().getBoundary({ unit, type });

/**
 * Helper function to calculate difference between two dates
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @example
 * const diff = calculateDiff('2024-01-01', '2024-02-04');
 * console.log(diff.days); // 34
 */
export const calculateDiff = (date1: ChronosDateInput, date2: ChronosDateInput) =>
  new ChronosDate(date1).diff(date2);

/**
 * Version number of the library
 * @constant
 */
export const VERSION = '1.0.0';

/**
 * Supported time units for date manipulation
 * @constant
 */
export const SUPPORTED_UNITS: TimeUnit[] = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
];
