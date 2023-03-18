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
    <Modal open={isOpen} onClose={onCancel}>
      <Modal.Header>
        <Text h3>Are you sure?</Text>
      </Modal.Header>
      <Modal.Footer justify="center">
        <Button color={"secondary"} flat auto onPress={onCancel}>
          Cancel
        </Button>
        <Button color={"error"} flat auto onPress={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
