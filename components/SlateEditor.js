import React, { useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Editor, Transforms, Element, createEditor } from "slate";

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];
const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "`": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              Transforms.setNodes(
                editor,
                { type: match ? null : "code" },
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                }
              );
              break;
            }

            case "b": {
              event.preventDefault();
              Editor.addMark(editor, "bold", true);
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export default SlateEditor;
