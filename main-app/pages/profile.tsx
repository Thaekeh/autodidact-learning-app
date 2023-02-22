import styled from "@emotion/styled";
import {
  Card,
  Container,
  Input,
  theme,
  useInput,
  styled as NextUIStyled,
} from "@nextui-org/react";
import { useUser } from "@supabase/auth-helpers-react";
import { NextApiRequest, NextApiResponse } from "next";
import React, { useState } from "react";

type fieldName = "username";

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = useUser()
  
}

export default function Profile() {
  const { value: nameInputValue, bindings: nameInputBindings } = useInput("");

  const onInputFieldBlur = (fieldName: fieldName, fieldValue: string) => {
    // update mongo user
    // better wait till decision about supabase is made
  };

  return (
    <Container xs>
      <BackgroundDiv>
        <HeadingContainer>
          <PaddedCard variant="bordered">
            <h3>Settings</h3>
            <Input
              shadow={false}
              label="Name"
              value={nameInputValue}
              onChange={nameInputBindings.onChange}
              onBlur={() => onInputFieldBlur("username", nameInputValue)}
            ></Input>
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
