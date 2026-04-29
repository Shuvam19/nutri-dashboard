"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppointmentStatus, AppointmentType } from "@/lib/types/database";

export async function createAppointment(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }
  
  const client_id = formData.get("client_id") as string;
  const appointment_date = formData.get("appointment_date") as string;
  const duration_minutes = parseInt(formData.get("duration_minutes") as string, 10);
  const appointment_type = formData.get("appointment_type") as AppointmentType;
  const notes = formData.get("notes") as string;
  const meeting_link = formData.get("meeting_link") as string;
  
  if (!client_id || !appointment_date || !duration_minutes || !appointment_type) {
    return { success: false, message: "Missing required fields" };
  }
  
  const { error } = await supabase
    .from("appointments")
    .insert({
      client_id,
      consultant_id: user.id,
      appointment_date,
      duration_minutes,
      appointment_type,
      notes: notes || null,
      meeting_link: meeting_link || null,
      status: "scheduled"
    });
    
  if (error) {
    console.error("Error creating appointment:", error);
    return { success: false, message: error.message };
  }
  
  revalidatePath("/appointments");
  redirect("/appointments");
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
    
  if (error) {
    console.error("Error updating appointment:", error);
    return { success: false, message: error.message };
  }
  
  revalidatePath("/appointments");
  return { success: true };
}

export async function getAppointments() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( full_name )
    `)
    .order("appointment_date", { ascending: true });
    
  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
  
  return data;
}
