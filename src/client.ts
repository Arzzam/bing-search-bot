import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || "";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
// const tableName: string = "search_queries";

console.log({ supabase, supabaseKey, supabaseUrl });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAllSearchQueries(): Promise<any> {
  try {
    const data = await supabase.from("search_queries").select("*");

    // console.log(data);
    return data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching search queries:", error.message);
    return [];
  }
}

export { getAllSearchQueries };
