import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Container, red, Row, Table, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { Eye, Trash } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { TextRow } from "../../types/Texts";
import { getRouteForSingleText } from "../../util/routing/texts";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { getLocale } from "../../util/translation/getLocale";
import { useTranslation } from "next-i18next";
import { FullTable } from "../../components/table/FullTable";

export default function Texts({ texts }: { texts: TextRow[] }) {
  const { t } = useTranslation();

  const handleOpenCallback = (id: string) => {
    console.log(id);
  };

  const handleDeleteCallback = (id: string) => {
    console.log(id);
  };

  return (
    <Container css={{ marginTop: "$18" }}>
      <FullTable
        items={texts}
        openCallBack={handleOpenCallback}
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
