# Nutritionist CRM & Meal Planner — Architecture Blueprint

> This file is the single source of truth for the project's architecture, conventions, and data models.
> All AI-assisted coding sessions should reference this document.

---

## 1. Project Overview

A CRM and meal-planning tool for nutritionists / dietitians. It replaces paper-based workflows with a digital system that:

- **Onboards clients** via structured intake forms (age, activity level, medical history, diseases).
- **Manages a food bucket** — a master database of foods tagged by region, dietary preference, and disease compatibility.
- **Builds diet plans** by selecting foods from the bucket, arranging them into daily meal slots, and previewing / exporting as PDF.
- **Sends plans via WhatsApp** using manual `wa.me` deep links (no API).

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full CRUD on all data. Manages users, master data, and system settings. |
| **Receptionist** | Creates clients, fills onboarding forms. Read-only on food & diet plans. |
| **Consultant** | Reads assigned clients, creates/manages diet plans, reads food bucket. |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | v4 |
| Backend / DB | Supabase (Auth, PostgreSQL, Storage) | Latest |
| Auth SSR | @supabase/ssr | Latest |
| PDF Generation | pdfmake | 0.3.x |
| Package Manager | npm | — |

### Key Principles

- **Server Components by default** — use `"use client"` only when interactivity is required.
- **Cookie-based auth** via `@supabase/ssr` — no localStorage tokens.
- **RLS enforced on every table** — the anon key is safe because policies restrict access.
- **No `any` types** — all data must be strictly typed.

---

## 3. Folder Structure

```
src/
├── app/
│   ├── (auth)/                  # Public auth routes
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/             # Protected routes (shared sidebar layout)
│   │   ├── layout.tsx           # Sidebar + topbar shell
│   │   ├── page.tsx             # Dashboard home / overview
│   │   ├── clients/
│   │   │   ├── page.tsx         # Client list
│   │   │   ├── new/page.tsx     # Onboarding form
│   │   │   └── [id]/page.tsx    # Client detail
│   │   ├── food-bucket/
│   │   │   ├── page.tsx         # Food list with filters
│   │   │   └── new/page.tsx     # Add/edit food item
│   │   ├── diet-plans/
│   │   │   ├── page.tsx         # Plan list
│   │   │   ├── new/page.tsx     # Meal builder
│   │   │   └── [id]/page.tsx    # Plan detail + PDF preview
│   │   └── settings/
│   │       └── page.tsx         # User/role management (admin only)
│   ├── api/
│   │   └── pdf/
│   │       └── route.ts         # PDF generation endpoint
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   └── page.tsx                 # Landing → redirect to /login or /dashboard
├── components/
│   ├── ui/                      # Primitives: Button, Input, Card, Modal, Badge, Select, Table
│   ├── forms/                   # ClientIntakeForm, FoodItemForm
│   ├── meal-builder/            # MealBuilder, MealSlotCard, FoodSelector
│   └── pdf/                     # PdfPreview, PdfDownloadButton
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # createBrowserClient()
│   │   ├── server.ts            # createServerClient()
│   │   └── middleware.ts        # refreshSession() helper
│   ├── pdf/
│   │   └── generate.ts          # buildDietPlanPdf() — pdfmake doc definition
│   ├── types/
│   │   ├── database.ts          # Supabase-aligned row types
│   │   └── index.ts             # App-level types & enums
│   ├── constants.ts             # Tag arrays, enum values, config
│   └── utils.ts                 # formatDate, calculateBMI, whatsappLink, etc.
├── hooks/                       # useDebounce, useClient, useFoodFilter, etc.
├── middleware.ts                 # Next.js middleware — auth guard + session refresh
└── styles/
    └── globals.css              # Tailwind @import + custom theme tokens
```

---

## 4. Database Schema (Supabase PostgreSQL)

### 4.1 Custom Types

```sql
-- Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'receptionist', 'consultant');
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE public.dietary_preference AS ENUM ('veg', 'non_veg', 'vegan', 'eggetarian');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.client_status AS ENUM ('active', 'inactive', 'completed');
CREATE TYPE public.meal_category AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'beverage');
CREATE TYPE public.meal_slot AS ENUM ('early_morning', 'breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner', 'bedtime');
CREATE TYPE public.plan_status AS ENUM ('draft', 'active', 'completed', 'archived');
```

