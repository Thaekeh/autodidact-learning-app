import {
  Button,
  Input,
  Modal,
  useInput,
  Text,
  Loading,
} from "@nextui-org/react";
import React, { useState } from "react";

interface NameModalProps {
  title: string;
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const NameModal: React.FC<NameModalProps> = ({
  title,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const { value, bindings } = useInput("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm(value);
  };

  return (
    <Modal closeButton open={isOpen} onClose={onCancel}>
      <Modal.Header>
        <Text size={20} weight={"bold"}>
          {title}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          value={value}
          label="Name"
          onChange={bindings.onChange}
          placeholder="Name"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button flat auto onPress={() => handleConfirm()}>
          {loading ? (
            <Loading color="secondary" type="points-opacity" />
          ) : (
            "Create"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
