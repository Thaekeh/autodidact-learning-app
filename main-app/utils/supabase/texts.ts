import { SupabaseClient } from "@supabase/supabase-js";
import { TextRow } from "types";
import { textsTable } from "./tables";

export const createNewText = async (
  supabaseClient: SupabaseClient,
  name: string
): Promise<TextRow> => {
  const user = await supabaseClient.auth.getSession();
  const { data } = await supabaseClient
    .from("texts")
    .insert({ name, user_id: user.data.session?.user.id })
    .select()
    .single();
  return data;
};

export const saveTextContent = async (
  supabaseClient: SupabaseClient,
  textId: string,
  content: string
) => {
  await supabaseClient.from("texts").update({ content }).eq("id", textId);
};

export const deleteText = async (
  supabaseClient: SupabaseClient,
  textId: string
) => {
  await supabaseClient.from(textsTable).delete().eq("id", textId);
};

export const getTexts = async (
  supabaseClient: SupabaseClient
): Promise<TextRow[]> => {
  const { data } = await supabaseClient.from(textsTable).select();
  return data || [];
};
