import {
  Spacer,
  Table,
  Tooltip,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { Edit, Trash2 } from "react-feather";
import { FlashcardRow, ProfileRow } from "types";
import { DateTime } from "luxon";
import {
  defaultFirstPhaseInterval,
  defaultSecondPhaseInterval,
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
  }, [supabase, user]);

  return (
    <Table>
      <TableHeader>
        <TableColumn>Front</TableColumn>
        <TableColumn>Back</TableColumn>
        <TableColumn>Next practice date</TableColumn>
        <TableColumn>Learning Phase</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
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
              <TableRow key={card.id}>
                <TableCell>{card.frontText || "Empty"}</TableCell>
                <TableCell>{card.backText || "Empty"}</TableCell>
                <TableCell>{formattedNextPracticeDate}</TableCell>
                <TableCell>{learningPhaseForCard}</TableCell>
                <TableCell>
                  <TableRow>
                    <Tooltip content="Edit">
                      <Button onPress={() => editCallback(card)}>
                        <Edit />
                      </Button>
                    </Tooltip>
                    <Spacer x={1} />
                    <Tooltip color={"danger"} content="Delete">
                      <Button onPress={() => deleteCallback(card.id)}>
                        <Trash2 color={"#FF0080"} />
                      </Button>
                    </Tooltip>
                  </TableRow>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
