import styles from "../styles/Login.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaGithub } from "react-icons/fa6";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const clientIdGoogle =
    "1088392206809-l8m8s3ut3tkou8j9te0hu02gs7a0sr4s.apps.googleusercontent.com";

  const storeUser = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogin = () => {
    const data = JSON.stringify({
      username: username,
      password: password,
    });

    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          setError(data.error || "Erreur de connexion");
          return;
        }
        storeUser(data.user);
        router.push("/");
      });
  };

  return (
    <div className={styles.container}>
      <img src="/logo.png" alt="PingMe Logo" className={styles.logo} />
      <h1>Administration</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2>Connexion</h2>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.loginButton} onClick={() => handleLogin()}>
            Se connecter
          </button>
        </div>
        <div className={styles.loginOAuth}>
          <h2>Connexion avec OAuth</h2>
          <div className={styles.googleLogin}>
            <GoogleOAuthProvider clientId={clientIdGoogle}>
              <GoogleLogin
                styles={{ width: "100%" }}
                onSuccess={(credentialResponse) => {
                  const userObject = jwtDecode(credentialResponse.credential);
                  const username = userObject.name;
                  const dataLoginGoogle = JSON.stringify({
                    username: username,
                  });
                  fetch("http://localhost:3000/admin/login/google", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: dataLoginGoogle,
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (!data.result) {
                        setError(
                          data.error || "Erreur de connexion avec Google"
                        );
                        return;
                      }
                      storeUser(data.user);
                      router.push("/");
                    });
                }}
                onError={() => {
                  setError("Échec de la connexion avec Google");
                }}
              />
            </GoogleOAuthProvider>
          </div>
          <div className={styles.githubLogin}>
            <button
              className={styles.githubButton}
              onClick={() => {
                const clientID = "Ov23liX1qR7miekPoKMN";
                const redirectURI =
                  "http://localhost:3001/auth/github/callback";
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
              }}
            >
              <FaGithub size={"2rem"} />
              Se connecter avec GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
