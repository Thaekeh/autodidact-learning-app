import { SupabaseClient } from "@supabase/supabase-js";
import { FlashcardRow } from "../../types";
import { flashcardsTable } from "./tables";


export const getFlashcardsForList = async (supabase: SupabaseClient, listId: string): Promise<FlashcardRow[] | null> => {
    const { data } = await supabase
    .from(flashcardsTable)
    .select()
    .eq("list_id", listId);
    return data
}

export const createNewFlashcard = async(supabase: SupabaseClient, frontText: string, backText: string, listId: string): Promise<boolean> => {
    const user = await supabase.auth.getSession();
    const result = await supabase.from(flashcardsTable).insert({frontText, backText, "user_id": user.data.session?.user.id, "list_id": listId})
    
    if (!result.error && !!result.count) {
        return true;
    }
    return false;
}

export const updateFlashcard = async(supabase: SupabaseClient, flashcardId: string, frontText?: string, backText?: string, listId?: string) => {
    if (!flashcardId) return;
    const updateObject: Partial<FlashcardRow> = {}
    if (frontText) updateObject["frontText"] = frontText
    if (backText) updateObject["backText"] = backText
    if (listId) updateObject["list_id"] = listId
    if (Object.keys(updateObject).length === 0) return;
    const result = await supabase.from(flashcardsTable).update(updateObject).eq("id", flashcardId)

    if (!result.error && !!result.count) {
        return true;
    }
    return false;
}