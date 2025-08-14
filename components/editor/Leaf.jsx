const Leaf = ({ attributes, children, leaf }) => {
  // Support pour les tokens PrismJS - chercher les propriétés qui commencent par 'prism-'
  const prismTokens = Object.keys(leaf).filter((key) =>
    key.startsWith("prism-")
  );
  console.log("Leaf props:", leaf, "Prism tokens found:", prismTokens);

  if (prismTokens.length > 0) {
    const tokenType = prismTokens[0].replace("prism-", "");
    console.log("Applying token class:", `token ${tokenType}`);
    children = <span className={`token ${tokenType}`}>{children}</span>;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code
        style={{
          backgroundColor: "#f4f4f4",
          padding: "2px 4px",
          borderRadius: "3px",
          fontSize: "0.9em",
          fontFamily: "monospace",
        }}
      >
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
