import { Editor, Element as SlateElement, Transforms } from "slate";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const CODE_BLOCK_TYPE = "code-block";

export const SlateHelpers = {
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
      })
    );

    return !!match;
  },

  toggleMark(editor, format) {
    const isActive = SlateHelpers.isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const isActive = SlateHelpers.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    let newProperties;
    if (isActive) {
      newProperties = {
        type: "paragraph",
      };
    } else if (isList) {
      newProperties = {
        type: "list-item",
      };
    } else {
      newProperties = {
        type: format,
      };
    }

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },
};

export const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Écrivez votre code ici ..." }],
  },
];
console.log("initialValue exported:", initialValue);

export const serializeToHtml = (nodes) => {
  return nodes.map((n) => serialize(n)).join("");
};

const serialize = (node) => {
  if (node.text !== undefined) {
    let string = node.text;

    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }

    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "block-quote":
      return `<blockquote>${children}</blockquote>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    default:
      return children;
  }
};
