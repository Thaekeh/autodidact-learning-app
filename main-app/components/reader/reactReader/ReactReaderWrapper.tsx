import styled from "@emotion/styled";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSupabase } from "components/providers/supabase-provider";
import { Rendition } from "epubjs";
import React, { useEffect, useRef, useState } from "react";
import { ReactReader } from "react-reader";
import { snapSelectionToWord } from "./selectWholeWord";

export const ReactReaderWrapper = ({
  processTextSelection,
  lastLocation,
  setLastLocation,
  url,
}: {
  processTextSelection: (selectedText: string) => void;
  lastLocation: string | null;
  setLastLocation: (epubcifi: string) => void;
  url: string;
}) => {
  const renditionRef = useRef<Rendition | null>(null);

  const supabase = createClientComponentClient();
  const user = useSupabase().session?.user;

  const [selections, setSelections] = useState<string>();

  function setRenderSelection(cfiRange: string) {
    setSelections(renditionRef.current?.getRange(cfiRange).toString());
  }

  function handleTextSelection() {
    const iframe = document.getElementsByTagName("iframe")[0];

    snapSelectionToWord(iframe);

    const iframeSelection = iframe.contentWindow?.getSelection()?.toString();
    if (!iframeSelection || !iframeSelection.length) return;
    const regex = new RegExp(/\s$|,|\./);
    const trimmedSelection = iframeSelection.replace(regex, "");
    processTextSelection(trimmedSelection);
  }

  useEffect(() => {
    if (!renditionRef.current) {
      console.log("no renditionRef");
      return;
    }

    renditionRef.current.on("selected", setRenderSelection);
    renditionRef.current.on("mouseup", handleTextSelection);

    return () => {
      renditionRef.current?.off("selected", setRenderSelection);
      renditionRef.current?.off("mouseup", handleTextSelection);
    };
  }, [renditionRef, setSelections, selections]);

  if (!url || !user?.id) {
    console.log("no url or user", url, user?.id);
    return null;
  }
  const fileUrl = supabase.storage
    .from("text-files")
    .getPublicUrl(`${user?.id}/${url}`).data.publicUrl;

  console.log("fileUrl", fileUrl);

  return (
    <div className="w-full h-full">
      {fileUrl && (
        <ReactReader
          showToc={false}
          url={fileUrl}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            setSelections("");
            console.log("rendition", rendition);
          }}
          location={lastLocation || undefined}
          locationChanged={(epubcifi) => {
            setLastLocation(epubcifi.toString());
          }}
        />
      )}
    </div>
  );
};

const ReactReaderContainer = styled.div`
  width: 100%;
  height: 100%;
`;
