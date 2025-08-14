import { useState } from "react";
import RichTextEditor from "../components/editor/RichTextEditor";
import { initialValue } from "../utils/slateHelpers";

export default function EditorPage() {
  const [content, setContent] = useState(initialValue);

  const handleContentChange = (value) => {
    setContent(value);
    // Ici vous pouvez sauvegarder le contenu
    console.log("Contenu mis à jour:", JSON.stringify(value));
  };

  const saveContent = () => {
    // Exemple de sauvegarde
    const contentString = JSON.stringify(content);
    localStorage.setItem("editorContent", contentString);
    alert("Contenu sauvegardé!");
  };

  const loadContent = () => {
    // Exemple de chargement
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
      alert("Contenu chargé!");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Éditeur de texte riche</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={saveContent}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sauvegarder
        </button>

        <button
          onClick={loadContent}
          style={{
            padding: "10px 20px",
            backgroundColor: "#666",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Charger
        </button>
      </div>

      <RichTextEditor
        value={content}
        onChange={handleContentChange}
        placeholder="Commencez à taper votre texte..."
        style={{ minHeight: "400px" }}
      />

      {/* Aperçu du contenu JSON (pour debug) */}
      <details style={{ marginTop: "20px" }}>
        <summary>Aperçu du contenu (JSON)</summary>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(content, null, 2)}
        </pre>
      </details>
    </div>
  );
}
