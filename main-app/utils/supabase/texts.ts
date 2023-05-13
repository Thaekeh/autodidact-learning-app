import { SupabaseClient } from "@supabase/supabase-js";
import { TextRow } from "types";
import { textsTable } from "./tables";

export const createNewText = async (
  supabaseClient: SupabaseClient,
  name: string,
  epubUrl?: string
): Promise<TextRow> => {
  const user = await supabaseClient.auth.getSession();
  const { data } = await supabaseClient
    .from("texts")
    .insert({
      name,
      user_id: user.data.session?.user.id,
      epub_file: epubUrl || null,
    })
    .select()
    .single();
  return data;
};

export const setTextContent = async (
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

export const getTextById = async (
  supabaseClient: SupabaseClient,
  textId: string
): Promise<TextRow | null> => {
  const { data } = await supabaseClient
    .from(textsTable)
    .select()
    .eq("id", textId)
    .single();
  return data;
};
