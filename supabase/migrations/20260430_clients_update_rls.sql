-- Migration: Add missing UPDATE RLS policies for clients table
-- Run this in your Supabase SQL editor

-- Consultant: can update clients assigned to them
CREATE POLICY "clients_consultant_update" ON public.clients
  FOR UPDATE USING (
    public.get_my_role() = 'consultant'
    AND assigned_consultant = (SELECT auth.uid())
  );

-- Receptionist: can update clients they onboarded
CREATE POLICY "clients_receptionist_update" ON public.clients
  FOR UPDATE USING (
    public.get_my_role() = 'receptionist'
    AND onboarded_by = (SELECT auth.uid())
  );
