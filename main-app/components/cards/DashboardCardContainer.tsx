import { Card, styled as NextUIStyled, theme } from "@nextui-org/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const DashboardCardContainer: React.FC<Props> = ({ children }) => {
  return <PaddedCard variant="bordered">{children}</PaddedCard>;
};

const PaddedCard = NextUIStyled(Card, {
  padding: theme.space[12].value,
});
