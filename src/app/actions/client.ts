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

export async function createClientAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const clientData = {
    full_name: `${formData.get("first_name")} ${formData.get("last_name")}`,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as GenderType,
    email: (formData.get("email") as string) || null,
    phone: formData.get("phone") as string,
    daily_activity_level: "sedentary" as ActivityLevel,
    dietary_preference: "veg" as DietaryPreference,
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
