import React, { useCallback, useState, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { SlateHelpers, initialValue } from "../../utils/slateHelpers";
import Toolbar from "./Toolbar";
import Element from "./Element";
import Leaf from "./Leaf";
import styles from "../../styles/editor.module.css";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Tapez votre texte ici...",
  style = {},
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const getValidValue = (inputValue) => {
    if (!inputValue || !Array.isArray(inputValue) || inputValue.length === 0) {
      return initialValue;
    }

    const isValid = inputValue.every(
      (node) =>
        node &&
        typeof node === "object" &&
        typeof node.type === "string" &&
        Array.isArray(node.children)
    );

    return isValid ? inputValue : initialValue;
  };

  const [editorValue, setEditorValue] = useState(() => getValidValue(value));

  const handleChange = useCallback(
    (newValue) => {
      setEditorValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      switch (event.key) {
        case "b": {
          event.preventDefault();
          SlateHelpers.toggleMark(editor, "bold");
          break;
        }

        case "i": {
          event.preventDefault();
          SlateHelpers.toggleMark(editor, "italic");
          break;
        }

        case "u": {
          event.preventDefault();
          SlateHelpers.toggleMark(editor, "underline");
          break;
        }

        case "`": {
          event.preventDefault();
          SlateHelpers.toggleMark(editor, "code");
          break;
        }

        default:
          break;
      }
    },
    [editor]
  );

  return (
    <div className={styles.editorContainer} style={style}>
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <Toolbar />

        <Editable
          className={styles.editorContent}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          spellCheck
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
