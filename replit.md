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
- `server/storage.ts` - Storage interface with DatabaseStorage implementation (includes getFrequentFoods)
- `server/routes.ts` - REST API routes prefixed with `/api`
- `client/src/pages/home.tsx` - Main app UI (single page) with date navigation
- `client/src/components/ui/progress.tsx` - Extended with `indicatorClassName` prop
- `client/src/components/BarcodeScanner.tsx` - Barcode scanning component
- `client/src/components/MealScanner.tsx` - AI meal photo analysis component
- `client/src/components/FoodSearch.tsx` - Autocomplete food search with database + recent/frequent history
- `client/src/components/OnboardingDialog.tsx` - 2-step settings/onboarding: profile + weight goals (step 1) + avatar picker (step 2); 36 DiceBear options
- `client/src/data/foodDatabase.ts` - 200+ food items with serving sizes, units, macros

## API Endpoints
- `GET /api/profile` - Get or create default user profile
- `PATCH /api/profile/:id` - Update profile fields (debounced from frontend)
- `GET /api/food-entries/:profileId/:date` - Get food entries for a date
- `POST /api/food-entries` - Add a food entry
- `DELETE /api/food-entries/:id` - Remove a food entry
- `GET /api/food-entries/:profileId/frequent` - Get aggregated frequent/recent foods for autocomplete
- `POST /api/analyze-meal` - AI vision analysis of meal photo (base64 image → food items with calories)

## Design System
- Fonts: Poppins (display/headings) + Inter (body)
- Palette: primary green `#4CAF50`, secondary orange `#FF9800`, accent blue `#03A9F4`, background `bg-green-50/40`
- Layout: 2-column top row [Daily Targets (col-7) | Macros (col-5)], full-width Recipes below; navbar has Settings gear icon + weight progress bar
- All cards: white background, colored `h-2` top bar (green/orange/blue)

## Features
- **Weight Goal Tracker**: Set starting/current/target weights + timeframe in Settings dialog; auto-calculates daily caloric target; progress shown in navbar
- **Daily Calorie Tracking**: Searchable food database (200+ items) with autocomplete, serving sizes, and calorie auto-fill; manual entry fallback for unlisted foods
- **Barcode Scanner**: Camera-based barcode scanning using `html5-qrcode`, product lookup via Open Food Facts API (free, no key), optional logging to diary
- **AI Meal Scanner**: Take a photo of a meal, GPT-4o vision analyzes food items with calories/macros, log individually or all at once (uses Replit AI Integrations / OpenAI)
- **Recipe Recommendations**: Procedurally generated per-category recipes with ingredients, steps, nutrition info
- **Recipe Generator**: User inputs ingredients, generates custom recipe matched to calorie target
- **Macro Tracking**: Pie chart breakdown of protein/carbs/fat
- **Date Navigation**: Week-view calendar strip to view/log food entries for past days
- **Recent/Frequent Foods**: Search prioritizes previously logged items; shows recent foods on focus
- **Onboarding/Settings**: 2-step dialog (profile/weight goals + avatar) shown on first use; accessible later via Settings gear icon in navbar to edit name, avatar, and weight goals

## Database Tables
- `user_profiles`: id, name, avatar_seed, starting_weight, current_weight, target_weight, timeframe, maintenance_calories
- `food_entries`: id, profile_id, name, calories, protein, carbs, fat, date
