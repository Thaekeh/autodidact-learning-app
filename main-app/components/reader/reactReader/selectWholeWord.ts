export function snapSelectionToWord(iframe: HTMLIFrameElement) {
  var sel;
  const window = iframe.contentWindow;
  const document = iframe.contentWindow?.document;

  if (!window || !document) return;

  if (window.getSelection) {
    sel = window.getSelection();
    if (!sel || !sel.anchorNode || !sel.focusNode) return;
    if (!sel?.isCollapsed) {
      // Detect if selection is backwards
      var range = document.createRange();

      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);
      var backwards = range.collapsed;

      var direction = [];

      if (backwards) {
        direction = ["backward", "forward"];
      } else {
        direction = ["forward", "backward"];
      }

      const text = sel.toString();

      const lengthOfTrailingSpaces =
        sel.toString().length - sel.toString().trimEnd().length;

      const lengthOfStartingSpaces =
        sel.toString().length - sel.toString().trimStart().length;

      if (lengthOfTrailingSpaces > 0) {
        const newRange = new Range();
        newRange.setStart(range.startContainer, range.startOffset);
        newRange.setEnd(
          range.endContainer,
          range.endOffset - lengthOfTrailingSpaces
        );
        sel.removeAllRanges();
        sel.addRange(newRange);

        sel.modify("move", direction[1], "word");
        sel.modify("extend", direction[0], "word");
      } else if (lengthOfStartingSpaces > 0) {
        const newRange = new Range();
        newRange.setStart(
          range.startContainer,
          range.startOffset + lengthOfStartingSpaces
        );
        newRange.setEnd(range.endContainer, range.endOffset);
        sel.removeAllRanges();
        sel.addRange(newRange);
        sel.modify("move", direction[0], "word");
        sel.modify("extend", direction[1], "word");
      } else {
        const wordCount = sel.toString().split(" ").length;
        for (let i = 0; i < wordCount; i++) {
          sel.modify("move", direction[1], "word");
        }
        for (let i = 0; i < wordCount; i++) {
          sel.modify("extend", direction[0], "word");
        }
      }

      console.log(sel.toString());
    }
  }
}
