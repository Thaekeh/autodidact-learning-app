import { SupabaseClient } from "@supabase/supabase-js";
import { TextRow } from "types";
import { textsTable } from "./tables";

export const createNewText = async (
  supabaseClient: SupabaseClient,
  name: string,
  epubUrl?: string,
  flashcardListId?: string
): Promise<TextRow> => {
  const user = await supabaseClient.auth.getSession();
  const { data } = await supabaseClient
    .from("texts")
    .insert({
      name,
      user_id: user.data.session?.user.id,
      epub_file: epubUrl || null,
      last_flashcard_list: flashcardListId || null,
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

export const setTextName = async (
  supabaseClient: SupabaseClient,
  textId: string,
  name: string
) => {
  await supabaseClient.from("texts").update({ name }).eq("id", textId);
};

export const setLastEpubLocation = async (
  supabaseClient: SupabaseClient,
  textId: string,
  epubLocation: string
) => {
  await supabaseClient
    .from("texts")
    .update({ last_epub_location: epubLocation })
    .eq("id", textId);
};

export const setLastFlashcardList = async (
  supabaseClient: SupabaseClient,
  textId: string,
  flashcardListId: string
) => {
  await supabaseClient
    .from("texts")
    .update({ last_flashcard_list: flashcardListId })
    .eq("id", textId);
};

export const setLastSourceLanguage = async (
  supabaseClient: SupabaseClient,
  textId: string,
  sourceLanguage: string
) => {
  await supabaseClient
    .from("texts")
    .update({ last_source_language: sourceLanguage })
    .eq("id", textId);
};

export const setLastTargetLanguage = async (
  supabaseClient: SupabaseClient,
  textId: string,
  targetLanguage: string
) => {
  await supabaseClient
    .from("texts")
    .update({ last_target_language: targetLanguage })
    .eq("id", textId);
};

export const deleteTextAndAttachedFiles = async (
  supabaseClient: SupabaseClient,
  textId: string
) => {
  const text = await getTextById(supabaseClient, textId);
  if (text?.epub_file) {
    await supabaseClient.storage.from("test-bucket").remove([text.epub_file]);
  }
  await supabaseClient.from(textsTable).delete().eq("id", textId);
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
