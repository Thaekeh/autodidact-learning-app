import { Button, Modal, ModalFooter, ModalHeader } from "@nextui-org/react";
import React from "react";
import { useConfirm } from "hooks/useConfirm";

export const ConfirmModal: React.FC = () => {
  const { prompt = "", isOpen = false, proceed, cancel } = useConfirm();

  if (!proceed || !cancel) {
    return <></>;
  }
  return (
    <Modal
      aria-labelledby="Confirm modal"
      isOpen={isOpen}
      onClose={() => {
        cancel("close");
      }}
    >
      <ModalHeader>
        <h3>{prompt}</h3>
      </ModalHeader>
      <ModalFooter
      // justify="center"
      >
        <Button color={"secondary"} variant="flat" onPress={cancel}>
          Cancel
        </Button>
        <Button color={"danger"} variant="flat" onPress={proceed}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
};
