"use client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container } from "@nextui-org/react";
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
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Texts({ texts: textsProp }: { texts: TextRow[] }) {
  const { t } = useTranslation();
  const [texts, setTexts] = useState<TextRow[]>(textsProp);
  const { isConfirmed } = useConfirm();
  const router = useRouter();

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
    <Container css={{ marginTop: "$18" }}>
      <FullTable
        items={texts}
        openCallBack={(id) => router.push(getRouteForSingleText(id))}
        deleteCallback={handleDeleteCallback}
      ></FullTable>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = await createServerSupabaseClient<Database>(context);

  const { data: texts } = await supabase.from("texts").select();

  return {
    props: {
      ...(await serverSideTranslations(getLocale(context.locale), ["common"])),
      texts,
    },
  };
}
