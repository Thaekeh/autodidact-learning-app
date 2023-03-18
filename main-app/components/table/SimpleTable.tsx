import { Row, Spacer, Table, Tooltip } from "@nextui-org/react";
import { Edit, Trash2 } from "react-feather";
import { IconButton } from "../buttons/IconButton";

interface Props {
  items: {
    id: string;
    name: string;
  }[];
  openCallBack: (id: string) => void;
  deleteCallback: (id: string) => void;
}

export const SimpleTable: React.FC<Props> = ({
  items,
  openCallBack,
  deleteCallback,
}) => {
  return (
    <Table>
      <Table.Header>
        <Table.Column width={"70%"}>Name</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {items &&
          items.map((item) => {
            return (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <Row>
                    <Tooltip content="Edit">
                      <IconButton onClick={() => openCallBack(item.id)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Spacer x={1} />
                    <Tooltip color={"error"} content="Delete">
                      <IconButton onClick={() => deleteCallback(item.id)}>
                        <Trash2 color={"#FF0080"} />
                      </IconButton>
                    </Tooltip>
                  </Row>
                </Table.Cell>
              </Table.Row>
            );
          })}
      </Table.Body>
    </Table>
  );
};
