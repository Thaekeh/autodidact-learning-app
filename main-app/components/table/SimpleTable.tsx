import { Row, Spacer, Table, Tooltip } from "@nextui-org/react";
import { ArrowUpRight, BookOpen, Edit, Trash2 } from "react-feather";
import { IconButton } from "components/buttons/IconButton";

export enum RowType {
  flashcard = "flashcard",
  text = "text",
  list = "list",
}

interface Props {
  items: {
    id: string;
    name: string;
    type: RowType;
  }[];
  openCallBack: (id: string) => void;
  deleteCallback: (id: string) => void;
  editCallback: (id: string) => void;
}

export const SimpleTable: React.FC<Props> = ({
  items,
  openCallBack,
  deleteCallback,
  editCallback,
}) => {
  return (
    <Table aria-label="item table">
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
                    <OpenButton
                      rowType={item.type}
                      openCallback={() => openCallBack(item.id)}
                    />
                    <Spacer x={1} />
                    <Tooltip content="Edit name">
                      <IconButton onClick={() => editCallback(item.id)}>
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

function OpenButton({
  rowType,
  openCallback,
}: {
  rowType: RowType;
  openCallback: () => void;
}) {
  if (rowType === RowType.list || rowType === RowType.flashcard) {
    return (
      <Tooltip content="Open">
        <IconButton onClick={openCallback}>
          <ArrowUpRight />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip content="Read">
      <IconButton onClick={openCallback}>
        <BookOpen />
      </IconButton>
    </Tooltip>
  );
}
