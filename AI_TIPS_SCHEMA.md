# AI Tips Feature - GraphQL Schema Documentation

## Overview

The AI Tips feature integrates with the backend's Gemini AI tips generation system. The schema was discovered via GraphQL introspection on May 2024.

## GraphQL Operations

### Mutation: Generate Tips

```graphql
mutation createGeminiTip(createTipDto: GeminiTipDto!): Boolean!
```

**Input Type: GeminiTipDto**

```graphql
{
  dogId: ID!
  language: Language!
}
```

**Supported Languages:**

- ENGLISH (default)
- Other languages defined in backend Language enum

**Returns:** `Boolean!` - indicates whether tip generation was successfully started

### Query: Fetch Tips

```graphql
query findTipsByDogId(findByDogIdDto: FindByDogIdDto!): [TipModel!]!
```

**Input Type: FindByDogIdDto**

```graphql
{
  dogId: ID!
}
```

**Return Type: TipModel**

```graphql
{
  _id: ID!
  content: String!
  createdAt: DateTime!
  isRead: Boolean!
  language: String!
  source: String!
  updatedAt: DateTime!
}
```

## Implementation

### API Routes

**POST /api/tips/generate**

- Generates AI tips for a specific dog
- Requires authentication (JWT token in cookies)
- Accepts: `{ dogId: string, language?: string }`
- Calls `createGeminiTip` mutation

**GET /api/tips/[dogId]**

- Fetches all tips for a specific dog
- Requires authentication (JWT token in cookies)
- Calls `findTipsByDogId` query
- Returns array of TipModel objects

### Testing Page

Location: `/test-tips`

Features:

- Dog selection dropdown (fetches user's dogs)
- Generate button triggers tip creation
- 5-second countdown timer after generation
- Automatic fetch after countdown
- Displays tips with content, source, language, and timestamps
- Shows read/unread status

## Usage Example

```typescript
// Generate tips
const response = await fetch("/api/tips/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dogId: "123", language: "ENGLISH" }),
});

// Fetch tips
const tips = await fetch(`/api/tips/${dogId}`);
const data = await tips.json();
```

## Schema Discovery

The schema was discovered using GraphQL introspection query against the backend endpoint. This allows the frontend to stay synchronized with backend schema changes.

To re-run introspection if schema changes:

```javascript
// Use GraphQL introspection query
const introspectionQuery = `{ __schema { ... } }`;
```
