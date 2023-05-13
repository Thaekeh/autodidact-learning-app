import styled from "@emotion/styled";
import {
  Button,
  Input,
  Modal,
  useInput,
  Text,
  Switch,
  Loading,
} from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { createNewFlashcardList, getRouteForSingleText } from "utils";
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
  const [isEpub, setIsEpub] = useState(false);
  const [epubUrl, setEpubUrl] = useState("");
  const [epubName, setEpubName] = useState("");
  const [uploadingEpub, setUploadingEpub] = useState(false);
  const [addFlashcardList, setAddFlashcardList] = useState(false);
  const [creatingTextOrFlashcardList, setCreatingTextOrFlashcardList] =
    useState(false);

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleNewText = async () => {
    setCreatingTextOrFlashcardList(true);
    const flashcardList = await createNewFlashcardList(
      supabaseClient,
      textName
    );
    const flashcardListId = flashcardList?.id;
    const createdText = await createNewText(
      supabaseClient,
      textName,
      isEpub ? epubUrl : undefined,
      flashcardListId
    );

    if (createdText) {
      const textUrl = getRouteForSingleText(createdText.id);
      router.push(textUrl);
      setCreatingTextOrFlashcardList(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    hiddenFileInput.current?.click();
  };

  const supabase = useSupabaseClient();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setEpubName(file.name);

      const { data, error } = await supabase.storage
        .from("test-bucket")
        .upload(file.name, file, {
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
        <StyledDiv>
          <Input
            value={textName}
            onChange={textNameBindings.onChange}
            placeholder="Text name"
            label="Text name"
          />

          <div>
            <Text>Epub</Text>
            <FlexDiv>
              <Text size={"$sm"}>Use epub</Text>
              <Switch checked={isEpub} onChange={() => setIsEpub(!isEpub)} />
            </FlexDiv>
          </div>
          {isEpub && (
            <>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                accept="epub/*"
                style={{ display: "none" }}
              />
              {epubName && <Text>Epub: {epubName}</Text>}
              <Button color={"secondary"} flat onClick={handleClick}>
                {uploadingEpub ? (
                  <Loading type="points" color={"secondary"} />
                ) : (
                  "Upload Epub"
                )}{" "}
              </Button>
            </>
          )}
          <div>
            <Text>Flashcard</Text>
            <FlexDiv>
              <Text size={"$sm"}>Add flashcard list</Text>
              <Switch
                checked={addFlashcardList}
                onChange={() => setAddFlashcardList(!addFlashcardList)}
              ></Switch>
            </FlexDiv>
          </div>
        </StyledDiv>
      </Modal.Body>
      <Modal.Footer>
        <Button color={"secondary"} auto onPress={handleNewText}>
          {creatingTextOrFlashcardList ? (
            <Loading type="points" color={"secondary"} />
          ) : (
            "Create Text"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
