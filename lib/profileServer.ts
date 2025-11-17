import { getSupabaseServerClient } from "./supabaseServer";

export async function getProfileBySupabaseId(supabaseId: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("supabaseId", supabaseId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrCreateProfile(
  supabaseId: string,
  email?: string | null
) {
  if (!supabaseId) return null;

  const existing = await getProfileBySupabaseId(supabaseId);

  if (existing) {
    return existing;
  }

  if (!email) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("UserProfile")
    .insert({ supabaseId, email })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

