import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GitHubCallback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Échanger le code contre un token d'accès
      fetch("http://localhost:3000/users/github-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            // Stocker les infos dans localStorage temporairement
            localStorage.setItem("githubUser", JSON.stringify(data));
            // Rediriger vers la page de connexion pour traitement
            router.push("/connexionPage?github=callback");
          } else {
            console.error("Erreur GitHub:", data.error);
            router.push("/connexionPage?error=github");
          }
        })
        .catch((error) => {
          console.error("Erreur:", error);
          router.push("/connexionPage?error=github");
        });
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Connexion en cours...</h2>
      <p>Traitement de votre connexion GitHub...</p>
    </div>
  );
}
