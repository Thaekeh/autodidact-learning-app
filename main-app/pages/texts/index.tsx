import { Button, Container, Table } from "@nextui-org/react";
import { getToken } from "next-auth/jwt";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import clientPromise from "../../lib/mongodb";

export default function Texts({ texts }) {
  return (
    <Container>
      <Table>
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Last opened</Table.Column>
          <Table.Column>f</Table.Column>
        </Table.Header>
        <Table.Body>
          {texts.map((text) => {
            return (
              <Table.Row key={text.name}>
                <Table.Cell>{text.name}</Table.Cell>
                <Table.Cell>{text.lastOpened}</Table.Cell>
                <Table.Cell> </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  const userId = session?.user?.id;
  try {
    const client = await clientPromise;
    const textsCollection = await client.db("learningHub").collection("texts");
    if (!userId) {
      console.log("no userId in fetch");
      return;
    } else {
      const texts = await textsCollection.find({ userId }).toArray();
      console.log(`texts`, texts);
      return {
        props: {
          texts: JSON.parse(JSON.stringify(texts)),
        },
      };
    }
  } catch (e) {
    console.error(e);
  }
}
