-- ============================================================
-- Migration: Create role_permissions table for feature-level access control
-- ============================================================

CREATE TABLE public.role_permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role        public.user_role NOT NULL,
  feature     TEXT NOT NULL,
  is_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_role_perm_role_feature ON public.role_permissions(role, feature);

-- RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read (needed for permission checks)
CREATE POLICY "role_permissions_select" ON public.role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin can modify
CREATE POLICY "role_permissions_admin" ON public.role_permissions
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================
-- Seed: Default permissions for all roles
-- Admin gets everything enabled. Consultant & Receptionist get sensible defaults.
-- ============================================================

-- Admin — all features enabled
INSERT INTO public.role_permissions (role, feature, is_enabled) VALUES
  ('admin', 'dashboard.view', TRUE),
  ('admin', 'clients.view', TRUE),
  ('admin', 'clients.create', TRUE),
  ('admin', 'clients.edit', TRUE),
  ('admin', 'food_bucket.view', TRUE),
  ('admin', 'food_bucket.create', TRUE),
  ('admin', 'diet_plans.view', TRUE),
  ('admin', 'diet_plans.create', TRUE),
  ('admin', 'diet_plans.edit', TRUE),
  ('admin', 'appointments.view', TRUE),
  ('admin', 'appointments.create', TRUE),
  ('admin', 'settings.view', TRUE);

-- Consultant
INSERT INTO public.role_permissions (role, feature, is_enabled) VALUES
  ('consultant', 'dashboard.view', TRUE),
  ('consultant', 'clients.view', TRUE),
  ('consultant', 'clients.create', TRUE),
  ('consultant', 'clients.edit', TRUE),
  ('consultant', 'food_bucket.view', TRUE),
  ('consultant', 'food_bucket.create', TRUE),
  ('consultant', 'diet_plans.view', TRUE),
  ('consultant', 'diet_plans.create', TRUE),
  ('consultant', 'diet_plans.edit', TRUE),
  ('consultant', 'appointments.view', TRUE),
  ('consultant', 'appointments.create', TRUE),
  ('consultant', 'settings.view', FALSE);

-- Receptionist
INSERT INTO public.role_permissions (role, feature, is_enabled) VALUES
  ('receptionist', 'dashboard.view', TRUE),
  ('receptionist', 'clients.view', TRUE),
  ('receptionist', 'clients.create', TRUE),
  ('receptionist', 'clients.edit', FALSE),
  ('receptionist', 'food_bucket.view', FALSE),
  ('receptionist', 'food_bucket.create', FALSE),
  ('receptionist', 'diet_plans.view', FALSE),
  ('receptionist', 'diet_plans.create', FALSE),
  ('receptionist', 'diet_plans.edit', FALSE),
  ('receptionist', 'appointments.view', TRUE),
  ('receptionist', 'appointments.create', TRUE),
  ('receptionist', 'settings.view', FALSE);
