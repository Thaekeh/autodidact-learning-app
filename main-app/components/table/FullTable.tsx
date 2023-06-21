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
import { Edit, Trash2 } from "react-feather";
import NextLink from "next/link";

interface Props {
  items: {
    id: string;
    name: string;
  }[];
  deleteCallback: (id: string) => void;
  openHrefFunction: (id: string) => string;
}

export const FullTable: React.FC<Props> = ({
  items,
  deleteCallback,
  openHrefFunction,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableColumn width={"70%"}>Name</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {items &&
          items.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div>
                    <Tooltip content="Edit">
                      <Button as={NextLink} href={openHrefFunction(item.id)}>
                        <Edit />
                      </Button>
                    </Tooltip>
                    <Spacer x={1} />
                    <Tooltip color={"danger"} content="Delete">
                      <Button onPress={() => deleteCallback(item.id)}>
                        <Trash2 color={"#FF0080"} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
