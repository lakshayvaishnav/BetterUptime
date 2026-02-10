# Backend Optimization & Features TODO

This document outlines the tasks for optimizing the backend and implementing multi-region monitoring.

## Optimization Opportunities

### 1. Database Performance (`packages/db`)

- [ ] **Add Indexes**: The `CheckResult` table will grow massive effectively.
  - [ ] Add a composite index on `[monitorId, checkedAt]` for fast retrieval of history per monitor.
  - [ ] Add an index on `checkedAt` for data retention policies (e.g., deleting old logs).
- [ ] **Connection Pooling**: Ensure `PrismaClient` is instantiated as a singleton (already looks correct, but verify connection limits in production).

### 2. Producer Scalability (`apps/producer`)

- [ ] **Cursor-based Pagination**: Currently, `producerOnce` fetches _all_ monitors into memory:
  ```typescript
  const websiteUrl = await prismaclient.monitor.findMany(...)
  ```
  **Optimization**: Use `take` and `cursor` (or `skip`/`take`) to fetch in batches to avoid OOM (Out of Memory) errors as the user base grows.
- [ ] **Deduplication**: Ensure we don't push the same check job twice if the previous one hasn't been processed (optional, but good for safety).

### 3. Worker Throughput (`apps/worker`)

- [ ] **Parallel Processing**: The current `workerLoop` processes messages sequentially within a batch:
  ```typescript
  for (const stream of streams) {
    for (const message of stream.messages) {
      await checkUptime(url); // Blocks!
    }
  }
  ```
  **Optimization**: Use `Promise.all` with a concurrency limit (e.g., using `p-limit` or a simple counter) to perform HTTP checks in parallel.
- [ ] **Keep-Alive Connections**: Ensure existing HTTP agents are reused for `fetch` to avoid TLS handshake overhead for every check.

### 4. Redis Efficiency (`packages/redis-stream`)

- [ ] **Fix Bulk Acknowledgement**: The `XBulkAck` function currently iterates and awaits:
  ```typescript
  eventIds.map(async (eventid) => { await XAck(...) })
  ```
  **Optimization**: Redis `XACK` supports multiple IDs at once. Change to:
  ```typescript
  await client.xAck(streamKey, groupId, eventIds);
  ```
  This reduces round-trips from N to 1.
- [ ] **Pipelining**: Ensure `XAdd` bulk operations are using pipelining (already present in `XBulkAdd`—good job!).

---

## 🌍 Implement Multi-Region Monitoring

To monitor uptime from different regions (e.g., USA, India, Europe), follow this architecture:

### 1. Redis Consumer Groups

Redis Streams allows multiple "Consumer Groups" to read the _same_ messages independently.

- **Concept**: Create one consumer group per region.
  - Group `monitor-runners-india`
  - Group `monitor-runners-usa`
  - Group `monitor-runners-eu`

### 2. Deployment Strategy

- Monitor your `apps/worker` Docker image.
- Deploy the worker service to **multiple regions** (e.g., AWS us-east-1, ap-south-1, eu-central-1).
- **Environment Variables**: passing the region and group name as env vars.
  - **India Instance**: `REGION=INDIA`, `REDIS_GROUP=monitor-runners-india`
  - **USA Instance**: `REGION=USA`, `REDIS_GROUP=monitor-runners-usa`

### 3. Code Changes

**`apps/worker/index.ts`**:

1.  Read `GROUP` and `Location` from environment variables.
2.  Ensure `createConsumerGroup` is called for the specific region's group name on startup.
3.  When writing to the DB, use the region from the env var.

**Example `apps/worker` flow**:

```typescript
const GROUP = process.env.REDIS_GROUP || "default-group";
const LOCATION = process.env.REGION || "UNKNOWN";

// ... inside workerLoop
const results = await client.xReadGroup(GROUP, consumerName, ...)
// ... processing
results.push({
    // ...
    Location: LOCATION, // Storing "USA", "INDIA", etc.
});
```

### 4. Database

- You already have `enum Location`. Ensure it has all the regions you plan to support.
- When querying, you can now aggregate uptime by region or show specific region failures.
