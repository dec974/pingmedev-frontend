import { useSlate } from "slate-react";
import { SlateHelpers } from "../../utils/slateHelpers";
import styles from "../../styles/editor.module.css";

const MarkButton = ({ format, children }) => {
  const editor = useSlate();
  const isActive = SlateHelpers.isMarkActive(editor, format);

  return (
    <button
      className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateHelpers.toggleMark(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const BlockButton = ({ format, children }) => {
  const editor = useSlate();
  const isActive = SlateHelpers.isBlockActive(editor, format);

  return (
    <button
      className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateHelpers.toggleBlock(editor, format);
      }}
    >
      {children}
    </button>
  );
};

const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
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

      <div
        style={{
          width: "1px",
          height: "30px",
          backgroundColor: "#ccc",
          margin: "0 8px",
        }}
      />

      <BlockButton format="heading-one">H1</BlockButton>

      <BlockButton format="heading-two">H2</BlockButton>

      <BlockButton format="block-quote">"</BlockButton>

      <BlockButton format="numbered-list">1.</BlockButton>

      <BlockButton format="bulleted-list">•</BlockButton>
    </div>
  );
};

export default Toolbar;
