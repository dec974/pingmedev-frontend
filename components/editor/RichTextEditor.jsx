import React, { useCallback, useState, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Node, Element as SlateElement, Editor } from "slate";
import { withHistory } from "slate-history";
import { SlateHelpers, initialValue } from "../../utils/slateHelpers";
import Toolbar from "./Toolbar";
import Element from "./Element";
import Leaf from "./Leaf";
import styles from "../../styles/editor.module.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

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

  // Fonction de décoration pour PrismJS
  const decorate = useCallback(([node, path]) => {
    const ranges = [];

    console.log("Decorate called for node:", node, "path:", path);

    // Vérifier si c'est un nœud de texte
    if (node.text !== undefined) {
      // Parcourir l'arbre pour trouver le parent code-block
      try {
        const ancestors = [];
        let current = path;
        while (current.length > 0) {
          current = current.slice(0, -1);
          const [parentNode] = Editor.node(editor, current);
          ancestors.push(parentNode);
        }

        const codeBlockParent = ancestors.find(
          (ancestor) =>
            SlateElement.isElement(ancestor) && ancestor.type === "code-block"
        );

        if (codeBlockParent) {
          console.log("Found code block parent, decorating text:", node.text);
          const text = node.text;
          const language = codeBlockParent.language || "javascript";
          const grammar =
            Prism.languages[language] || Prism.languages.javascript;
          const tokens = Prism.tokenize(text, grammar);
          console.log("Prism tokens for text:", tokens);

          let start = 0;
          for (const token of tokens) {
            const length =
              typeof token === "string" ? token.length : token.content.length;
            const end = start + length;

            if (typeof token !== "string" && token.type) {
              const range = {
                anchor: { path, offset: start },
                focus: { path, offset: end },
                [`prism-${token.type}`]: true,
              };
              ranges.push(range);
              console.log("Adding text range:", range);
            }
            start = end;
          }
        }
      } catch (error) {
        console.log("Error finding parent:", error);
      }
    }

    console.log("Final ranges for node:", ranges);
    return ranges;
  }, []);

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
          decorate={decorate}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          spellCheck
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
