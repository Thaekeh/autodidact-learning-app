import styled from "@emotion/styled";
import {
  Button,
  Input,
  Modal,
  Switch,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabase } from "components/supabase-provider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createNewFlashcardList, getRouteForSingleText } from "utils";
import { createNewText } from "utils/supabase/texts";

interface NameModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const NewTextModal: React.FC<NameModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [textNameValue, setTextNameValue] = useState("");
  const [isEpub, setIsEpub] = useState(false);
  const [epubUrl, setEpubUrl] = useState("");
  const [epubName, setEpubName] = useState("");
  const [uploadingEpub, setUploadingEpub] = useState(false);
  const [addFlashcardList, setAddFlashcardList] = useState(false);
  const [creatingTextOrFlashcardList, setCreatingTextOrFlashcardList] =
    useState(false);

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const { supabase } = useSupabase();
  const router = useRouter();

  const { session } = useSupabase();
  const user = session?.user;

  const handleNewText = async () => {
    let flashcardListId: string | undefined;
    setCreatingTextOrFlashcardList(true);

    if (addFlashcardList) {
      const flashcardList = await createNewFlashcardList(
        supabase,
        textNameValue
      );
      flashcardListId = flashcardList?.id;
    }

    const createdText = await createNewText(
      supabase,
      textNameValue,
      isEpub ? epubUrl : undefined,
      flashcardListId
    );

    if (createdText) {
      const textUrl = getRouteForSingleText(createdText.id);
      router.push(textUrl);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setEpubName(file.name);

      if (!user) {
        return;
      }

      setUploadingEpub(true);

      await supabase.storage
        .from("text-files")
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/epub+zip",
        });

      setUploadingEpub(false);

      setEpubUrl(file.name);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <p>Create new text</p>
            </ModalHeader>
            <ModalBody>
              <StyledDiv>
                <Input
                  value={textNameValue}
                  onValueChange={setTextNameValue}
                  placeholder="Text name"
                  label="Text name"
                  variant="bordered"
                />

                <div>
                  <p>Epub</p>
                  <FlexDiv>
                    <p>Use epub</p>
                    <Switch
                      isSelected={isEpub}
                      onValueChange={() => setIsEpub(!isEpub)}
                    />
                  </FlexDiv>
                </div>
                {isEpub && (
                  <>
                    <Input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={handleChange}
                      accept="epub/*"
                      style={{ display: "none" }}
                    />
                    {epubName && <p>Epub: {epubName}</p>}
                    <Button
                      color={"secondary"}
                      variant="flat"
                      onPress={handleClick}
                      isLoading={uploadingEpub}
                      spinner={<Spinner size="sm" />}
                    >
                      Upload Epub
                    </Button>
                  </>
                )}
                <div>
                  <p>Flashcard</p>
                  <FlexDiv>
                    <p>Add flashcard list</p>
                    <Switch
                      isSelected={addFlashcardList}
                      onValueChange={() =>
                        setAddFlashcardList(!addFlashcardList)
                      }
                    ></Switch>
                  </FlexDiv>
                </div>
              </StyledDiv>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={creatingTextOrFlashcardList}
                color={"secondary"}
                onPress={handleNewText}
                spinner={<Spinner size="sm" />}
              >
                Create Text
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
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
