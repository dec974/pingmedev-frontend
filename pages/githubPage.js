import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GitHubCallback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("GitHub OAuth error:", error);
      router.push("/connexionPage?error=github_denied");
      return;
    }

    if (code) {
      console.log("Code GitHub reçu:", code);

      // Échanger le code contre un token d'accès
      fetch("http://localhost:3000/users/github-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from backend:", data);

          if (data.result && data.userData) {
            // Stocker les infos dans localStorage temporairement
            localStorage.setItem("githubUser", JSON.stringify(data.userData));
            // Rediriger vers la page de connexion pour traitement
            router.push("/connexionPage?github=callback");
          } else {
            // Affichage détaillé pour debug
            console.error("Erreur GitHub:", data);
            alert("Erreur GitHub: " + JSON.stringify(data));
            router.push("/connexionPage?error=github_token");
          }
        })
        .catch((error) => {
          console.error("Erreur fetch:", error);
          router.push("/connexionPage?error=github_network");
        });
    } else {
      console.error("Aucun code trouvé dans l'URL");
      router.push("/connexionPage?error=github_no_code");
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Connexion en cours...</h2>
      <p>Traitement de votre connexion GitHub...</p>
    </div>
  );
}
