import { Row, Spacer, Table, theme, Tooltip } from "@nextui-org/react";
import { Check, Edit, Trash2 } from "react-feather";
import { IconButton } from "components/buttons/IconButton";
import { FlashcardRow } from "types";
import { DateTime } from "luxon";

interface Props {
  flashcards: FlashcardRow[];
  editCallback: (flashcard: FlashcardRow) => void;
  deleteCallback: (id: string) => void;
}

export const FlashcardsTable: React.FC<Props> = ({
  flashcards,
  editCallback,
  deleteCallback,
}) => {
  return (
    <Table>
      <Table.Header>
        <Table.Column>Front</Table.Column>
        <Table.Column>Back</Table.Column>
        <Table.Column>Next practice date</Table.Column>
        <Table.Column>Learned</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {flashcards &&
          flashcards.map((card) => {
            const formattedNextPracticeDate =
              card.next_practice_date &&
              DateTime.fromISO(card.next_practice_date).toLocaleString();

            const isLearnedIcon = card.interval > 21 && (
              <Check color={theme.colors.green700.value} />
            );

            return (
              <Table.Row key={card.id}>
                <Table.Cell>{card.frontText || "Empty"}</Table.Cell>
                <Table.Cell>{card.backText || "Empty"}</Table.Cell>
                <Table.Cell>{formattedNextPracticeDate}</Table.Cell>
                <Table.Cell>{isLearnedIcon}</Table.Cell>
                <Table.Cell>
                  <Row>
                    <Tooltip content="Edit">
                      <IconButton onClick={() => editCallback(card)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Spacer x={1} />
                    <Tooltip color={"error"} content="Delete">
                      <IconButton onClick={() => deleteCallback(card.id)}>
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
