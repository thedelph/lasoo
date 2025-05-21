# Subscription Management System

This module handles all subscription-related functionality for the Lasoo admin backend.

## Component Structure

```
subscriptions/
├── SubscriptionManagement.tsx  # Main container component
├── SubscriptionList.tsx        # List and filter subscriptions
├── NewSubscriptionModal.tsx    # Modal for creating subscriptions
├── SubscriptionService.ts      # Data fetching and manipulation
├── types.ts                    # Shared type definitions
└── utils.ts                    # Utility functions
```

## Key Features

- View all active and expired subscriptions
- Filter subscriptions by status and search text
- Create new subscriptions
- Extend existing subscriptions by 30 days
- Cancel subscriptions

## Dual Subscription System

The system handles subscriptions from two data sources:

1. **Users Table** - Basic subscription data stored directly in the users table
   - Represented with synthetic IDs (`user-123`)
   - Fields: `subscription_start_date`, `subscription_end_date`, `subscription_status`

2. **Subscriptions Table** - Detailed subscription records with plan information
   - Represented with real UUIDs
   - Foreign key relationship to users and subscription plans

The `SubscriptionService` handles both types seamlessly, deduplicating entries and providing a unified interface.

## Common Operations

### Extending a Subscription

```typescript
// This works for both subscription types
await SubscriptionService.extendSubscription(subscriptionId);
```

### Creating a New Subscription

```typescript
await SubscriptionService.createSubscription({
  userId: selectedTradesperson.value,
  planId: selectedPlan,
});
```

### Canceling a Subscription

```typescript
await SubscriptionService.cancelSubscription(subscriptionId);
```

## Error Handling

All service methods return an object with an `error` property that will be `null` on success or contain an error message on failure:

```typescript
const { error } = await SubscriptionService.extendSubscription(id);
if (error) {
  // Handle error
} else {
  // Success
}
```

## Type Safety

Use the provided interfaces from `types.ts` to ensure type safety throughout the application:

- `Subscription`
- `TradespersonOption`
- `SubscriptionPlan`
