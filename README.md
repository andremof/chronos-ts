# chronos-ts 📅

Powerful and lightweight TypeScript library for date manipulation inspired by date-fns and Carbon. Handles date operations with timezone awareness and edge cases handling.

[![npm version](https://img.shields.io/npm/v/chronos-ts.svg)](https://www.npmjs.com/package/chronos-ts)
[![npm downloads](https://img.shields.io/npm/dm/chronos-ts.svg)](https://www.npmjs.com/package/chronos-ts)
[![TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- 💪 Powerful chainable API
- 📦 Zero dependencies
- 🎯 Full TypeScript support
- 🌍 Regional formatting (BR, US)
- 🔄 Fluent interface
- 💾 Database-ready formats
- 🕒 Timezone aware
- 📅 Proper handling of leap years and month overflows
- ⚡ Lightweight & Fast

## Installation 🚀

```bash
npm install chronos-ts
# or
yarn add chronos-ts
# or
pnpm add chronos-ts
```

## Quick Start 🎯

```typescript
import { ChronosDate } from 'chronos-ts';

// Create a date
const date = ChronosDate.now();

// Add time
date.addDays(5)
    .addHours(2)
    .addMinutes(30);

// Format
console.log(date.formatBR());     // 09/02/2024
console.log(date.formatUS(true)); // 02/09/2024 14:30

// Database ready
console.log(date.toDatabase()); // 2024-02-09T14:30:00.000Z
```

## API Reference 📖

### Creating Dates

```typescript
// Current date
const now = ChronosDate.now();

// From string/date/timestamp
const date = ChronosDate.create('2024-02-04');
const date2 = ChronosDate.create(new Date());
```

### Time Units

All methods support these time units:
- years
- months
- weeks
- days
- hours
- minutes
- seconds

### Adding Time

```typescript
date.addYears(1);     // Add 1 year
date.addMonths(2);    // Add 2 months
date.addWeeks(1);     // Add 1 week
date.addDays(5);      // Add 5 days
date.addHours(2);     // Add 2 hours
date.addMinutes(30);  // Add 30 minutes
date.addSeconds(15);  // Add 15 seconds

// Generic add method
date.add(2, 'days');  // Add 2 days
```

### Subtracting Time

```typescript
date.subYears(1);     // Subtract 1 year
date.subMonths(2);    // Subtract 2 months
date.subWeeks(1);     // Subtract 1 week
date.subDays(5);      // Subtract 5 days
date.subHours(2);     // Subtract 2 hours
date.subMinutes(30);  // Subtract 30 minutes
date.subSeconds(15);  // Subtract 15 seconds
```

### Formatting

```typescript
// Brazilian format
date.formatBR();     // 04/02/2024
date.formatBR(true); // 04/02/2024 12:30

// US format
date.formatUS();     // 02/04/2024
date.formatUS(true); // 02/04/2024 12:30

// Database formats
date.toDatabase();   // 2024-02-04T12:30:00.000Z (ISO)
date.toDate();       // 2024-02-04
date.toDateTime();   // 2024-02-04 12:30:00
```

### Date Information

```typescript
date.isFuture();  // Check if date is in the future
date.isPast();    // Check if date is in the past
date.isToday();   // Check if date is today
```

### Day Boundaries

```typescript
date.startOfDay();   // Set to 00:00:00
date.endOfDay();     // Set to 23:59:59
date.startOfMonth(); // Set to first day of month
date.endOfMonth();   // Set to last day of month
```

## Examples with ORMs 🗄️

### Knex.js

```typescript
await knex('users').insert({
  created_at: ChronosDate.now().toDatabase(),
  expires_at: ChronosDate.now().addDays(30).toDatabase()
});

// Query today's records
await knex('records')
  .whereBetween('created_at', [
    ChronosDate.now().startOfDay().toDatabase(),
    ChronosDate.now().endOfDay().toDatabase()
  ]);
```

### Prisma

```typescript
await prisma.user.create({
  data: {
    createdAt: new Date(ChronosDate.now().toDatabase()),
    expiresAt: new Date(ChronosDate.now().addMonths(1).toDatabase())
  }
});
```

### TypeORM

```typescript
await userRepository.save({
  createdAt: new Date(ChronosDate.now().toDatabase()),
  updatedAt: new Date(ChronosDate.now().toDatabase())
});
```

## Edge Cases Handling 🛡️

The library properly handles:
- Leap years
- Month length variations
- Timezone conversions
- Date overflow/underflow
- Invalid dates

```typescript
// Leap year handling
const date = ChronosDate.create('2024-02-29');
date.addYears(1).toDate(); // '2025-02-28'

// Month overflow
const date2 = ChronosDate.create('2024-01-31');
date2.addMonths(1).toDate(); // '2024-02-29'
```

## Contributing 🤝

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support ❤️

Give a ⭐️ if this project helped you!