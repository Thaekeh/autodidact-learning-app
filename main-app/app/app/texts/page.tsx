"use client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TextRow } from "types/Texts";
import { getRouteForSingleText } from "utils/routing/texts";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/supabase";
import { getLocale } from "utils/translation/getLocale";
import { useTranslation } from "next-i18next";
import { FullTable } from "components/table/FullTable";
import { useConfirm } from "hooks/useConfirm";
import { deleteText, getTexts } from "utils/supabase/texts";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Texts() {
  const [texts, setTexts] = useState<TextRow[]>([]);
  const { isConfirmed } = useConfirm();
  const router = useRouter();

  const supabase = useSupabaseClient();

  useEffect(() => {
    getTexts(supabase).then((texts) => {
      setTexts(texts);
    });
  }, []);

  const supabaseClient = useSupabaseClient();

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await isConfirmed("Are you sure?");
    if (confirmed) {
      await deleteText(supabaseClient, id);
      const newTexts = await getTexts(supabaseClient);
      setTexts(newTexts);
    }
  };

  return (
    <div className="container mx-auto">
      <FullTable
        items={texts}
        openCallBack={(id) => router.push(getRouteForSingleText(id))}
        deleteCallback={handleDeleteCallback}
      ></FullTable>
    </div>
  );
}
