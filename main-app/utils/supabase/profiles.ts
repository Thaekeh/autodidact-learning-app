import { SupabaseClient } from "@supabase/supabase-js";
import { profilesTable } from "./tables";
import { ProfileRow } from "types";

export const getProfileByUserId = async (
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileRow> => {
  const { data, error } = await supabase
    .from(profilesTable)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