### 4.2 `profiles`

Extends Supabase Auth. Created via trigger on `auth.users` insert.

```sql
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  role          public.user_role NOT NULL DEFAULT 'consultant',
  phone         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'consultant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4.3 `clients`

```sql
CREATE TABLE public.clients (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name             TEXT NOT NULL,
  age                   INT NOT NULL,
  gender                public.gender_type NOT NULL,
  phone                 TEXT NOT NULL,
  email                 TEXT,
  height_cm             NUMERIC(5,1),
  weight_kg             NUMERIC(5,1),
  daily_activity_level  public.activity_level NOT NULL DEFAULT 'sedentary',
  medical_history       JSONB DEFAULT '{}',
  active_diseases       TEXT[] DEFAULT '{}',
  past_diseases         TEXT[] DEFAULT '{}',
  allergies             TEXT[] DEFAULT '{}',
  dietary_preference    public.dietary_preference NOT NULL DEFAULT 'veg',
  region                TEXT,
  goals                 TEXT,
  notes                 TEXT,
  onboarded_by          UUID REFERENCES public.profiles(id),
  assigned_consultant   UUID REFERENCES public.profiles(id),
  status                public.client_status NOT NULL DEFAULT 'active',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_consultant ON public.clients(assigned_consultant);
```

### 4.4 `food_items`

```sql
CREATE TABLE public.food_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  description           TEXT,
  category              public.meal_category NOT NULL,
  calories_per_serving  NUMERIC(7,1) NOT NULL DEFAULT 0,
  protein_g             NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs_g               NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat_g                 NUMERIC(6,1) NOT NULL DEFAULT 0,
  fiber_g               NUMERIC(6,1) NOT NULL DEFAULT 0,
  serving_size          TEXT NOT NULL DEFAULT '1 serving',
  dietary_tags          TEXT[] DEFAULT '{}',
  disease_tags          TEXT[] DEFAULT '{}',
  region_tags           TEXT[] DEFAULT '{}',
  image_url             TEXT,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_by            UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_food_dietary ON public.food_items USING GIN(dietary_tags);
CREATE INDEX idx_food_disease ON public.food_items USING GIN(disease_tags);
CREATE INDEX idx_food_region  ON public.food_items USING GIN(region_tags);
```

### 4.5 `diet_plans`

```sql
CREATE TABLE public.diet_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_by    UUID NOT NULL REFERENCES public.profiles(id),
  title         TEXT NOT NULL,
  start_date    DATE,
  end_date      DATE,
  status        public.plan_status NOT NULL DEFAULT 'draft',
  notes         TEXT,
  total_days    INT NOT NULL DEFAULT 7,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plans_client ON public.diet_plans(client_id);
CREATE INDEX idx_plans_consultant ON public.diet_plans(created_by);
```

### 4.6 `diet_plan_meals`

```sql
CREATE TABLE public.diet_plan_meals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id        UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  day_number          INT NOT NULL CHECK (day_number >= 1),
  meal_type           public.meal_slot NOT NULL,
  food_item_id        UUID NOT NULL REFERENCES public.food_items(id),
  quantity            NUMERIC(5,2) NOT NULL DEFAULT 1,
  custom_instructions TEXT,
  sort_order          INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_meals_plan ON public.diet_plan_meals(diet_plan_id);
```

### 4.7 `whatsapp_log`

```sql
CREATE TABLE public.whatsapp_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES public.clients(id),
  diet_plan_id    UUID REFERENCES public.diet_plans(id),
  sent_by         UUID NOT NULL REFERENCES public.profiles(id),
  message_preview TEXT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. Row Level Security (RLS) Policies

> **Rule:** Enable RLS on every table. Wrap `auth.uid()` in a subquery for performance: `(SELECT auth.uid())`.

### Helper Function

```sql
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### profiles

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read profiles
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = (SELECT auth.uid()));

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.get_my_role() = 'admin');
```

### clients

```sql
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "clients_admin" ON public.clients
  FOR ALL USING (public.get_my_role() = 'admin');

-- Receptionist: can insert and read clients they onboarded
CREATE POLICY "clients_receptionist_select" ON public.clients
  FOR SELECT USING (
    public.get_my_role() = 'receptionist'
  );

CREATE POLICY "clients_receptionist_insert" ON public.clients
  FOR INSERT WITH CHECK (
    public.get_my_role() = 'receptionist'
  );

-- Consultant: read assigned clients
CREATE POLICY "clients_consultant_select" ON public.clients
  FOR SELECT USING (
    public.get_my_role() = 'consultant'
    AND assigned_consultant = (SELECT auth.uid())
  );
```

### food_items

```sql
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read
CREATE POLICY "food_select" ON public.food_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin can CUD
CREATE POLICY "food_admin" ON public.food_items
  FOR ALL USING (public.get_my_role() = 'admin');
```

### diet_plans & diet_plan_meals

```sql
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plan_meals ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "plans_admin" ON public.diet_plans
  FOR ALL USING (public.get_my_role() = 'admin');

-- Consultant: CRUD own plans
CREATE POLICY "plans_consultant" ON public.diet_plans
  FOR ALL USING (
    public.get_my_role() = 'consultant'
    AND created_by = (SELECT auth.uid())
  );

-- Meals follow plan access
CREATE POLICY "meals_admin" ON public.diet_plan_meals
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "meals_consultant" ON public.diet_plan_meals
  FOR ALL USING (
    public.get_my_role() = 'consultant'
    AND diet_plan_id IN (
      SELECT id FROM public.diet_plans WHERE created_by = (SELECT auth.uid())
    )
  );
```

---

## 6. Authentication Flow

### Strategy

- **Email + Password** via Supabase Auth.
- Cookie-based session managed by `@supabase/ssr`.
- `middleware.ts` refreshes the session on every request and redirects unauthenticated users.

### Middleware Pattern

```typescript
// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
```

### Route Protection

| Path Pattern | Access |
|-------------|--------|
| `/(auth)/*` | Public (redirect to dashboard if logged in) |
| `/(dashboard)/*` | Authenticated only |
| `/(dashboard)/settings/*` | Admin only |
| `/api/pdf/*` | Authenticated only |

---

## 7. Component Architecture

### Design Principles

1. **Modular** — each component has a single responsibility.
2. **Server-first** — data fetching happens in Server Components; forms and interactive UI use Client Components.
3. **Composable** — UI primitives in `components/ui/` are combined to build feature components.

### Key Components

| Component | Type | Location | Description |
|-----------|------|----------|-------------|
| `Button` | Client | `ui/Button.tsx` | Variants: primary, secondary, ghost, danger |
| `Input` | Client | `ui/Input.tsx` | Text, number, textarea with label + error state |
| `Select` | Client | `ui/Select.tsx` | Dropdown with search for tags |
| `Badge` | Server | `ui/Badge.tsx` | Colored tag badges for dietary/disease/region |
| `Card` | Server | `ui/Card.tsx` | Container with shadow, padding |
| `Modal` | Client | `ui/Modal.tsx` | Dialog overlay |
| `DataTable` | Client | `ui/DataTable.tsx` | Sortable, filterable table |
| `ClientIntakeForm` | Client | `forms/ClientIntakeForm.tsx` | Multi-step onboarding form |
| `FoodItemForm` | Client | `forms/FoodItemForm.tsx` | Food CRUD with tag selection |
| `MealBuilder` | Client | `meal-builder/MealBuilder.tsx` | Day grid + meal slot layout |
| `FoodSelector` | Client | `meal-builder/FoodSelector.tsx` | Filterable food picker panel |
| `MealSlotCard` | Client | `meal-builder/MealSlotCard.tsx` | Single meal slot with food items |
| `PdfPreview` | Client | `pdf/PdfPreview.tsx` | Iframe PDF preview |
| `PdfDownloadButton` | Client | `pdf/PdfDownloadButton.tsx` | Generate + download trigger |

---

## 8. TypeScript Rules

### Strict Requirements

```jsonc
// tsconfig.json — already enforced
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Conventions

- **No `any`** — use `unknown` + type guards if the type is truly unknown.
- **Database types** — define row types in `lib/types/database.ts` matching the Supabase schema exactly. Replace with `supabase gen types typescript` output when available.
- **Component props** — always define an explicit `interface` (not inline types).
- **Server Actions** — return `{ success: boolean; error?: string; data?: T }`.
- **Enums as const arrays** — use `as const` arrays in `constants.ts` and derive types with `typeof`.

---

## 9. UI / UX Standards

### Design Tokens (Tailwind v4 CSS variables)

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary-50:  #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  --color-accent-500: #f59e0b;
  --color-accent-600: #d97706;

  --color-surface: #ffffff;
  --color-surface-elevated: #f8fafc;
  --color-surface-dark: #0f172a;

  --font-family-sans: 'Inter', system-ui, sans-serif;
  --radius-default: 0.75rem;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
}
```

### Visual Guidelines

- Use **Inter** font from Google Fonts.
- **Rounded corners** (`rounded-xl`) on cards and buttons.
- **Subtle shadows** for depth — no harsh borders.
- **Green primary palette** (health/nutrition theme).
- **Amber accent** for warnings, highlights.
- **Micro-animations**: `transition-all duration-200` on hover/focus states.
- **Responsive**: mobile-first, sidebar collapses on small screens.
- **Dark mode**: support via Tailwind `dark:` variant (future phase).

---

## 10. PDF Generation

### Architecture

- **Route Handler** at `src/app/api/pdf/route.ts`.
- Uses `pdfmake` on the server (no browser dependency).
- Accepts `diet_plan_id` via POST body, fetches plan + meals + food items, builds the document definition, returns a PDF buffer.

### Document Structure

```
┌─────────────────────────────────────┐
│  CLINIC HEADER (logo + name)        │
├─────────────────────────────────────┤
│  Client: Name, Age, Goals           │
│  Plan: Title, Date Range            │
├─────────────────────────────────────┤
│  DAY 1                              │
│  ┌─────────┬──────────┬───────────┐ │
│  │ Slot    │ Food     │ Qty/Notes │ │
│  ├─────────┼──────────┼───────────┤ │
│  │ Breakf  │ Oats ... │ 1 bowl    │ │
│  │ Lunch   │ Roti ... │ 2 pcs     │ │
│  └─────────┴──────────┴───────────┘ │
│  Daily Total: Cal / Protein / ...   │
├─────────────────────────────────────┤
│  DAY 2 ...                          │
├─────────────────────────────────────┤
│  FOOTER: Generated on <date>        │
└─────────────────────────────────────┘
```

### Next.js Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfmake'],
};
```

---

## 11. WhatsApp Integration (Manual Send)

No API. The app generates a `wa.me` deep link:

```typescript
function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}
```

### Flow

1. Consultant views a completed diet plan.
2. Clicks "Send via WhatsApp" button.
3. App builds a text summary of the plan (meal slots, foods, quantities).
4. Opens `wa.me` link in a new tab → WhatsApp Web / app opens with pre-filled message.
5. App logs the send to `whatsapp_log` table.

---

## 12. Coding Conventions

### File Naming

- **Components**: PascalCase — `ClientIntakeForm.tsx`
- **Utilities/lib**: camelCase — `generate.ts`, `utils.ts`
- **Pages**: `page.tsx` (Next.js convention)
- **Types**: PascalCase for interfaces, camelCase for type aliases of primitives

### Imports

- Use `@/` alias for all project imports.
- Group imports: React → Next.js → third-party → project (`@/lib`, `@/components`).

### Error Handling

- Server Actions: always return `{ success, error?, data? }` — never throw to the client.
- API Routes: return proper HTTP status codes with JSON error bodies.
- Client: use `try/catch` with user-friendly toast messages.

### Server vs Client Components

```
Server Component (default):
  ✅ Data fetching, layout, static rendering
  ✅ Reading cookies/headers
  ❌ No useState, useEffect, event handlers

Client Component ("use client"):
  ✅ Forms, interactive UI, event handlers
  ✅ Hooks (useState, useEffect, custom hooks)
  ❌ Cannot directly read cookies (use server actions)
```

### Git Conventions

- **Commits**: `feat:`, `fix:`, `chore:`, `docs:` prefixes.
- **Branches**: `feature/<name>`, `fix/<name>`.

---

## 13. Development Workflow

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 14. Future Enhancements (Out of Scope for MVP)

- [ ] Dark mode toggle
- [ ] Multi-language support (Hindi, regional)
- [ ] Food image uploads to Supabase Storage
- [ ] Client progress tracking (weight over time)
- [ ] Automated meal plan suggestions (AI-powered)
- [ ] Client self-service portal (view their diet plans)
- [ ] Appointment scheduling
- [ ] Invoice / payment tracking
