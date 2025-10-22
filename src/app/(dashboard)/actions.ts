"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const signOutAction = async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
};
