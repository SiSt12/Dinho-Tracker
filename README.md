# 🟠 Dinho Tracker

A modern, cross-platform habit tracking app built with React Native and Expo. Track daily habits, visualize progress with GitHub-style heatmaps, analyze streaks and completion rates, and stay organized with custom categories — all in a retro-inspired design.

Available on **iOS**, **Android**, and **Web** from a single codebase.

---

## ✨ Features

### Habit Management
- **Create habits** with custom icons (45+), colors (20 palettes), descriptions, and frequency settings
- **Flexible frequency**: daily, weekly, or custom target days
- **Categories**: organize habits into groups (Fitness, Health, Learning, Productivity, Mindfulness) or create your own
- **Quick toggle**: mark habits as complete with a single tap
- **Multiple views**: switch between Grid, List, and Weekly layouts

### Analytics & Statistics
- **Year Heatmap**: GitHub-style contribution grid showing your entire year at a glance
- **Streak Tracking**: current streak and best streak calculations
- **Completion Rate**: weekly rate with per-day breakdown
- **Monthly Chart**: line chart showing completions per month across the year
- **Per-habit stats**: dedicated detail screen with full analytics for each habit

### User Experience
- **Dark / Light / System themes**: persistent preference with retro orange-cream aesthetic
- **Bilingual**: English and Portuguese (BR) with automatic device language detection
- **Animated interactions**: spring animations on day toggles and smooth transitions
- **Responsive layout**: adapts to phones, tablets, and desktop browsers (max 600px centered)
- **Platform-aware**: native alerts on mobile, web-compatible dialogs on browser

### Authentication & Security
- **Email/password auth** powered by Supabase
- **Email confirmation** required before first login
- **Row-Level Security (RLS)**: all data isolated per user at the database level
- **Secure token storage**: `expo-secure-store` on mobile, `localStorage` on web
- **Auto session refresh**: seamless token renewal

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.81 + Expo 54 |
| **Routing** | Expo Router (file-based) |
| **Language** | TypeScript (strict mode) |
| **State Management** | Zustand |
| **Backend / DB** | Supabase (PostgreSQL + Auth) |
| **Charts** | react-native-chart-kit |
| **Dates** | date-fns |
| **i18n** | i18next + react-i18next + expo-localization |
| **Icons** | @expo/vector-icons (MaterialCommunityIcons) |
| **Secure Storage** | expo-secure-store |

---

## 📁 Project Structure

```
app/                        # File-based routes (Expo Router)
├── _layout.tsx             # Root layout — ThemeProvider, auth init
├── index.tsx               # Entry redirect
├── (auth)/                 # Authentication flow
│   ├── login.tsx           # Email/password sign in
│   └── register.tsx        # Account registration
├── (tabs)/                 # Main tab navigation (requires auth)
│   ├── index.tsx           # Habits dashboard
│   ├── stats.tsx           # Analytics screen
│   └── settings.tsx        # Theme, language, account
└── habit/
    ├── new.tsx             # Create new habit (modal)
    └── [id].tsx            # Habit detail & analytics

src/
├── components/
│   ├── habits/             # HabitGridCard, HabitListCard, HabitWeeklyRow,
│   │                       # HeatmapGrid, CategoryFilter, ViewModeSelector
│   ├── stats/              # YearHeatmap, StatCard, WeeklyRateCard, CompletionsChart
│   └── ui/                 # ColorPicker, IconPicker
├── constants/
│   ├── habits.ts           # Colors, icons, default categories
│   └── theme.ts            # Light/dark theme palettes
├── contexts/
│   └── ThemeContext.tsx     # Theme provider & useTheme hook
├── i18n/                   # en.json, pt-BR.json, setup
├── services/
│   ├── api.ts              # Supabase CRUD operations
│   └── supabase.ts         # Client configuration
├── stores/
│   ├── authStore.ts        # Authentication state (Zustand)
│   └── habitStore.ts       # Habits, completions, categories (Zustand)
├── types/
│   └── index.ts            # TypeScript interfaces
└── utils/
    ├── dates.ts            # Date formatting, stats calculation
    └── alert.ts            # Platform-aware alerts

supabase/
└── schema.sql              # Database tables, indexes, RLS policies
```

