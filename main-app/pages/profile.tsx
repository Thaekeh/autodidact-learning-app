import styled from "@emotion/styled";
import { Container, Input, theme, useInput } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";

type fieldName = "username";

export default function Profile() {
  const { data } = useSession();
  const { value: nameInputValue, bindings: nameInputBindings } = useInput(
    data?.user?.name || ""
  );

  const onInputFieldBlur = (fieldName: fieldName, fieldValue: string) => {
    // update mongo user
    // better wait till decision about supabase is made
  };

  return (
    <Container xs>
      <BackgroundDiv>
        <HeadingContainer>
          <h2>Settings</h2>
          <Input
            label="Name"
            value={nameInputValue}
            onChange={nameInputBindings.onChange}
            onBlur={() => onInputFieldBlur("username", nameInputValue)}
          ></Input>
        </HeadingContainer>
      </BackgroundDiv>
    </Container>
  );
}

const BackgroundDiv = styled.div`
  background-color: ${theme.colors.white.value};
  height: 100%;
  width: 100%;
  padding-top: ${theme.space[18].value};
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
