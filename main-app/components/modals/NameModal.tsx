import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import React, { useState } from "react";

interface NameModalProps {
  title: string;
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onOpenChange: () => void;
  initalName?: string;
}

export const NameModal: React.FC<NameModalProps> = ({
  title,
  initalName,
  isOpen,
  onConfirm,
  onOpenChange,
}) => {
  const [inputValue, setInputValue] = useState(initalName || "");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm(inputValue);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <p>{title}</p>
        </ModalHeader>
        <ModalBody>
          <Input
            value={inputValue}
            label="Name"
            onValueChange={setInputValue}
            placeholder="Name"
          />
        </ModalBody>
        <ModalFooter>
          <Button isLoading={loading} variant="flat" onPress={handleConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
