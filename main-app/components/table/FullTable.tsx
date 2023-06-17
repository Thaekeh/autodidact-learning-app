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

interface Props {
  items: {
    id: string;
    name: string;
  }[];
  openCallBack: (id: string) => void;
  deleteCallback: (id: string) => void;
}

export const FullTable: React.FC<Props> = ({
  items,
  openCallBack,
  deleteCallback,
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
                      <Button onPress={() => openCallBack(item.id)}>
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