---

## 🗄️ Database Schema

Three tables with Row-Level Security enabled:

### `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner (FK → auth.users) |
| name | TEXT | Category name |
| icon | TEXT | Icon identifier |
| sort_order | INTEGER | Display order |

### `habits`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner (FK → auth.users) |
| name | TEXT | Habit name |
| description | TEXT | Optional description |
| icon | TEXT | Icon identifier |
| color | TEXT | Color palette key (20 options) |
| category_id | UUID? | Optional category (FK → categories) |
| frequency | TEXT | `daily` / `weekly` / `custom` |
| target_days | INTEGER[] | Days of week (0=Sun … 6=Sat) |
| archived | BOOLEAN | Soft delete flag |
| sort_order | INTEGER | Display order |

### `habit_completions`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| habit_id | UUID | FK → habits (cascade delete) |
| user_id | UUID | Owner (FK → auth.users) |
| date | DATE | Completion date |
| completed | BOOLEAN | Completion status |

Unique constraint on `(habit_id, user_id, date)` — one entry per habit per day.

Optimized indexes on user, category, habit, date, and composite lookups.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/dinho-tracker.git
cd dinho-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase/schema.sql` in the Supabase SQL Editor to create the tables, indexes, and RLS policies
3. Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the app

```bash
# Development server (select platform interactively)
npm start

# Platform-specific
npm run android
npm run ios
npm run web
```

---

## 📱 Screens

### Authentication
- **Login** — email/password with email verification enforcement
- **Register** — account creation with password confirmation (6+ characters)

### Habits (Main Tab)
- Category filter bar (horizontal scroll)
- View mode toggle: **Grid** (2-column cards with mini heatmap), **List** (expanded cards), **Weekly** (compact rows with last 5 days)
- Tap a habit to view detailed stats, tap the checkbox to toggle today's completion

### Stats
- Habit selector carousel
- Year navigation with full-year heatmap
- Stat cards: total completions, weekly rate, current streak, best streak
- Monthly completions chart (Bezier line)

### Settings
- Account info with logout
- Theme selector (Light / Dark / System)
- Language selector (English / Português BR)
- App version

### Habit Detail
- Full year heatmap with year navigation
- All statistics cards
- Monthly completions chart
- Description display
- Delete with confirmation

---

## 🎨 Theming

Two handcrafted theme palettes with a retro orange-cream aesthetic:

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#FF6B2B` | `#FF8C42` |
| Background | `#FFFBF5` | `#10100E` |
| Surface | `#FFF7ED` | `#1A1A2E` |
| Text | `#1A1A2E` | `#FFF8F0` |
| Success | `#2DC653` | `#2DC653` |

Theme preference persists across sessions using secure storage.

---

## 🌍 Internationalization

| Language | Code | Detection |
|----------|------|-----------|
| English | `en` | Default fallback |
| Português (BR) | `pt-BR` | Auto-detected if device locale starts with `pt` |

All UI strings — labels, buttons, messages, day/month names — are translated. Language can also be switched manually in Settings.

---

## 📦 Dependencies

### Core
- `react` / `react-native` — UI framework
- `expo` — Managed platform & tooling
- `expo-router` — File-based navigation
- `typescript` — Type safety

### State & Data
- `zustand` — Lightweight state management
- `@supabase/supabase-js` — Backend client
- `date-fns` — Date manipulation

### UI
- `@expo/vector-icons` — Icon library
- `react-native-chart-kit` — Line charts
- `@react-navigation/bottom-tabs` — Tab navigation
- `react-native-safe-area-context` — Notch handling

### Platform
- `expo-secure-store` — Encrypted storage (mobile)
- `expo-localization` — Device locale detection
- `i18next` / `react-i18next` — Translations

---

## 📄 License

This project is private. All rights reserved.
