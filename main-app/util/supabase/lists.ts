import { SupabaseClient } from "@supabase/supabase-js";
import { FlashcardListRow } from "../../types";
import { flashcardListsTable } from "./tables";

export const getListsForUser = async (
  supabase: SupabaseClient
): Promise<FlashcardListRow[] | null> => {
  const { data } = await supabase.from(flashcardListsTable).select();
  return data;
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
