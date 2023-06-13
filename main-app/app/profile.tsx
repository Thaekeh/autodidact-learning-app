import styled from "@emotion/styled";
import {
  Card,
  Container,
  theme,
  styled as NextUIStyled,
  Divider,
  Text,
  Spacer,
} from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GenericInput } from "components/inputs/GenericInput";
import { NextApiRequest, NextApiResponse } from "next";
import React, { useEffect } from "react";
import { Database, ProfileRow } from "types";

type FieldName = keyof ProfileRow;

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const supabase = await createServerSupabaseClient<Database>({ req, res });
  const { data: profile } = await supabase.from("profiles").select().single();
  return { props: { profile } };
}

export default function Profile({ profile }: { profile: ProfileRow }) {
  const user = useUser();
  const supabase = useSupabaseClient();

  const onInputFieldBlur = async (fieldName: FieldName, fieldValue: string) => {
    await supabase
      .from("profiles")
      .update({ ...profile, [fieldName]: fieldValue })
      .eq("user_id", user?.id);
  };

  return (
    <Container xs>
      <BackgroundDiv>
        <HeadingContainer>
          <PaddedCard variant="bordered">
            <Container display="flex" direction="column" css={{ rowGap: "$8" }}>
              <Text h2>Settings</Text>
              <Text h4>Profile</Text>
              <GenericInput
                label="Name"
                initialValue={profile.name}
                onInputFieldBlur={(value) => onInputFieldBlur("name", value)}
              />

              <Divider />
              <Text h4>Flashcards</Text>
              <GenericInput
                label="First learning phase interval"
                initialValue={
                  profile.first_learning_phase_interval?.toString() || ""
                }
                onInputFieldBlur={(value) =>
                  onInputFieldBlur("first_learning_phase_interval", value)
                }
              />
              <GenericInput
                label="Second learning phase interval"
                initialValue={
                  profile.second_learning_phase_interval?.toString() || ""
                }
                onInputFieldBlur={(value) =>
                  onInputFieldBlur("second_learning_phase_interval", value)
                }
              />
            </Container>
          </PaddedCard>
        </HeadingContainer>
      </BackgroundDiv>
    </Container>
  );
}

const BackgroundDiv = styled.div`
  background-color: ${theme.colors.white.value};
  height: 100%;
  width: 100%;
  margin-top: ${theme.space[12].value};
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const PaddedCard = NextUIStyled(Card, {
  padding: theme.space[12].value,
});
