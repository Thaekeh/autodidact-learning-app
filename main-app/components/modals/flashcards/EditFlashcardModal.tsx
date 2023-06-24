import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";

interface EditFlashcardModalProps {
  isOpen: boolean;
  initialContent: {
    frontText: string;
    backText: string;
  };
  onConfirm: ({
    frontText,
    backText,
  }: {
    frontText: string;
    backText: string;
  }) => void;
  onCancel: () => void;
}

export const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({
  isOpen,
  initialContent,
  onConfirm,
  onCancel,
}) => {
  const [frontTextValue, setFrontTextValue] = useState(
    initialContent?.frontText
  );
  const [backTextValue, setBackTextValue] = useState(initialContent?.backText);

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalHeader>
        <p>Update the flashcard</p>
      </ModalHeader>
      <ModalBody>
        <Input
          value={frontTextValue}
          onValueChange={setFrontTextValue}
          placeholder={"Front of card"}
          label="Front of card"
        />
        <Input
          value={backTextValue}
          onValueChange={setBackTextValue}
          placeholder={"Back of card"}
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
