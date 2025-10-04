# Better Uptime Monitor

A high-performance, scalable uptime monitoring system built with TypeScript, featuring a microservices architecture powered by Redis Streams and PostgreSQL.

## 🚀 Features

### Core Monitoring
- **Real-time Uptime Monitoring**: Continuous website availability checks
- **Multi-region Support**: Monitor from USA and India regions
- **Response Time Tracking**: Detailed performance metrics
- **Historical Data**: Store and analyze uptime history
- **Bulk Operations**: Efficient processing of multiple monitors

### Authentication & Security
- **JWT-based Authentication**: Secure user sessions
- **User Registration & Login**: Complete auth flow
- **Protected Routes**: Middleware-based authorization
- **Password Hashing**: Secure credential storage

### API Features
- **RESTful API**: Clean, well-structured endpoints
- **CRUD Operations**: Full monitor lifecycle management
- **Result Queries**: Fetch uptime data with filtering
- **Data Cleanup**: Automatic old data removal
- **Error Handling**: Comprehensive error management

### Architecture & Scalability
- **Microservices Design**: Separated concerns for better maintainability
- **Redis Streams**: Reliable message queuing and processing
- **Producer-Worker Pattern**: Scalable distributed processing
- **Auto-recovery**: PEL (Pending Entry List) message reclaiming
- **Docker Ready**: Containerized deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Service   │    │ Producer Service│    │ Worker Service  │
│                 │    │                 │    │                 │
│ • Express.js    │    │ • Batch URLs    │    │ • Process Checks│
│ • JWT Auth      │    │ • Redis Streams │    │ • Bulk Upload   │
│ • REST Endpoints│    │ • 3min Intervals│    │ • Auto-reclaim  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Data Layer    │
                    │                 │
                    │ • PostgreSQL    │
                    │ • Redis Streams │
                    │ • Prisma ORM    │
                    └─────────────────┘
```

## 📁 Project Structure

```
better-uptime/
├── apps/
│   ├── api/                    # REST API service
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── middleware/     # Auth middleware
│   │   │   ├── models/         # Data models
│   │   │   ├── routes/         # API routes
│   │   │   ├── types/          # TypeScript types
│   │   │   └── utils/          # JWT utilities
│   │   └── package.json
│   ├── producer/               # URL batch producer
│   │   └── index.ts
│   └── worker/                 # Uptime check worker
│       └── index.ts
├── packages/
│   ├── db/                     # Database package
│   │   ├── prisma/             # Database schema
│   │   └── generated/          # Prisma client
│   ├── redis-stream/           # Redis Stream utilities
│   └── utils/                  # Shared utilities
├── docker/                     # Docker configuration
│   ├── docker-compose.yml
│   ├── postgres_data/          # PostgreSQL data
│   └── redis_data/             # Redis data
└── README.md
```

## 🛠️ Tech Stack

- **Runtime**: Bun (TypeScript runtime)
- **API Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: Redis Streams
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- [Docker](https://docker.com) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd better-uptime
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the infrastructure**
   ```bash
   cd docker
   docker-compose up -d
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   bun run prisma migrate dev
   bun run prisma generate
   ```

5. **Start the services**
   ```bash
   # Terminal 1 - API Service
   bun run api

   # Terminal 2 - Producer Service
   bun run producer

   # Terminal 3 - Worker Service
   bun run worker
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get user profile

### Monitors
- `POST /api/monitor` - Create new monitor
- `GET /api/monitor` - List user monitors
- `GET /api/monitor/:id` - Get monitor details
- `PUT /api/monitor/:id` - Update monitor
- `DELETE /api/monitor/:id` - Delete monitor

### Results
- `GET /api/results/:monitorId/checks` - Get monitor results
- `GET /api/results/:monitorId/latest` - Get latest result
- `DELETE /api/results/:monitorId/cleanup?days=90` - Clean old results

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uptime"

# Redis
REDIS_URL="redis://localhost:6379"
STREAM_KEY="BetterUptime:Websites"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# API
PORT=3000
NODE_ENV="development"
```

## 🏃‍♂️ Running Services

### Development Mode

```bash
# API Service (Port 3000)
bun run api

# Producer Service (Runs every 3 minutes)
bun run producer

# Worker Service (Continuous processing)
bun run worker
```

### Production Mode

```bash
# Build and run with PM2 or similar process manager
bun run build
pm2 start ecosystem.config.js
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `hashedPassword` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Monitors Table
- `id` (UUID, Primary Key)
- `url` (String)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### CheckResults Table
- `id` (UUID, Primary Key)
- `monitorId` (UUID, Foreign Key)
- `status` (Enum: Up/Down)
- `Location` (Enum: USA/India)
- `responseTimeMs` (Integer)
- `checkedAt` (DateTime)

## 🔄 How It Works

1. **Producer Service** fetches all active monitors from the database every 3 minutes
2. **URLs are batched** and pushed to Redis Streams for processing
3. **Worker Service** consumes messages from the stream and performs HTTP checks
4. **Results are bulk-uploaded** to PostgreSQL for storage
5. **API Service** provides REST endpoints for frontend consumption
6. **Auto-recovery** handles failed messages through PEL reclaiming

## 🚧 Frontend Status

**⚠️ Frontend is currently in progress and not yet implemented.**

The backend API is fully functional and ready for frontend integration. The planned frontend will include:

- Dashboard with monitor overview
- Real-time uptime status
- Historical charts and analytics
- Monitor configuration interface
- Alert management system
- User authentication UI

