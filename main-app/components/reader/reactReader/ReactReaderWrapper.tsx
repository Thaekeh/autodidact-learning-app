import styled from "@emotion/styled";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Rendition } from "epubjs";
import React, { useEffect, useRef, useState } from "react";
import { ReactReader } from "react-reader";

export const ReactReaderWrapper = ({
  processTextSelection,
  url,
}: {
  processTextSelection: (selectedText: string) => void;
  url: string;
}) => {
  const renditionRef = useRef<Rendition | null>(null);

  const supabase = useSupabaseClient();

  const [previousSelections, setPreviousSelections] = useState<string>();
  const [selections, setSelections] = useState<string>();

  function setRenderSelection(cfiRange: string) {
    setSelections(renditionRef.current?.getRange(cfiRange).toString());
  }

  function handleTextSelection() {
    const selectedText = selections;
    if (selectedText == previousSelections) {
      return;
    }
    if (selectedText === "" || typeof selectedText !== "string") return;
    setPreviousSelections(selectedText);
    processTextSelection(selectedText);
  }

  useEffect(() => {
    if (!renditionRef.current) return;

    renditionRef.current.on("selected", setRenderSelection);
    renditionRef.current.on("mouseup", handleTextSelection);

    return () => {
      renditionRef.current?.off("selected", setRenderSelection);
      renditionRef.current?.off("mouseup", handleTextSelection);
    };
  }, [setSelections, selections]);

  const fileUrl = supabase.storage.from("test-bucket").getPublicUrl(url)
    .data.publicUrl;

  return (
    <ReactReaderContainer>
      <ReactReader
        url={fileUrl}
        getRendition={(rendition) => {
          renditionRef.current = rendition;
          setSelections("");
        }}
      />
    </ReactReaderContainer>
  );
};

const ReactReaderContainer = styled.div`
  width: 100%;
  height: 100%;
`;
