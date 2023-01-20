import { Col, Container, red, Row, Table, Tooltip } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { Edit2, Eye, Trash } from "react-feather";
import { IconButton } from "../../components/buttons/IconButton";
import clientPromise from "../../lib/mongodb";
import { Text } from "../../types/Texts";
import { IncomingMessage } from "http";

export default function Texts({ texts }: { texts: Text[] }) {
  return (
    <Container css={{ marginTop: "$18" }}>
      <Table>
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Last opened</Table.Column>
          <Table.Column> </Table.Column>
        </Table.Header>
        <Table.Body>
          {texts.map((text) => {
            return (
              <Table.Row key={text._id}>
                <Table.Cell>{text.name}</Table.Cell>
                <Table.Cell>{text.updatedAt}</Table.Cell>

                <Table.Cell>
                  <Row justify="center" align="center">
                    <Col css={{ d: "flex" }}>
                      <Tooltip content="Open text">
                        <Link href={`/texts/${text._id}`}>
                          <IconButton>
                            <Eye />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </Col>
                    <Col css={{ d: "flex" }}>
                      <Tooltip content="Rename text">
                        <IconButton>
                          <Edit2 />
                        </IconButton>
                      </Tooltip>
                    </Col>
                    <Col css={{ d: "flex" }}>
                      <Tooltip content="Delete text">
                        <IconButton>
                          <Trash color={red.red600} />
                        </IconButton>
                      </Tooltip>
                    </Col>
                  </Row>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
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
