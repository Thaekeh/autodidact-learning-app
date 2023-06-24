"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { useConfirm } from "hooks/useConfirm";

export const ConfirmModal: React.FC = () => {
  const { prompt = "", isOpen = false, proceed, cancel } = useConfirm();

  if (!proceed || !cancel) {
    return <></>;
  }

  const handleCancel = () => {
    cancel("cancel");
  };

  return (
    <Modal
      hideCloseButton
      isDismissable
      onClose={handleCancel}
      aria-labelledby="Confirm modal"
      isOpen={isOpen}
    >
      <ModalContent>
        <ModalHeader className="justify-center">
          <h3>{prompt}</h3>
        </ModalHeader>
        <ModalFooter className="justify-center">
          <Button color={"secondary"} variant="light" onPress={cancel}>
            Cancel
          </Button>
          <Button color={"danger"} variant="flat" onPress={proceed}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
