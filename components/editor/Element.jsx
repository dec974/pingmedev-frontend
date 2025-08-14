const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          style={{
            borderLeft: "4px solid #ddd",
            paddingLeft: "16px",
            fontStyle: "italic",
            color: "#666",
            margin: "16px 0",
          }}
        >
          {children}
        </blockquote>
      );

    case "bulleted-list":
      return (
        <ul {...attributes} style={{ paddingLeft: "20px", margin: "16px 0" }}>
          {children}
        </ul>
      );

    case "heading-one":
      return (
        <h1
          {...attributes}
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          {children}
        </h1>
      );

    case "heading-two":
      return (
        <h2
          {...attributes}
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          {children}
        </h2>
      );

    case "list-item":
      return (
        <li {...attributes} style={{ marginBottom: "4px" }}>
          {children}
        </li>
      );

    case "numbered-list":
      return (
        <ol {...attributes} style={{ paddingLeft: "20px", margin: "16px 0" }}>
          {children}
        </ol>
      );

    default:
      return (
        <p {...attributes} style={{ marginBottom: "8px" }}>
          {children}
        </p>
      );
  }
};

export default Element;
