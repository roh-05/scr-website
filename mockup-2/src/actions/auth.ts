// src/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/lib/types";

export async function login(formData: FormData): Promise<ActionResponse | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[AUTH lOGIN ERROR]:", error.message);
    return { success: false, error: "Invalid username or password." };
  }

  // If successful, push them into the dashboard
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}