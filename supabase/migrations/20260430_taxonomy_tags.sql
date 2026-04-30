-- ============================================================
-- Migration: Create taxonomy_tags lookup table
-- ============================================================

CREATE TABLE public.taxonomy_tags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT NOT NULL,
  value       TEXT NOT NULL,
  label       TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_taxonomy_category_value ON public.taxonomy_tags(category, value);
CREATE INDEX idx_taxonomy_category ON public.taxonomy_tags(category);

-- RLS
ALTER TABLE public.taxonomy_tags ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read
CREATE POLICY "taxonomy_select" ON public.taxonomy_tags
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin can CUD
CREATE POLICY "taxonomy_admin" ON public.taxonomy_tags
  FOR ALL USING (public.get_my_role() = 'admin');


-- ============================================================
-- Seed: dietary_tag
-- ============================================================
INSERT INTO public.taxonomy_tags (category, value, label, sort_order) VALUES
  ('dietary_tag', 'veg',          'Vegetarian',     1),
  ('dietary_tag', 'non_veg',      'Non-Vegetarian',  2),
  ('dietary_tag', 'vegan',        'Vegan',           3),
  ('dietary_tag', 'gluten_free',  'Gluten-Free',     4),
  ('dietary_tag', 'dairy_free',   'Dairy-Free',      5),
  ('dietary_tag', 'sugar_free',   'Sugar-Free',      6),
  ('dietary_tag', 'high_protein', 'High Protein',    7),
  ('dietary_tag', 'high_fiber',   'High Fiber',      8),
  ('dietary_tag', 'low_carb',     'Low Carb',        9),
  ('dietary_tag', 'low_fat',      'Low Fat',         10),
  ('dietary_tag', 'keto',         'Keto',            11),
  ('dietary_tag', 'whole_grain',  'Whole Grain',     12),
  ('dietary_tag', 'eggetarian',   'Eggetarian',      13);

-- ============================================================
-- Seed: disease_tag (for food items — clinical compatibility)
-- ============================================================
INSERT INTO public.taxonomy_tags (category, value, label, sort_order) VALUES
  ('disease_tag', 'diabetes_friendly',    'Diabetes Friendly',    1),
  ('disease_tag', 'heart_healthy',        'Heart Healthy',        2),
  ('disease_tag', 'hypertension_safe',    'Hypertension Safe',    3),
  ('disease_tag', 'thyroid_friendly',     'Thyroid Friendly',     4),
  ('disease_tag', 'pcod_friendly',        'PCOD Friendly',        5),
  ('disease_tag', 'kidney_friendly',      'Kidney Friendly',      6),
  ('disease_tag', 'liver_friendly',       'Liver Friendly',       7),
  ('disease_tag', 'cholesterol_safe',     'Cholesterol Safe',     8),
  ('disease_tag', 'gastric_friendly',     'Gastric Friendly',     9),
  ('disease_tag', 'anti_inflammatory',    'Anti-Inflammatory',    10);

-- ============================================================
-- Seed: region_tag
-- ============================================================
INSERT INTO public.taxonomy_tags (category, value, label, sort_order) VALUES
  ('region_tag', 'north_indian',    'North Indian',     1),
  ('region_tag', 'south_indian',    'South Indian',     2),
  ('region_tag', 'east_indian',     'East Indian',      3),
  ('region_tag', 'west_indian',     'West Indian',      4),
  ('region_tag', 'bengali',         'Bengali',          5),
  ('region_tag', 'gujarati',        'Gujarati',         6),
  ('region_tag', 'maharashtrian',   'Maharashtrian',    7),
  ('region_tag', 'punjabi',         'Punjabi',          8),
  ('region_tag', 'rajasthani',      'Rajasthani',       9),
  ('region_tag', 'tamil',           'Tamil',            10),
  ('region_tag', 'kerala',          'Kerala',           11),
  ('region_tag', 'continental',     'Continental',      12),
  ('region_tag', 'universal',       'Universal',        13);

-- ============================================================
-- Seed: disease (for client intake — medical conditions)
-- ============================================================
INSERT INTO public.taxonomy_tags (category, value, label, sort_order) VALUES
  ('disease', 'diabetes_type1',   'Diabetes (Type 1)',    1),
  ('disease', 'diabetes_type2',   'Diabetes (Type 2)',    2),
  ('disease', 'hypertension',     'Hypertension',         3),
  ('disease', 'thyroid_hypo',     'Thyroid (Hypo)',       4),
  ('disease', 'thyroid_hyper',    'Thyroid (Hyper)',      5),
  ('disease', 'pcod_pcos',        'PCOD/PCOS',            6),
  ('disease', 'cholesterol_high', 'Cholesterol (High)',   7),
  ('disease', 'heart_disease',    'Heart Disease',        8),
  ('disease', 'kidney_disease',   'Kidney Disease',       9),
  ('disease', 'liver_disease',    'Liver Disease',        10),
  ('disease', 'gastric_issues',   'Gastric Issues',       11),
  ('disease', 'arthritis',        'Arthritis',            12),
  ('disease', 'asthma',           'Asthma',               13),
  ('disease', 'anemia',           'Anemia',               14),
  ('disease', 'obesity',          'Obesity',              15);

-- ============================================================
-- Seed: allergy (for client intake)
-- ============================================================
INSERT INTO public.taxonomy_tags (category, value, label, sort_order) VALUES
  ('allergy', 'milk_dairy',   'Milk/Dairy',    1),
  ('allergy', 'gluten_wheat', 'Gluten/Wheat',  2),
  ('allergy', 'peanuts',      'Peanuts',       3),
  ('allergy', 'tree_nuts',    'Tree Nuts',     4),
  ('allergy', 'soy',          'Soy',           5),
  ('allergy', 'eggs',         'Eggs',          6),
  ('allergy', 'fish',         'Fish',          7),
  ('allergy', 'shellfish',    'Shellfish',     8),
  ('allergy', 'sesame',       'Sesame',        9);
