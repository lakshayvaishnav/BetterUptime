

# BetterUptime — Frontend Dashboard

A sleek, Vercel-inspired dark uptime monitoring dashboard that connects to your existing BetterUptime API.

## Design System
- **Dark theme by default** — deep blacks (#000, #0a0a0a), subtle gray borders, white text
- **Vercel-inspired**: minimal, sharp typography (Inter/Geist), monochrome with subtle blue accents
- **Clean spacing**, no visual clutter

## Pages & Features

### 1. Landing Page (SaaS Marketing)
- Hero section with bold headline, subtext, and CTA buttons (Get Started / Login)
- Feature highlights (uptime monitoring, multi-region checks, response time tracking)
- Pricing or "How it works" section
- Minimalist footer

### 2. Authentication
- **Login page** — email + password form, link to sign up
- **Sign up page** — name, email, password form, link to login
- JWT token stored in localStorage, sent as Bearer header
- Auth context for protected routes

### 3. Dashboard (Protected)
- **Overview cards**: total monitors, monitors up/down, average response time
- **Monitor list**: table/cards showing each monitor's URL, current status (Up/Down badge), last checked time
- Add new monitor (URL input + button)
- Delete individual monitors

### 4. Monitor Detail Page
- **Status timeline**: line/area chart showing uptime over time
- **Response time chart**: line chart of response times (ms) over time
- **Region breakdown**: compare USA vs India check results side-by-side
- **Latest result**: highlighted card with most recent check
- Delete monitor button
- Cleanup old results action

### 5. API Integration
- Configurable API base URL (defaults to localhost:3000)
- API client service with auth token handling
- React Query for data fetching, caching, and refetching
- Proper error handling and loading states

### 6. Layout & Navigation
- Top navbar with logo, nav links, and user menu (profile/logout)
- Responsive design for mobile
- Protected route wrapper redirecting to login if unauthenticated

