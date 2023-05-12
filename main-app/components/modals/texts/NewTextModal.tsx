import styled from "@emotion/styled";
import {
  Button,
  Input,
  Modal,
  useInput,
  Text,
  Switch,
} from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";
import { Upload } from "react-feather";
import { getRouteForSingleText } from "utils";
import { createNewText } from "utils/supabase/texts";

interface NameModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

export const NewTextModal: React.FC<NameModalProps> = ({
  isOpen,
  onCancel,
}) => {
  const { value: textName, bindings: textNameBindings } = useInput("");
  const [isEpub, setIsEpub] = React.useState(false);
  const [epubUrl, setEpubUrl] = React.useState("");

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleNewText = async () => {
    const createdDocument = await createNewText(
      supabaseClient,
      textName,
      epubUrl
    );
    if (createdDocument) {
      const textUrl = getRouteForSingleText(createdDocument.id);
      router.push(textUrl);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    hiddenFileInput.current?.click();
  };

  const supabase = useSupabaseClient();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];

      const { data, error } = await supabase.storage
        .from("test-bucket")
        .upload(i.name, i, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/epub+zip",
        });

      console.log("results", data, error);

      data?.path && setEpubUrl(data.path);
    }
  };

  return (
    <Modal closeButton open={isOpen} onClose={onCancel}>
      <Modal.Header>
        <Text size={20} weight={"bold"}>
          Change your flashcard
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          value={textName}
          onChange={textNameBindings.onChange}
          placeholder="Text name"
          label="Text name"
        />

        <FlexDiv>
          <Text>Use epub</Text>
          <Switch checked={isEpub} onChange={() => setIsEpub(!isEpub)} />
        </FlexDiv>
        {isEpub && (
          <>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              accept="epub/*"
              style={{ display: "none" }}
            />

            <Button onClick={handleClick}>Upload Epub</Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color={"secondary"} auto onPress={handleNewText}>
          Save Text
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
`;
