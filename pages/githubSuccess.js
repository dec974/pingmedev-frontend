import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "../reducers/user";

export default function GitHubSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const { token, username, email, isNewUser } = router.query;

    if (token) {
      // Sauvegarde dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);

      // Mise à jour du Redux store
      dispatch(
        signIn({
          token,
          username,
          email,
        })
      );

      // Redirection selon si c'est un nouvel utilisateur
      if (isNewUser === "true") {
        router.replace("/profilPage");
      } else {
        router.replace("/home");
      }
    }
  }, [router.query, dispatch]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Connexion avec GitHub...</h2>
      <p>Redirection en cours, merci de patienter.</p>
    </div>
  );
}
