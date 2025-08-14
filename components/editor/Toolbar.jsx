import { useSlate } from "slate-react";
import { SlateHelpers } from "../../utils/slateHelpers";
import Button from "../ui/Button";

const MarkButton = ({ format, children }) => {
  const editor = useSlate();
  const isActive = SlateHelpers.isMarkActive(editor, format);

  return (
    <Button
      active={isActive}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateHelpers.toggleMark(editor, format);
      }}
    >
      {children}
    </Button>
  );
};

const BlockButton = ({ format, children }) => {
  const editor = useSlate();
  const isActive = SlateHelpers.isBlockActive(editor, format);

  return (
    <Button
      active={isActive}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateHelpers.toggleBlock(editor, format);
      }}
    >
      {children}
    </Button>
  );
};

const Toolbar = () => {
  return (
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
      }}
    >
      {/* Boutons de formatage de texte */}
      <MarkButton format="bold">
        <strong>B</strong>
      </MarkButton>

      <MarkButton format="italic">
        <em>I</em>
      </MarkButton>

      <MarkButton format="underline">
        <u>U</u>
      </MarkButton>

      <MarkButton format="code">{"</>"}</MarkButton>

      {/* Séparateur */}
      <div
        style={{
          width: "1px",
          height: "30px",
          backgroundColor: "#ccc",
          margin: "0 8px",
        }}
      />

      {/* Boutons de bloc */}
      <BlockButton format="heading-one">H1</BlockButton>

      <BlockButton format="heading-two">H2</BlockButton>

      <BlockButton format="block-quote">"</BlockButton>

      <BlockButton format="numbered-list">1.</BlockButton>

      <BlockButton format="bulleted-list">•</BlockButton>
    </div>
  );
};

export default Toolbar;
