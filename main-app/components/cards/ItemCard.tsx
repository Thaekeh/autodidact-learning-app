import { Card } from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";
import { getRouteForSingleText } from "../../util/routing/texts";

interface ItemCardProps {
  name: string;
  href: string;
  lastUpdated?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  name,
  lastUpdated,
  href,
}) => {
  const router = useRouter();
  return (
    <Card isPressable onPress={() => router.push(href)}>
      <Card.Body>
        <h4>{name}</h4>
        <p>{lastUpdated}</p>
      </Card.Body>
    </Card>
  );
};
