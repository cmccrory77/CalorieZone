# Caloriq - Weight Management App

## Overview
A web-based weight management app inspired by MyFitnessPal and Noom. Helps users reach their target weight through personalized caloric planning, recipe recommendations, and daily calorie/macro tracking.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + Recharts
- **Backend**: Express.js with REST API
- **Database**: PostgreSQL via Drizzle ORM
- **State Management**: TanStack React Query for server state, local React state for UI

## Key Files
- `shared/schema.ts` - Drizzle schema: `userProfiles`, `foodEntries` tables
- `server/db.ts` - Database connection (pg Pool + Drizzle)
- `server/storage.ts` - Storage interface with DatabaseStorage implementation
- `server/routes.ts` - REST API routes prefixed with `/api`
- `client/src/pages/home.tsx` - Main app UI (single page)
- `client/src/components/ui/progress.tsx` - Extended with `indicatorClassName` prop

## API Endpoints
- `GET /api/profile` - Get or create default user profile
- `PATCH /api/profile/:id` - Update profile fields (debounced from frontend)
- `GET /api/food-entries/:profileId/:date` - Get food entries for a date
- `POST /api/food-entries` - Add a food entry
- `DELETE /api/food-entries/:id` - Remove a food entry

## Design System
- Fonts: Poppins (display/headings) + Inter (body)
- Palette: primary green `#4CAF50`, secondary orange `#FF9800`, accent blue `#03A9F4`, background `bg-green-50/40`
- Layout: 3-column top row [Weight Goal | Daily Targets | Macros], full-width Recipes below
- All cards: white background, colored `h-2` top bar (green/orange/blue)

## Database Tables
- `user_profiles`: id, starting_weight, current_weight, target_weight, timeframe, maintenance_calories
- `food_entries`: id, profile_id, name, calories, protein, carbs, fat, date
