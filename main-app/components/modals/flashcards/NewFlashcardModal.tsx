import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";

interface NameModalProps {
  isOpen: boolean;
  onConfirm: ({
    frontText,
    backText,
  }: {
    frontText: string;
    backText: string;
  }) => void;
  onCancel: () => void;
}

export const NewFlashcardModal: React.FC<NameModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [frontTextValue, setFrontTextValue] = useState("");
  const [backTextValue, setBackTextValue] = useState("");

  return (
    <Modal showCloseButton isOpen={isOpen} onClose={onCancel}>
      <ModalHeader>
        <p>Change your flashcard</p>
      </ModalHeader>
      <ModalBody>
        <Input
          value={frontTextValue}
          onValueChange={setFrontTextValue}
          placeholder="Front of card"
          label="Front of card"
        />

        <Input
          value={backTextValue}
          onValueChange={setBackTextValue}
          placeholder="Back of card"
          label="Back of card"
        />
      </ModalBody>
      <ModalFooter>
        <Button
          onPress={() =>
            onConfirm({ frontText: frontTextValue, backText: backTextValue })
          }
        >
          Save Flashcard
        </Button>
      </ModalFooter>
    </Modal>
  );
};
