# BetterUptime API & Database Documentation

## 🗄️ Database Schema (Prisma)

### Tables (Models)

#### `User`

- `id` (String, UUID): Primary Key
- `email` (String): Unique, user's email
- `name` (String): User's full name
- `hashedPassword` (String): Bcrypt hashed password
- `monitors` (Monitor[]): Relation to monitors
- `createdAt` (DateTime): Default now
- `updatedAt` (DateTime): Default now

#### `Monitor`

- `id` (String, UUID): Primary Key
- `url` (String): Website URL to monitor
- `user` (User?): Relation to the owner
- `userId` (String?): Foreign Key to `User`
- `results` (CheckResult[]): Relation to check results
- `createdAt` (DateTime): Default now
- `updatedAt` (DateTime): Default now

#### `CheckResult`

- `id` (String, UUID): Primary Key
- `monitor` (Monitor): Relation to the monitor
- `monitorId` (String): Foreign Key to `Monitor`
- `status` (Enum: `Up`, `Down`)
- `Location` (Enum: `USA`, `INDIA`)
- `responseTimeMs` (Int?): Latency in milliseconds
- `checkedAt` (DateTime): Default now

---

## 🚀 API Endpoints

**Base URL:** `http://localhost:3000`

### 🔒 Authentication (`/api/auth`)

#### `POST /api/auth/signup`

Creates a new user account.

- **Body:**
  - `email` (string, required)
  - `name` (string, required)
  - `password` (string, required)
- **Response (201):** `{ success: true, message: "...", data: { user: { id, email, name }, token } }`

#### `POST /api/auth/login`

Authenticates a user and returns a JWT.

- **Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Response (200):** `{ success: true, message: "...", data: { user: { id, email, name }, token } }`

#### `GET /api/auth/logout`

Clears the authentication cookie.

- **Response (200):** `{ success: true, message: "Logout successful" }`

#### `GET /api/auth/profile`

Returns current user's profile.

- **Headers:** `Cookie: token=<jwt>` or `Authorization: Bearer <jwt>`
- **Response (200):** `{ success: true, data: { user: { id, name, email, createdAt } } }`

---

### 🖥️ Monitors (`/api/monitor`)

#### `POST /api/monitor/createmonitor`

Adds a new website to monitor.

- **Headers:** Auth required
- **Body:**
  - `url` (string, required)
- **Response (200):** `{ success: true, data: { monitor: { ... } } }`

#### `GET /api/monitor/monitors`

Lists all monitors for the authenticated user.

- **Headers:** Auth required
- **Response (200):** `{ success: true, message: "Fetched all monitors", data: { result: [...] } }`

#### `GET /api/monitor/monitors/:monitorId`

Gets details of a specific monitor.

- **Headers:** Auth required
- **Response (200):** `{ success: true, data: { result: { ... } } }`

#### `DELETE /api/monitor/monitors/:monitorId`

Deletes a specific monitor.

- **Headers:** Auth required
- **Response (200):** `{ success: true, message: "monitor deleted successfully" }`

#### `DELETE /api/monitor/monitors`

Deletes ALL monitors for the user.

- **Headers:** Auth required
- **Response (200):** `{ success: true, message: "all monitors deleted successfully" }`

---

### 📊 Results (`/api/results`)

#### `GET /api/results/:monitorId/results`

Fetches check results for a specific monitor.

- **Headers:** Auth required
- **Response (200):** `{ success: true, data: { results: [...], count } }`

#### `GET /api/results/:monitorId/results/latest`

Gets the most recent check result.

- **Headers:** Auth required
- **Response (200):** `{ success: true, data: { result: { ... } } }`

#### `DELETE /api/results/:monitorId/results/cleanup`

Cleans up old check results.

- **Headers:** Auth required
- **Query Params:** `days` (number, default 90)
- **Response (200):** `{ success: true, message: "Deleted X old results" }`

---

### 👤 User Extras (`/api/user`)

#### `GET /api/user/monitors`

Another way to fetch user monitors (Legacy/Redundant).

- **Headers:** Auth required
- **Response (200):** `{ success: true, data: { monitor: [...] } }`
