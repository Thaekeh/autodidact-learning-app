import { Button, Input, Modal, useInput, Text } from "@nextui-org/react";
import React from "react";

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
	const { value: frontText, bindings: frontTextBindings } = useInput("");
	const { value: backText, bindings: backTextBindings } = useInput("");

	return (
		<Modal closeButton open={isOpen} onClose={onCancel}>
			<Modal.Header>
				<Text size={20} weight={"bold"}>
					Change your flashcard
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input
					value={frontText}
					onChange={frontTextBindings.onChange}
					placeholder="Front of card"
					label="Front of card"
				/>

				<Input
					value={backText}
					onChange={backTextBindings.onChange}
					placeholder="Back of card"
					label="Back of card"
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button auto onPress={() => onConfirm({ frontText, backText })}>
					Save Flashcard
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
