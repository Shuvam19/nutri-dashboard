-- Custom Types / Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'receptionist', 'consultant');
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE public.dietary_preference AS ENUM ('veg', 'non_veg', 'vegan', 'eggetarian');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.client_status AS ENUM ('active', 'inactive', 'completed');
CREATE TYPE public.meal_category AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'beverage');
CREATE TYPE public.meal_slot AS ENUM ('early_morning', 'breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner', 'bedtime');
CREATE TYPE public.plan_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.appointment_type AS ENUM ('initial_consultation', 'follow_up', 'check_in');

-- 1. Profiles Table
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

-- Trigger to create profile automatically on auth signup
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

-- 2. Clients Table
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

-- 3. Food Items Table
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

-- 4. Diet Plans Table
CREATE TABLE public.diet_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID REFERENCES public.clients(id) ON DELETE CASCADE,
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

-- 5. Diet Plan Meals Table
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

-- 6. WhatsApp Log Table
CREATE TABLE public.whatsapp_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES public.clients(id),
  diet_plan_id    UUID REFERENCES public.diet_plans(id),
  sent_by         UUID NOT NULL REFERENCES public.profiles(id),
  message_preview TEXT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Appointments Table
CREATE TABLE public.appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  consultant_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_date    TIMESTAMPTZ NOT NULL,
  duration_minutes    INT NOT NULL DEFAULT 30,
  appointment_type    public.appointment_type NOT NULL DEFAULT 'follow_up',
  status              public.appointment_status NOT NULL DEFAULT 'scheduled',
  notes               TEXT,
  meeting_link        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Row Level Security (RLS) Policies

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.get_my_role() = 'admin');

-- Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_admin" ON public.clients
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "clients_receptionist_select" ON public.clients
  FOR SELECT USING (public.get_my_role() = 'receptionist');

CREATE POLICY "clients_receptionist_insert" ON public.clients
  FOR INSERT WITH CHECK (public.get_my_role() = 'receptionist');

CREATE POLICY "clients_consultant_insert" ON public.clients
  FOR INSERT WITH CHECK (
    public.get_my_role() = 'consultant'
    AND assigned_consultant = (SELECT auth.uid())
  );

CREATE POLICY "clients_consultant_select" ON public.clients
  FOR SELECT USING (
    public.get_my_role() = 'consultant'
    AND assigned_consultant = (SELECT auth.uid())
  );

-- Food Items
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_select" ON public.food_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "food_admin" ON public.food_items
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "food_consultant_insert" ON public.food_items
  FOR INSERT WITH CHECK (public.get_my_role() = 'consultant');

-- Diet Plans & Meals
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plan_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_admin" ON public.diet_plans
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "plans_consultant" ON public.diet_plans
  FOR ALL USING (
    public.get_my_role() = 'consultant'
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY "meals_admin" ON public.diet_plan_meals
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "meals_consultant" ON public.diet_plan_meals
  FOR ALL USING (
    public.get_my_role() = 'consultant'
    AND diet_plan_id IN (
      SELECT id FROM public.diet_plans WHERE created_by = (SELECT auth.uid())
    )
  );

-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_admin" ON public.appointments
  FOR ALL USING (public.get_my_role() = 'admin');

CREATE POLICY "appointments_consultant" ON public.appointments
  FOR ALL USING (
    public.get_my_role() = 'consultant'
    AND consultant_id = (SELECT auth.uid())
  );
