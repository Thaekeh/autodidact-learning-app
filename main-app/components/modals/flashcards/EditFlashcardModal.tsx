import { Button, Input, Modal, useInput, Text } from "@nextui-org/react";
import React from "react";

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
	const { value: frontText, bindings: frontTextBindings } = useInput(
		initialContent?.frontText
	);
	const { value: backText, bindings: backTextBindings } = useInput(
		initialContent?.backText
	);

	return (
		<Modal closeButton open={isOpen} onClose={onCancel}>
			<Modal.Header>
				<Text size={20} weight={"bold"}>
					Update the flashcard
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input
					value={frontText}
					onChange={frontTextBindings.onChange}
					placeholder={"Front of card"}
					label="Front of card"
				/>
				<Input
					value={backText}
					onChange={backTextBindings.onChange}
					placeholder={backText || "Back of card"}
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
