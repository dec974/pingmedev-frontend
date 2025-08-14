import React, { useCallback, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { SlateHelpers } from "../../utils/slateHelpers";
import { useSlateEditor } from "./hooks/useSlateEditor";
import Toolbar from "./Toolbar";
import Element from "./Element";
import Leaf from "./Leaf";

// Définir une valeur par défaut locale pour éviter les problèmes d'import
const DEFAULT_INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [
      { text: "Voici un exemple d'éditeur de texte riche construit avec " },
      { text: "Slate", bold: true },
      { text: " et " },
      { text: "Next.js", bold: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Vous pouvez utiliser les raccourcis clavier habituels comme ",
      },
      { text: "Ctrl+B", code: true },
      { text: " pour le gras, " },
      { text: "Ctrl+I", code: true },
      { text: " pour l'italique, etc." },
    ],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Tapez votre texte ici...",
  style = {},
}) => {
  const editor = useSlateEditor();

  // Fonction pour valider et nettoyer la valeur
  const getValidValue = (inputValue) => {
    if (!inputValue || !Array.isArray(inputValue) || inputValue.length === 0) {
      return initialValue || DEFAULT_INITIAL_VALUE; // Fallback sur fallback
    }

    // Vérifier que chaque élément a la structure correcte
    const isValid = inputValue.every(
      (node) =>
        node &&
        typeof node === "object" &&
        typeof node.type === "string" &&
        Array.isArray(node.children)
    );

    return isValid ? inputValue : DEFAULT_INITIAL_VALUE;
  };

  // Initialiser avec une valeur valide
  const [editorValue, setEditorValue] = useState(() => getValidValue(value));

  // Gérer les changements de valeur
  const handleChange = useCallback(
    (newValue) => {
      setEditorValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Rendu des éléments
  const renderElement = useCallback((props) => <Element {...props} />, []);

  // Rendu des feuilles (leaf nodes)
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Gérer les raccourcis clavier
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
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        ...style,
      }}
    >
      <Slate editor={editor} value={editorValue} onChange={handleChange}>
        <Toolbar />

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          style={{
            padding: "16px",
            minHeight: "200px",
            outline: "none",
            lineHeight: "1.6",
            fontSize: "16px",
          }}
          spellCheck
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
