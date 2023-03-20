import {
  Button,
  Container,
  Spacer,
  useModal,
  Text,
  Table,
  Row,
} from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { Edit2, Plus, Trash } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import { FullTable } from "../../components/table/FullTable";
import { Database, FlashcardListRow } from "../../types";
import { getListsForUser } from "../../util";

export default function Lists({ lists }: { lists: FlashcardListRow[] }) {
  const handleOpenCallback = (id: string) => {
    console.log(id);
  };

  const handleDeleteCallback = (id: string) => {
    console.log(id);
  };

  return (
    <>
      <Container>
        <Spacer y={2}></Spacer>
        <Container
          display="flex"
          direction="row"
          justify="space-between"
          alignContent="center"
        >
          <Text h3>Your lists</Text>
          <Button size={"md"} icon={<Plus size={16} />}>
            Create New
          </Button>
        </Container>
        <FullTable
          items={lists}
          openCallBack={handleOpenCallback}
          deleteCallback={handleDeleteCallback}
        ></FullTable>
      </Container>
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const supabase = await createServerSupabaseClient<Database>({
    req,
    res,
  });

  const lists = await getListsForUser(supabase);
  return { props: { lists } };
}
