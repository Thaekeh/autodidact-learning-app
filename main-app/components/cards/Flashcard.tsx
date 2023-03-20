import styled from "@emotion/styled";
import { theme } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Props {
  text: {
    front: string;
    back: string;
  };
}

const Flashcard: React.FC<Props> = ({ text }) => {
  const [frontIsVisible, setFrontIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // to always start with front visible when changing cards
    setFrontIsVisible(true);
  }, [text]);

  return (
    <StyledDiv onClick={() => setFrontIsVisible(!frontIsVisible)}>
      {frontIsVisible ? text.front : text.back}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 30rem;
  height: 10rem;
  background-color: ${theme.colors.purple600.value};
  color: white;
  font-size: 1.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.radii.sm.value};
  :hover {
    cursor: pointer;
  }
`;

export default Flashcard;
