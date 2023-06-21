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
  useTable,
} from "@nextui-org/react";
import { ArrowUpRight, BookOpen, Edit, Trash2 } from "react-feather";
import NextLink from "next/link";

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
  deleteCallback: (id: string) => void;
  editCallback: (id: string) => void;
  openHrefFunction: (id: string) => string;
}

export const SimpleTable: React.FC<Props> = ({
  items,
  openHrefFunction,
  deleteCallback,
  editCallback,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "70%",
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];

  return (
    <Table style={{ minHeight: "150px" }} aria-label="item table">
      <TableHeader columns={columns}>
        {(column) => {
          const { dataIndex, title } = column;
          return <TableColumn key={dataIndex}>{title}</TableColumn>;
        }}
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
                    href={openHrefFunction(item.id)}
                  />
                  <Spacer x={1} />
                  <Tooltip content="Edit name">
                    <Button
                      radius="full"
                      variant="light"
                      isIconOnly
                      onPress={() => editCallback(item.id)}
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Spacer x={1} />
                  <Tooltip color={"danger"} content="Delete">
                    <Button
                      radius="full"
                      variant="light"
                      isIconOnly
                      onPress={() => deleteCallback(item.id)}
                    >
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

function OpenButton({ rowType, href }: { rowType: RowType; href: string }) {
  if (rowType === RowType.list || rowType === RowType.flashcard) {
    return (
      <Tooltip content="Open">
        <Button
          as={NextLink}
          href={href}
          radius="full"
          variant="light"
          isIconOnly
        >
          <ArrowUpRight />
        </Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip content="Read">
      <Button
        radius="full"
        variant="light"
        isIconOnly
        as={NextLink}
        href={href}
      >
        <BookOpen />
      </Button>
    </Tooltip>
  );
}
