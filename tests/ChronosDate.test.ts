import { ChronosDate } from '../src/ChronosDate';

describe('ChronosDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-02-04T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ChronosDate Constructor and Parsing', () => {
    it('should create instance with current date', () => {
      const now = ChronosDate.now();
      expect(now).toBeInstanceOf(ChronosDate);
      expect(now.toDate()).toBe('2024-02-04');
    });

    it('should create instance with specific date', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');
      expect(date).toBeInstanceOf(ChronosDate);
      expect(date.toDate()).toBe('2024-02-04');
    });

    // Coverage for line 9 - constructor with Date object
    it('should create instance with Date object', () => {
      const dateObj = new Date('2024-02-04T12:00:00.000Z');
      const date = new ChronosDate(dateObj);
      expect(date.toDate()).toBe('2024-02-04');
    });

    // Coverage for different constructor input types
    it('should handle different input types', () => {
      const timestamp = new Date('2024-02-04').getTime();
      const fromTimestamp = new ChronosDate(timestamp);
      expect(fromTimestamp.toDate()).toBe('2024-02-04');

      const fromString = new ChronosDate('2024-02-04');
      expect(fromString.toDate()).toBe('2024-02-04');
    });

    it('should parse dates with different options', () => {
      const validDate = '2024-02-04';
      const invalidDate = 'not-a-date';

      // Test successful parsing
      expect(ChronosDate.parse(validDate)).toBeInstanceOf(ChronosDate);

      // Test failed parsing with different strict modes
      expect(ChronosDate.parse(invalidDate, { strict: false })).toBeNull();
      expect(() => ChronosDate.parse(invalidDate, { strict: true })).toThrow();

      // Test date parsing without time
      const parsed = ChronosDate.parse('2024-02-04');
      expect(parsed?.toDate()).toBe('2024-02-04');
    });
  });

  describe('Time Units', () => {
    it('should handle all time units correctly', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');

      // Test each time unit separately to avoid chaining effects
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'seconds').toDateTime()).toBe(
        '2024-02-04 12:00:01'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'minutes').toDateTime()).toBe(
        '2024-02-04 12:01:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'hours').toDateTime()).toBe(
        '2024-02-04 13:00:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'days').toDateTime()).toBe(
        '2024-02-05 12:00:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'weeks').toDateTime()).toBe(
        '2024-02-11 12:00:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'months').toDateTime()).toBe(
        '2024-03-04 12:00:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(1, 'years').toDateTime()).toBe(
        '2025-02-04 12:00:00'
      );
    });
  });
  describe('Add Methods', () => {
    let date: ChronosDate;

    beforeEach(() => {
      date = ChronosDate.create('2024-02-04T12:00:00.000Z');
    });

    it('should add years correctly', () => {
      expect(date.addYears(1).toDate()).toBe('2025-02-04');
    });

    it('should add months correctly', () => {
      expect(date.addMonths(2).toDate()).toBe('2024-04-04');
    });

    it('should add weeks correctly', () => {
      expect(date.addWeeks(1).toDate()).toBe('2024-02-11');
    });

    it('should add days correctly', () => {
      expect(date.addDays(5).toDate()).toBe('2024-02-09');
    });

    it('should add hours correctly', () => {
      expect(date.addHours(2).toDateTime()).toBe('2024-02-04 14:00:00');
    });

    it('should add minutes correctly', () => {
      expect(date.addMinutes(30).toDateTime()).toBe('2024-02-04 12:30:00');
    });

    it('should add seconds correctly', () => {
      expect(date.addSeconds(30).toDateTime()).toBe('2024-02-04 12:00:30');
    });

    it('should support method chaining', () => {
      const result = date.addDays(1).addHours(2).addMinutes(30).toDateTime();

      expect(result).toBe('2024-02-05 14:30:00');
    });

    // Coverage for lines 80-81, 95 - month edge cases
    it('should handle month edge cases', () => {
      // Test for month with fewer days
      const dateEnd = ChronosDate.create('2024-03-31');
      expect(dateEnd.addMonths(1).toDate()).toBe('2024-04-30');

      // Test for leap year
      const dateLeap = ChronosDate.create('2024-01-31');
      expect(dateLeap.addMonths(1).toDate()).toBe('2024-02-29');

      // Test for negative month
      const dateNeg = ChronosDate.create('2024-01-01');
      expect(dateNeg.addMonths(-13).toDate()).toBe('2022-12-01');
    });
  });

  describe('Complex Time Calculations', () => {
    it('should handle month calculations with year overflow', () => {
      // Test month addition that causes year change
      const date = ChronosDate.create('2024-12-15T12:00:00.000Z');
      expect(date.addMonths(2).toDate()).toBe('2025-02-15');

      // Test month subtraction that causes year change
      const date2 = ChronosDate.create('2024-01-15T12:00:00.000Z');
      expect(date2.addMonths(-2).toDate()).toBe('2023-11-15');
    });

    it('should handle month edge cases with varying days', () => {
      // Test January 31 to February (leap year)
      const date1 = ChronosDate.create('2024-01-31T12:00:00.000Z');
      expect(date1.addMonths(1).toDate()).toBe('2024-02-29');

      // Test January 31 to February (non-leap year)
      const date2 = ChronosDate.create('2023-01-31T12:00:00.000Z');
      expect(date2.addMonths(1).toDate()).toBe('2023-02-28');

      // Test March 31 to April 30
      const date3 = ChronosDate.create('2024-03-31T12:00:00.000Z');
      expect(date3.addMonths(1).toDate()).toBe('2024-04-30');
    });

    it('should handle month-by-month subtraction', () => {
      // For each test, create a new instance to avoid cumulative effects
      expect(ChronosDate.create('2024-01-01').addMonths(-1).toDate()).toBe('2023-12-01');
      expect(ChronosDate.create('2024-01-01').addMonths(-12).toDate()).toBe('2023-01-01'); // Exactly one year
      expect(ChronosDate.create('2024-01-01').addMonths(-13).toDate()).toBe('2022-12-01'); // One year and one month
      expect(ChronosDate.create('2024-01-01').addMonths(-24).toDate()).toBe('2022-01-01'); // Exactly two years
      expect(ChronosDate.create('2024-01-01').addMonths(-25).toDate()).toBe('2021-12-01'); // Two years and one month
    });

    it('should handle extreme month calculations', () => {
      const date = ChronosDate.create('2024-01-01T12:00:00.000Z');

      // Test very large positive months
      const resultPlus = date.addMonths(25);
      expect(resultPlus.toDate()).toBe('2026-02-01');

      // Reset date for next test
      const date2 = ChronosDate.create('2024-01-01T12:00:00.000Z');

      // Test very large negative months
      // Going backwards 25 months from 2024-01-01:
      // - 24 months = 2 complete years (2024 -> 2022)
      // - 1 additional month = December
      // Therefore: 2021-12-01
      const resultMinus = date2.addMonths(-25);
      expect(resultMinus.toDate()).toBe('2021-12-01');

      // Reset date for next test
      const date3 = ChronosDate.create('2024-01-01T12:00:00.000Z');

      // Test full year cycles (48 months = exactly 4 years)
      const resultCycle = date3.addMonths(48);
      expect(resultCycle.toDate()).toBe('2028-01-01');
    });
    it('should properly normalize months', () => {
      const date = ChronosDate.create('2024-01-31T12:00:00.000Z');

      // Test multiple month additions through various month lengths
      const result = date
        .addMonths(1) // February 29 (leap year)
        .addMonths(1) // March 29
        .addMonths(1) // April 29
        .addMonths(1) // May 29
        .addMonths(1); // June 29

      expect(result.toDate()).toBe('2024-06-29');
    });

    it('should handle complex time operations', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');

      // Test complex chaining with both addition and subtraction
      const result = date
        .add(1, 'months')
        .add(-2, 'days')
        .add(3, 'hours')
        .add(-30, 'minutes')
        .add(15, 'seconds')
        .toDateTime();

      expect(result).toBe('2024-03-02 14:30:15');
    });

    it('should handle negative time operations', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');

      // Test negative values separately
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-1, 'years').toDate()).toBe(
        '2023-02-04'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-2, 'months').toDate()).toBe(
        '2023-12-04'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-1, 'weeks').toDate()).toBe(
        '2024-01-28'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-5, 'days').toDate()).toBe(
        '2024-01-30'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-12, 'hours').toDateTime()).toBe(
        '2024-02-04 00:00:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-30, 'minutes').toDateTime()).toBe(
        '2024-02-04 11:30:00'
      );
      expect(ChronosDate.create('2024-02-04T12:00:00.000Z').add(-30, 'seconds').toDateTime()).toBe(
        '2024-02-04 11:59:30'
      );
    });
  });

  describe('Subtract Methods', () => {
    let date: ChronosDate;

    beforeEach(() => {
      date = ChronosDate.create('2024-02-04T12:00:00.000Z');
    });

    it('should subtract years correctly', () => {
      expect(date.subYears(1).toDate()).toBe('2023-02-04');
    });

    it('should subtract months correctly', () => {
      expect(date.subMonths(2).toDate()).toBe('2023-12-04');
    });

    it('should subtract weeks correctly', () => {
      expect(date.subWeeks(1).toDate()).toBe('2024-01-28');
    });

    it('should subtract days correctly', () => {
      expect(date.subDays(5).toDate()).toBe('2024-01-30');
    });

    // Coverage for lines 105-107 - time unit subtraction methods
    it('should handle hours, minutes and seconds subtraction', () => {
      const baseDate = ChronosDate.create('2024-02-04T12:00:00.000Z');

      // Test basic subtractions
      expect(baseDate.subHours(2).toDateTime()).toBe('2024-02-04 10:00:00');
      expect(baseDate.subMinutes(30).toDateTime()).toBe('2024-02-04 09:30:00');
      expect(baseDate.subSeconds(15).toDateTime()).toBe('2024-02-04 09:29:45');

      // Test crossing day boundary
      const midnight = ChronosDate.create('2024-02-04T00:30:00.000Z');
      expect(midnight.subHours(1).toDateTime()).toBe('2024-02-03 23:30:00');
      expect(midnight.subMinutes(45).toDateTime()).toBe('2024-02-03 22:45:00');
      expect(midnight.subSeconds(3600).toDateTime()).toBe('2024-02-03 21:45:00'); // 1 hour in seconds
    });

    // Coverage for lines 102-104 - subtraction edge cases
    it('should handle subtraction edge cases', () => {
      const date = ChronosDate.create('2024-03-31');
      expect(date.subMonths(1).toDate()).toBe('2024-02-29');

      const dateLeap = ChronosDate.create('2024-02-29');
      expect(dateLeap.subYears(1).toDate()).toBe('2023-02-28');

      const dateYear = ChronosDate.create('2024-01-01');
      expect(dateYear.subMonths(13).toDate()).toBe('2022-12-01');
    });
  });
  describe('Format Methods', () => {
    let date: ChronosDate;

    beforeEach(() => {
      date = ChronosDate.create('2024-02-04T12:00:00.000Z');
    });

    it('should format date in BR format', () => {
      expect(date.formatBR()).toBe('04/02/2024');
      expect(date.formatBR(true)).toBe('04/02/2024 12:00');
    });

    it('should format date in US format', () => {
      expect(date.formatUS()).toBe('02/04/2024');
      expect(date.formatUS(true)).toBe('02/04/2024 12:00');
    });

    it('should format for database', () => {
      expect(date.toDate()).toBe('2024-02-04');
      expect(date.toDateTime()).toBe('2024-02-04 12:00:00');
      expect(date.toDatabase()).toBe('2024-02-04T12:00:00.000Z');
    });
  });

  describe('State Check Methods', () => {
    it('should check if date is today', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');
      expect(date.isToday()).toBe(true);
      expect(date.addDays(1).isToday()).toBe(false);
    });

    it('should check if date is in the future', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');
      expect(date.addDays(1).isFuture()).toBe(true);
      expect(date.subDays(1).isFuture()).toBe(false);
    });

    it('should check if date is in the past', () => {
      const date = ChronosDate.create('2024-02-04T12:00:00.000Z');
      expect(date.subDays(1).isPast()).toBe(true);
      expect(date.addDays(1).isPast()).toBe(false);
    });

    // Coverage for line 135 - date comparisons
    it('should handle date comparisons with different times', () => {
      const date = ChronosDate.create('2024-02-04T23:59:59.999Z');
      expect(date.isToday()).toBe(true);

      const dateStart = ChronosDate.create('2024-02-04T00:00:00.000Z');
      expect(dateStart.isToday()).toBe(true);
    });
  });

  describe('Boundary Methods', () => {
    let date: ChronosDate;

    beforeEach(() => {
      date = ChronosDate.create('2024-02-04T12:00:00.000Z');
    });

    it('should set to start of day', () => {
      const result = date.startOfDay().toDateTime();
      expect(result).toBe('2024-02-04 00:00:00');
    });

    it('should set to end of day', () => {
      const result = date.endOfDay().toDateTime();
      expect(result).toBe('2024-02-04 23:59:59');
    });

    it('should set to start of month', () => {
      const result = date.startOfMonth().toDate();
      expect(result).toBe('2024-02-01');
    });

    it('should set to end of month', () => {
      const result = date.endOfMonth().toDate();
      expect(result).toBe('2024-02-29');
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap years', () => {
      const date = ChronosDate.create('2024-02-29T12:00:00.000Z');
      expect(date.addYears(1).toDate()).toBe('2025-02-28');
    });

    it('should handle month overflow', () => {
      const date = ChronosDate.create('2024-01-31T12:00:00.000Z');
      expect(date.addMonths(1).toDate()).toBe('2024-02-29');
    });

    it('should handle invalid dates', () => {
      expect(() => {
        ChronosDate.create('invalid-date');
      }).toThrow();
    });
  });
});
