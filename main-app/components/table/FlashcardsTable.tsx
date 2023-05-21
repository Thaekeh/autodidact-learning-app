import { Row, Spacer, Table, Tooltip } from "@nextui-org/react";
import { Edit, Trash2 } from "react-feather";
import { IconButton } from "components/buttons/IconButton";
import { FlashcardRow, ProfileRow } from "types";
import { DateTime } from "luxon";
import {
  defaultFirstPhaseInterval,
  defaultSecondPhaseInterval,
  FlashcardPhase,
  mapFlashcardIntervalToLearningPhase,
} from "utils/mapping/flashcards";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { getProfileByUserId } from "utils/supabase/profiles";
import { useEffect, useState } from "react";

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
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const profile = await getProfileByUserId(supabase, user.id);
      setProfile(profile);
    };
    fetchProfile();
  }, []);

  return (
    <Table>
      <Table.Header>
        <Table.Column>Front</Table.Column>
        <Table.Column>Back</Table.Column>
        <Table.Column>Next practice date</Table.Column>
        <Table.Column>Learning Phase</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {flashcards &&
          flashcards.map((card) => {
            const formattedNextPracticeDate =
              card.next_practice_date &&
              DateTime.fromISO(card.next_practice_date).toLocaleString();

            const learningPhaseForCard = mapFlashcardIntervalToLearningPhase(
              card.interval,
              profile?.first_learning_phase_interval ||
                defaultFirstPhaseInterval,
              profile?.second_learning_phase_interval ||
                defaultSecondPhaseInterval
            );

            return (
              <Table.Row key={card.id}>
                <Table.Cell>{card.frontText || "Empty"}</Table.Cell>
                <Table.Cell>{card.backText || "Empty"}</Table.Cell>
                <Table.Cell>{formattedNextPracticeDate}</Table.Cell>
                <Table.Cell>{learningPhaseForCard}</Table.Cell>
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
