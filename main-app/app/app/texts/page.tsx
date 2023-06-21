"use client";
import { TextRow } from "types/Texts";
import { getRouteForSingleText } from "utils/routing/texts";
import { useConfirm } from "hooks/useConfirm";
import { deleteText, getTexts } from "utils/supabase/texts";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { RowType, SimpleTable } from "components/table/SimpleTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Texts() {
  const [texts, setTexts] = useState<TextRow[]>([]);
  const { isConfirmed } = useConfirm();

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    getTexts(supabaseClient).then((texts) => {
      setTexts(texts);
    });
  }, []);

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteText(supabaseClient, id);
      const newTexts = await getTexts(supabaseClient);
      setTexts(newTexts);
    }
  };

  const simpleMappedItems = (items: TextRow[] | null) => {
    if (!items) return [];
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: RowType.text,
      };
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <SimpleTable
        items={simpleMappedItems(texts)}
        openHrefFunction={(id) => getRouteForSingleText(id)}
        editCallback={(id) => console.log("edit", id)}
        deleteCallback={handleDeleteCallback}
      ></SimpleTable>
    </div>
  );
}
