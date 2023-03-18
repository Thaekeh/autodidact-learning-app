import { Button, Input, Modal, useInput, Text } from "@nextui-org/react";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal closeButton open={isOpen} onClose={onCancel}>
      <Modal.Header>
        <Text size={20} weight={"bold"}>
          Are you sure?
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Button auto onPress={onCancel}>
          Cancel
        </Button>
        <Button auto onPress={onConfirm}>
          Yes
        </Button>
      </Modal.Body>
    </Modal>
  );
};
