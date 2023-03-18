import { Button, Input, Modal, useInput, Text } from "@nextui-org/react";
import React from "react";

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
				<Button auto onPress={() => onConfirm(value)}>
					Create
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
