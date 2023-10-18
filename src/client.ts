/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || "";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
const tableName: string = "search_queries";
const col_name: string = "search_query";

async function getAllSearchQueries(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from(tableName).select(col_name);
    if (error) throw error;
    if (data) {
      return data || [];
    }
  } catch (error: any) {
    console.error("Error fetching search queries:", error.message);
    return [];
  }
  return [];
}

export { getAllSearchQueries };
