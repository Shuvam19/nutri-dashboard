"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GenderType, ActivityLevel, DietaryPreference } from "@/lib/types/database";

export async function getClients() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      profiles:assigned_consultant(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  return data;
}

export async function getPaginatedClients(page: number = 1, limit: number = 10) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("clients")
    .select(`
      *,
      profiles:assigned_consultant(full_name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching paginated clients:", error);
    return { data: [], count: 0 };
  }
  
  return { data, count: count || 0 };
}

export async function createClientAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const parseArray = (str: string) => {
    if (!str || str.trim() === '') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const clientData = {
    full_name: `${formData.get("first_name")} ${formData.get("last_name")}`,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as GenderType,
    email: (formData.get("email") as string) || null,
    phone: formData.get("phone") as string,
    
    // Health Data
    height_cm: formData.get("height_cm") ? parseFloat(formData.get("height_cm") as string) : null,
    weight_kg: formData.get("weight_kg") ? parseFloat(formData.get("weight_kg") as string) : null,
    daily_activity_level: (formData.get("daily_activity_level") as ActivityLevel) || "sedentary",
    active_diseases: parseArray(formData.get("active_diseases") as string),
    past_diseases: parseArray(formData.get("past_diseases") as string),
    allergies: parseArray(formData.get("allergies") as string),
    
    // Preferences & Notes
    dietary_preference: (formData.get("dietary_preference") as DietaryPreference) || "veg",
    region: (formData.get("region") as string) || null,
    goals: (formData.get("goals") as string) || null,
    notes: (formData.get("notes") as string) || null,

    onboarded_by: user?.id,
    assigned_consultant: user?.id, 
  };

  const { error } = await supabase.from("clients").insert(clientData);

  if (error) {
    console.error("Error creating client:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/clients");
  redirect("/clients");
}

export async function getClientById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      profiles:assigned_consultant(full_name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching client by id:", error);
    return null;
  }
  return data;
}

export async function getClientDietPlans(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diet_plans")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client diet plans:", error);
    return [];
  }
  return data;
}

export async function getClientAppointments(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_id", clientId)
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error("Error fetching client appointments:", error);
    return [];
  }
  return data;
}

export async function updateClientAction(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const parseArray = (str: string) => {
    if (!str || str.trim() === '') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const clientData = {
    full_name: formData.get("first_name") && formData.get("last_name") ? `${formData.get("first_name")} ${formData.get("last_name")}` : formData.get("full_name") as string,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as GenderType,
    email: (formData.get("email") as string) || null,
    phone: formData.get("phone") as string,
    
    height_cm: formData.get("height_cm") ? parseFloat(formData.get("height_cm") as string) : null,
    weight_kg: formData.get("weight_kg") ? parseFloat(formData.get("weight_kg") as string) : null,
    daily_activity_level: (formData.get("daily_activity_level") as ActivityLevel) || "sedentary",
    active_diseases: parseArray(formData.get("active_diseases") as string),
    past_diseases: parseArray(formData.get("past_diseases") as string),
    allergies: parseArray(formData.get("allergies") as string),
    
    dietary_preference: (formData.get("dietary_preference") as DietaryPreference) || "veg",
    region: (formData.get("region") as string) || null,
    goals: (formData.get("goals") as string) || null,
    notes: (formData.get("notes") as string) || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id);

  if (error) {
    console.error("Error updating client:", error);
    return { success: false, message: error.message };
  }

  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
  redirect(`/clients/${id}`);
}
