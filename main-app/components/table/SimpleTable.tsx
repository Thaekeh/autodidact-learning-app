import {
  Button,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { ArrowUpRight, BookOpen, Edit, Trash2 } from "react-feather";

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
    <Table style={{ minHeight: "150px" }} aria-label="item table">
      <TableHeader>
        <TableColumn width={"70%"}>Name</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={items}
        loadingState={!items.length ? "loading" : undefined}
      >
        {(item) => {
          return (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <div className="flex">
                  <OpenButton
                    rowType={item.type}
                    openCallback={() => openCallBack(item.id)}
                  />
                  <Spacer x={1} />
                  <Tooltip content="Edit name">
                    <Button isIconOnly onPress={() => editCallback(item.id)}>
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Spacer x={1} />
                  <Tooltip color={"danger"} content="Delete">
                    <Button isIconOnly onPress={() => deleteCallback(item.id)}>
                      <Trash2 color={"#FF0080"} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        }}
      </TableBody>
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
        <Button isIconOnly onPress={openCallback}>
          <ArrowUpRight />
        </Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip content="Read">
      <Button isIconOnly onPress={openCallback}>
        <BookOpen />
      </Button>
    </Tooltip>
  );
}
