# api

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

# api endpoints

# Authentication

POST /auth/signup → register new user
POST /auth/login → login user, return JWT/session
POST /auth/logout → logout
GET /auth/me → get logged-in user profile

# Monitors

POST /monitors → create a new monitor (URL, method, interval, region, etc.)
GET /monitors → list all monitors for the logged-in user
GET /monitors/:id → get details of a specific monitor
PUT /monitors/:id → update monitor settings (URL, interval, alert rules)
DELETE /monitors/:id → delete monitor

# Check Results

GET /monitors/:id/checks → list recent checks (uptime history)
