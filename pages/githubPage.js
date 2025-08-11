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
          if (data.result && data.userData) {
            console.log(
              "GitHub callback datade github page fetch if code:",
              data
            );
            // Stocker les infos dans localStorage temporairement
            localStorage.setItem("githubUser", JSON.stringify(data.userData));
            // Rediriger vers la page de connexion pour traitement
            router.push("/profilPage");
          } else {
            // Affichage détaillé pour debug
            console.error("Erreur GitHub:", data);
          }
        });
    } else {
      console.error("Aucun code trouvé dans l'URL");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Connexion en cours...</h2>
      <p>Traitement de votre connexion GitHub...</p>
    </div>
  );
}
