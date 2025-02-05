/**
 * chronos-ts - ChronosDate Class
 * A powerful date manipulation library inspired by date-fns and Carbon
 * Handles timezone and edge cases with a fluent interface
 */

import {
  TimeUnit,
  ChronosDateInput,
  FormatOptions,
  DatabaseFormat,
  ComparisonResult,
  DateBoundary,
  ParseOptions,
  DateDifference,
  RegionalFormat,
} from './types';

/**
 * Main class for date manipulation
 * Provides a fluent interface for common date operations
 */
export class ChronosDate {
  private date: Date;

  /**
   * Creates a new ChronosDate instance
   * @param date Optional date input (Date object, ISO string, or timestamp)
   * @throws {Error} If the provided date is invalid
   */
  constructor(date?: ChronosDateInput) {
    if (date instanceof Date) {
      this.date = new Date(date.toISOString());
    } else if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      this.date = new Date(parsedDate.toISOString());
    } else {
      this.date = new Date(new Date().toISOString());
    }
  }

  /**
   * Creates a new instance with current date and time
   * @returns A new ChronosDate instance
   */
  static now(): ChronosDate {
    return new ChronosDate();
  }

  /**
   * Creates a new instance with a specific date
   * @param date Date input to create instance from
   * @returns A new ChronosDate instance
   */
  static create(date?: ChronosDateInput): ChronosDate {
    return new ChronosDate(date);
  }

  /**
   * Parses a date string with configurable options
   * @param dateStr Date string to parse
   * @param options Parsing options
   * @returns New ChronosDate instance or null if parsing fails and strict mode is off
   * @throws {Error} If parsing fails and strict mode is on
   */
  static parse(dateStr: string, options: ParseOptions = {}): ChronosDate | null {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        if (options.strict !== false) throw new Error('Invalid date');
        return null;
      }
      return new ChronosDate(date);
    } catch (e) {
      if (options.strict !== false) throw e;
      return null;
    }
  }

  /**
   * Creates a clone of the current date instance
   * @returns New ChronosDate instance with the same date
   * @private
   */
  private cloneDate(): Date {
    return new Date(this.date.toISOString());
  }
  /**
   * Generic add method for any time unit
   * @param amount Amount to add (can be negative)
   * @param unit Time unit to add
   * @returns this for method chaining
   */
  add(amount: number, unit: TimeUnit): this {
    const date = this.cloneDate();

    switch (unit) {
      case 'years': {
        const currentDate = date.getUTCDate();
        const currentMonth = date.getUTCMonth();

        // Set to first day to avoid overflow
        date.setUTCDate(1);
        date.setUTCFullYear(date.getUTCFullYear() + amount);

        // Get last day of target month
        const lastDay = new Date(Date.UTC(date.getUTCFullYear(), currentMonth + 1, 0)).getUTCDate();

        // Set to original date or last possible day
        date.setUTCDate(Math.min(currentDate, lastDay));
        break;
      }
      case 'months': {
        const currentDate = date.getUTCDate();
        const targetMonth = date.getUTCMonth() + amount;
        const yearOffset = Math.floor(targetMonth / 12);
        const normalizedMonth = ((targetMonth % 12) + 12) % 12;

        // First adjust year
        date.setUTCFullYear(date.getUTCFullYear() + yearOffset);

        // Then adjust month
        date.setUTCDate(1);
        date.setUTCMonth(normalizedMonth);

        // Finally adjust day
        const lastDay = new Date(
          Date.UTC(date.getUTCFullYear(), normalizedMonth + 1, 0)
        ).getUTCDate();
        date.setUTCDate(Math.min(currentDate, lastDay));
        break;
      }
      case 'weeks':
        date.setUTCDate(date.getUTCDate() + amount * 7);
        break;
      case 'days':
        date.setUTCDate(date.getUTCDate() + amount);
        break;
      case 'hours':
        date.setUTCHours(date.getUTCHours() + amount);
        break;
      case 'minutes':
        date.setUTCMinutes(date.getUTCMinutes() + amount);
        break;
      case 'seconds':
        date.setUTCSeconds(date.getUTCSeconds() + amount);
        break;
    }

    this.date = date;
    return this;
  }

  // Adding methods with specific units
  /**
   * Adds specified number of years
   * @param amount Number of years to add
   */
  addYears(amount: number): this {
    return this.add(amount, 'years');
  }

  /**
   * Adds specified number of months
   * @param amount Number of months to add
   */
  addMonths(amount: number): this {
    return this.add(amount, 'months');
  }

  /**
   * Adds specified number of weeks
   * @param amount Number of weeks to add
   */
  addWeeks(amount: number): this {
    return this.add(amount, 'weeks');
  }

  /**
   * Adds specified number of days
   * @param amount Number of days to add
   */
  addDays(amount: number): this {
    return this.add(amount, 'days');
  }

  /**
   * Adds specified number of hours
   * @param amount Number of hours to add
   */
  addHours(amount: number): this {
    return this.add(amount, 'hours');
  }

  /**
   * Adds specified number of minutes
   * @param amount Number of minutes to add
   */
  addMinutes(amount: number): this {
    return this.add(amount, 'minutes');
  }

  /**
   * Adds specified number of seconds
   * @param amount Number of seconds to add
   */
  addSeconds(amount: number): this {
    return this.add(amount, 'seconds');
  }

  // Subtracting methods
  /**
   * Subtracts specified number of years
   * @param amount Number of years to subtract
   */
  subYears(amount: number): this {
    return this.add(-amount, 'years');
  }

  /**
   * Subtracts specified number of months
   * @param amount Number of months to subtract
   */
  subMonths(amount: number): this {
    return this.add(-amount, 'months');
  }

  /**
   * Subtracts specified number of weeks
   * @param amount Number of weeks to subtract
   */
  subWeeks(amount: number): this {
    return this.add(-amount, 'weeks');
  }

  /**
   * Subtracts specified number of days
   * @param amount Number of days to subtract
   */
  subDays(amount: number): this {
    return this.add(-amount, 'days');
  }

  /**
   * Subtracts specified number of hours
   * @param amount Number of hours to subtract
   */
  subHours(amount: number): this {
    return this.add(-amount, 'hours');
  }

  /**
   * Subtracts specified number of minutes
   * @param amount Number of minutes to subtract
   */
  subMinutes(amount: number): this {
    return this.add(-amount, 'minutes');
  }

  /**
   * Subtracts specified number of seconds
   * @param amount Number of seconds to subtract
   */
  subSeconds(amount: number): this {
    return this.add(-amount, 'seconds');
  }
  /**
   * Formats date in Brazilian format (dd/mm/yyyy)
   * @param includeTime Whether to include time in output
   * @returns Formatted date string
   */
  formatBR(includeTime: boolean = false): string {
    const day = String(this.date.getUTCDate()).padStart(2, '0');
    const month = String(this.date.getUTCMonth() + 1).padStart(2, '0');
    const year = this.date.getUTCFullYear();

    if (!includeTime) {
      return `${day}/${month}/${year}`;
    }

    const hours = String(this.date.getUTCHours()).padStart(2, '0');
    const minutes = String(this.date.getUTCMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Formats date in US format (mm/dd/yyyy)
   * @param includeTime Whether to include time in output
   * @returns Formatted date string
   */
  formatUS(includeTime: boolean = false): string {
    const month = String(this.date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(this.date.getUTCDate()).padStart(2, '0');
    const year = this.date.getUTCFullYear();

    if (!includeTime) {
      return `${month}/${day}/${year}`;
    }

    const hours = String(this.date.getUTCHours()).padStart(2, '0');
    const minutes = String(this.date.getUTCMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  /**
   * Formats date according to provided options
   * @param options Formatting options
   * @returns Formatted date string
   */
  format(options: FormatOptions = {}): string {
    const { includeTime = false, includeSeconds = false } = options;

    const date = this.toDate();
    if (!includeTime) return date;

    if (includeSeconds) return this.toDateTime();

    const hours = String(this.date.getUTCHours()).padStart(2, '0');
    const minutes = String(this.date.getUTCMinutes()).padStart(2, '0');
    return `${date} ${hours}:${minutes}`;
  }

  /**
   * Returns date in ISO format for database storage
   * @returns ISO formatted date string
   */
  toDatabase(): string {
    return this.date.toISOString();
  }

  /**
   * Returns date in YYYY-MM-DD format
   * @returns Date string
   */
  toDate(): string {
    return this.date.toISOString().split('T')[0];
  }

  /**
   * Returns date and time in YYYY-MM-DD HH:mm:ss format
   * @returns Date and time string
   */
  toDateTime(): string {
    const date = this.toDate();
    const hours = String(this.date.getUTCHours()).padStart(2, '0');
    const minutes = String(this.date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(this.date.getUTCSeconds()).padStart(2, '0');
    return `${date} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Compares this date with another date
   * @param other Date to compare with
   * @returns -1 if this date is earlier, 0 if equal, 1 if later
   */
  compareTo(other: ChronosDateInput): ComparisonResult {
    const otherDate = new Date(other);
    const diff = this.date.getTime() - otherDate.getTime();
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return 0;
  }

  /**
   * Calculates the difference between this date and another
   * @param other Date to calculate difference with
   * @returns Object containing difference breakdown
   */
  diff(other: ChronosDateInput): DateDifference {
    const otherDate = new Date(other);
    const diff = this.date.getTime() - otherDate.getTime();

    const milliseconds = Math.abs(diff);
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const monthsDiff =
      (this.date.getUTCFullYear() - otherDate.getUTCFullYear()) * 12 +
      (this.date.getUTCMonth() - otherDate.getUTCMonth());

    const years = Math.floor(Math.abs(monthsDiff) / 12);
    const months = Math.abs(monthsDiff) % 12;

    return {
      years,
      months,
      days: days % 30,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      milliseconds: milliseconds % 1000,
      total: milliseconds,
    };
  }
  /**
   * Checks if date is in the future
   * @returns true if date is in the future
   */
  isFuture(): boolean {
    return this.date > new Date();
  }

  /**
   * Checks if date is in the past
   * @returns true if date is in the past
   */
  isPast(): boolean {
    return this.date < new Date();
  }

  /**
   * Checks if date is today
   * @returns true if date is today
   */
  isToday(): boolean {
    const today = new Date();
    return this.toDate() === new Date(today.toISOString()).toISOString().split('T')[0];
  }

  /**
   * Gets boundary of a time unit (start or end)
   * @param options Boundary options
   * @returns Modified ChronosDate instance
   */
  getBoundary(options: DateBoundary): this {
    const { type, unit } = options;

    switch (unit) {
      case 'day':
        return type === 'start' ? this.startOfDay() : this.endOfDay();
      case 'month':
        return type === 'start' ? this.startOfMonth() : this.endOfMonth();
      case 'week': {
        const day = this.date.getUTCDay();
        const diff = type === 'start' ? -day : 6 - day;
        return this.addDays(diff)[type === 'start' ? 'startOfDay' : 'endOfDay']();
      }
      case 'year': {
        if (type === 'start') {
          this.date.setUTCMonth(0, 1);
          return this.startOfDay();
        } else {
          this.date.setUTCMonth(11, 31);
          return this.endOfDay();
        }
      }
    }
  }

  /**
   * Sets time to start of day (00:00:00)
   * @returns Modified ChronosDate instance
   */
  startOfDay(): this {
    this.date.setUTCHours(0, 0, 0, 0);
    return this;
  }

  /**
   * Sets time to end of day (23:59:59)
   * @returns Modified ChronosDate instance
   */
  endOfDay(): this {
    this.date.setUTCHours(23, 59, 59, 999);
    return this;
  }

  /**
   * Sets date to start of month
   * @returns Modified ChronosDate instance
   */
  startOfMonth(): this {
    this.date.setUTCDate(1);
    return this.startOfDay();
  }

  /**
   * Sets date to end of month
   * @returns Modified ChronosDate instance
   */
  endOfMonth(): this {
    const currentYear = this.date.getUTCFullYear();
    const currentMonth = this.date.getUTCMonth();
    const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
    this.date = lastDay;
    return this.endOfDay();
  }

  /**
   * Sets date to start of week (Sunday)
   * @returns Modified ChronosDate instance
   */
  startOfWeek(): this {
    const day = this.date.getUTCDay();
    this.date.setUTCDate(this.date.getUTCDate() - day);
    return this.startOfDay();
  }

  /**
   * Sets date to end of week (Saturday)
   * @returns Modified ChronosDate instance
   */
  endOfWeek(): this {
    const day = this.date.getUTCDay();
    this.date.setUTCDate(this.date.getUTCDate() + (6 - day));
    return this.endOfDay();
  }

  /**
   * Sets date to start of year
   * @returns Modified ChronosDate instance
   */
  startOfYear(): this {
    this.date.setUTCMonth(0, 1);
    return this.startOfDay();
  }

  /**
   * Sets date to end of year
   * @returns Modified ChronosDate instance
   */
  endOfYear(): this {
    this.date.setUTCMonth(11, 31);
    return this.endOfDay();
  }
}
