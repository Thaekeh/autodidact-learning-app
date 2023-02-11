import styled from "@emotion/styled";
import { Container, Text, theme } from "@nextui-org/react";
import React from "react";

export default function Profile() {
  return (
    <Container xs>
      <BackgroundDiv>
        <Text>Text</Text>
      </BackgroundDiv>
    </Container>
  );
}

const BackgroundDiv = styled.div`
  background-color: ${theme.colors.white.value};
  height: 100%;
  width: 100%;
`;
