import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

export async function insertRow(
  table: string,
  row: Record<string, unknown>
): Promise<boolean> {
  if (!supabase) {
    console.warn(`Supabase not configured; skipping insert into ${table}`);
    return false;
  }
  const { error } = await supabase.from(table).insert([row]);
  if (error) {
    console.error(`Supabase insert into ${table} failed:`, error.message);
    return false;
  }
  return true;
}

export async function updateRow(
  table: string,
  updates: Record<string, unknown>,
  id: string
): Promise<boolean> {
  if (!supabase) {
    console.warn(`Supabase not configured; skipping update on ${table}`);
    return false;
  }
  const { error } = await supabase.from(table).update(updates).eq("id", id);
  if (error) {
    console.error(`Supabase update on ${table} failed:`, error.message);
    return false;
  }
  return true;
}
