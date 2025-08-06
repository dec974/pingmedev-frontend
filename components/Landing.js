import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";

export default function Home() {
  const router = useRouter();

  const handleConnexionClick = () => {
    router.push("/connexionPage");
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingTop: "10vh",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 50px)",
              //clamp permet d avoir une taille responsive

              fontWeight: "bold",
              color: "var(--primary-color)",
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: "30px",
              maxWidth: "60%",
              lineHeight: "1.4",
              textAlign: "left",
              //clamp permet d avoir une taille responsive

              marginBottom: "20px",
              maxWidth: "600px",
              lineHeight: "1.4",
            }}
          >
            *Vous devrez vous connecter pour échanger avec les autres
            utilisateurs.
          </h1>
        </div>

        <div>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              objectFit: "contain",
              //objectfit contain permet de garder toute l imag ea l ecran

              width: "clamp(200px, 25vw, 400px)",
              //clamp permet d avoir une taille responsive
              height: "auto",
              zIndex: 2,
            }}
          />
          <img
            src="/landingImage.png"
            alt="Landing Image"
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              objectFit: "contain",
              //objectfit contain permet de garder toute l imag ea l ecran
              width: "clamp(600px, 80vw, 60%)",
              //clamp permet d avoir une taille responsive

              height: "auto",
            }}
          />
        </div>
      </div>
    </>
  );
}
