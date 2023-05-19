import { SupabaseClient } from "@supabase/supabase-js";
import { FlashcardListRow } from "types";
import { flashcardListsTable } from "./tables";

export const getListsForUser = async (
  supabase: SupabaseClient
): Promise<FlashcardListRow[]> => {
  const { data } = await supabase.from(flashcardListsTable).select();
  return data || [];
};

export const createNewFlashcardList = async (
  supabaseClient: SupabaseClient,
  name: string
): Promise<FlashcardListRow> => {
  const user = await supabaseClient.auth.getSession();
  const newFlashcardList = {
    name,
    user_id: user.data.session?.user.id,
  };
  const { data } = await supabaseClient
    .from(flashcardListsTable)
    .insert(newFlashcardList)
    .select()
    .single();
  return data;
};

export const setListName = async (
  supabaseClient: SupabaseClient,
  listId: string,
  name: string
) => {
  await supabaseClient
    .from(flashcardListsTable)
    .update({ name })
    .eq("id", listId);
};

export const getListById = async (
  supabase: SupabaseClient,
  listId: string
): Promise<FlashcardListRow | null> => {
  const { data } = await supabase
    .from(flashcardListsTable)
    .select()
    .eq("id", listId)
    .single();
  return data;
};

export type FlashcardListWithNameOnly = Pick<FlashcardListRow, "name" | "id">;

export const getAllFlashcardListsNamesOnly = async (
  supabase: SupabaseClient
): Promise<FlashcardListWithNameOnly[] | null> => {
  const { data } = await supabase.from(flashcardListsTable).select("id, name");
  return data;
};

export const deleteList = async (supabase: SupabaseClient, listId: string) => {
  await supabase.from(flashcardListsTable).delete().eq("id", listId);
};
