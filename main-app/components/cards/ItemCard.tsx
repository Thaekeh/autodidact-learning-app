import { Card } from "@nextui-org/react";
import React from "react";

interface ItemCardProps {
  name: string;
  lastUpdated?: string;
  id?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  name,
  lastUpdated,
  id,
}) => {
  return (
    <Card isPressable onPress={() => console.log("open card")}>
      <Card.Body>
        <h4>{name}</h4>
        <p>{lastUpdated}</p>
      </Card.Body>
    </Card>
  );
};
