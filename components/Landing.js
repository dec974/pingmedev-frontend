export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "300px",
          top: "50%",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
            maxWidth: "400px",
            lineHeight: "1.4",
          }}
        >
          La plateforme des développeurs ouverte à tous les parcours.
        </h1>
        <button
          style={{
            padding: "15px 30px",
          }}
        >
          Visiter
        </button>
        <text
          style={{
            fontSize: "24px",
            color: "#333",
            marginBottom: "20px",
            maxWidth: "400px",
            lineHeight: "1.4",
          }}
        >
          *Vous devrez vous connecter pour échanger avec les autres
          utilisateurs.
        </text>
      </div>

      <div>
        <img
          src="/landingImage.png"
          alt="Landing Image"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "50px",
            objectFit: "contain",
            width: "50%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
