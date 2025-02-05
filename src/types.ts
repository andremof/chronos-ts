/**
 * Available time units for date manipulation
 * These can be used with add() and subtract() methods
 */
export type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

/**
 * Valid input types for creating a new ChronosDate instance
 * Can be a JavaScript Date object, an ISO string, or a timestamp number
 */
export type ChronosDateInput = Date | string | number;

/**
 * Options for date formatting methods
 */
export interface FormatOptions {
  /**
   * Whether to include time in the output
   * When true, adds HH:mm to the date format
   * @default false
   */
  includeTime?: boolean;

  /**
   * Whether to include seconds in time output
   * Only applies when includeTime is true
   * @default false
   */
  includeSeconds?: boolean;
}

/**
 * Supported database format types
 * - 'iso': Full ISO string (e.g., "2024-02-04T12:00:00.000Z")
 * - 'date': Date only (e.g., "2024-02-04")
 * - 'datetime': Date and time (e.g., "2024-02-04 12:00:00")
 */
export type DatabaseFormat = 'iso' | 'date' | 'datetime';

/**
 * Regional format identifiers
 * Used internally for region-specific formatting
 */
export type RegionalFormat = 'BR' | 'US';

/**
 * Comparison results for date comparisons
 * Negative: date is before comparison date
 * Zero: dates are equal
 * Positive: date is after comparison date
 */
export type ComparisonResult = -1 | 0 | 1;

/**
 * Date boundary options
 * Used for getting start/end boundaries of time units
 */
export interface DateBoundary {
  /**
   * Start or end of the boundary
   */
  type: 'start' | 'end';

  /**
   * Time unit to get boundary for
   * @example 'day' for start/end of day
   * @example 'month' for start/end of month
   */
  unit: 'day' | 'week' | 'month' | 'year';
}

/**
 * Configuration for date parsing
 */
export interface ParseOptions {
  /**
   * Whether to throw error on invalid date
   * If false, returns null for invalid dates
   * @default true
   */
  strict?: boolean;

  /**
   * Default timezone to use when none is specified
   * @default 'UTC'
   */
  defaultTimezone?: string;
}

/**
 * Result of a date difference calculation
 * Contains the difference broken down into various units
 */
export interface DateDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  /**
   * Total difference in milliseconds
   */
  total: number;
}
