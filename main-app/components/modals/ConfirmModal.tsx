import { Button, Input, Modal, useInput, Text } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useConfirm } from "hooks/useConfirm";

export const ConfirmModal: React.FC = () => {
  const { prompt = "", isOpen = false, proceed, cancel } = useConfirm();

  if (!proceed || !cancel) {
    return <></>;
  }
  return (
    <Modal
      aria-labelledby="Confirm modal"
      open={isOpen}
      onClose={() => {
        cancel("close");
      }}
    >
      <Modal.Header>
        <Text h3>{prompt}</Text>
      </Modal.Header>
      <Modal.Footer justify="center">
        <Button color={"secondary"} flat auto onPress={cancel}>
          Cancel
        </Button>
        <Button color={"error"} flat auto onPress={proceed}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
