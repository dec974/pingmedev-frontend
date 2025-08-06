import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { signUp, signIn } from "../reducers/user";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Button from "../ui-kit/atoms/Button";
import Input from "../ui-kit/atoms/Input";

const clientId =
  "492308766796-4rukpcc44v9mhjrtk98ibj9eoan212qa.apps.googleusercontent.com";

export default function Connexion() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [signUpMail, setSignUpMail] = useState("");
  const [user, setUser] = useState(null);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  // pour verifier si l'utilisateur a accepté les conditions d'utilisation
  const [errorMessage, setErrorMessage] = useState("");
  //pour verifier si l'utilisateur a rempli tous les champs a l inscription
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
  //pour verifier si l'utilisateur a rempli tous les champs a la connexion

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    //ligne de log github

    if (code) {
      fetch("http://localhost:3000/auth/github/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {});
    }
  }, []);
  //condition de log github

  function GitHubLoginButton() {
    const loginWithGitHub = () => {
      const clientID = "Ov23lio8tZ02RbB9eJUC";
      const redirectURI = "http://localhost:3000/auth/github/callback";
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };

    return <button onClick={loginWithGitHub}>Se connecter avec GitHub</button>;
  }
  //function pour se co via github

  const handleLogin = (credentialResponse) => {
    const userInfo = jwtDecode(credentialResponse.credential);
    fetch("http://localhost:3000/users/signingoogle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        username: userInfo.name,
        googleId: userInfo.sub,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUser(userInfo);
          dispatch(
            signIn({
              username: data.username,
              token: data.token,
              email: data.email,
            })
          );
          router.push("/profilPage");
        }
      });
  };
  //function pour se co via google

  const handleRegister = () => {
    if (!signUpUsername) {
      setErrorMessage("Le nom d'utilisateur est requis");
      return;
    }

    if (!signUpMail) {
      setErrorMessage("L'email est requis");
      return;
    }

    if (!signUpPassword) {
      setErrorMessage("Le mot de passe est requis");
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("Vous devez accepter les conditions pour continuer");
      return;
    }

    setErrorMessage("");
    //renvoi un msg d erreur si champs manquants ou case terms non cochée
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signUpUsername,
        password: signUpPassword,
        email: signUpMail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            signUp({
              username: signUpUsername,
              token: data.token,
              email: signUpMail,
            })
          );
          setSignUpUsername("");
          setSignUpPassword("");
          setSignUpMail("");
          router.push("/profilPage");
        }
      });
  };

  const handleConnection = () => {
    if (!signInUsername) {
      setSignInErrorMessage("Le nom d'utilisateur est requis");
      return;
    }

    if (!signInPassword) {
      setSignInErrorMessage("Le mot de passe est requis");
      return;
    }

    setSignInErrorMessage("");

    fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(signIn({ username: signInUsername, token: data.token }));
          setSignInUsername("");
          setSignInPassword("");
          setSignUpMail("");
          router.push("/profilPage");
          //a changer pour homePage quand sera dispo
        }
      });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{ textAlign: "center", marginBottom: "30px", marginTop: "20px" }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
            objectFit: "contain",
            //objectFit: "contain" pour garder l image entiere
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          // gappour avoir un espacement entre les elements enfants
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <div
          className="logContainer"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            minWidth: "350px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 50px)",
              fontWeight: "bold",
              color: "#1761ab",
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: "30px",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              // whiteSpace: "nowrap" pour eviter le retour a la ligne
              textAlign: "center",
            }}
          >
            S'inscrire
          </h2>

          <Input
            type="text"
            placeholder="Username"
            value={signUpUsername}
            onChange={(e) => {
              setSignUpUsername(e.target.value);
              if (errorMessage && e.target.value) {
                setErrorMessage("");
              }
            }}
            style={{ width: "300px", padding: "12px" }}
          />
          <Input
            type="email"
            placeholder="Email"
            value={signUpMail}
            onChange={(e) => {
              setSignUpMail(e.target.value);
              // Efface le message derreur quand lutilisateur tape
              if (errorMessage && e.target.value.trim()) {
                setErrorMessage("");
              }
            }}
            style={{ width: "300px", padding: "12px" }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={(e) => {
              setSignUpPassword(e.target.value);
              if (errorMessage && e.target.value) {
                setErrorMessage("");
              }
            }}
            style={{ width: "300px", padding: "12px" }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: "15px",
              fontSize: "14px",
              color: "#1761ab",
            }}
          >
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                // Efface le message derreur quand lutilisateur coche la case
                if (e.target.checked) {
                  setErrorMessage("");
                }
              }}
              style={{
                marginRight: "8px",
              }}
            />
            <span>J'accepte les conditions d'utilisation</span>
          </label>

          {errorMessage && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "15px",
                textAlign: "center",
                borderRadius: "4px",
                padding: "8px 12px",
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                width: "300px",
              }}
            >
              {errorMessage}
            </div>
          )}

          <Button
            onClick={handleRegister}
            variant="primary"
            style={{
              height: "60px",
              width: "200px",
              fontSize: "18px",
              marginRight: "15px",
              marginBottom: "20px",
            }}
          >
            Suivant
          </Button>

          <div
            style={{
              width: "200px",
              height: "3px",
              backgroundColor: "#1761ab",
              marginBottom: "20px",
            }}
          ></div>

          <GoogleOAuthProvider clientId={clientId}>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              {user ? (
                <div>
                  <h4>Welcome {user.name}!</h4>
                  <p>Email: {user.email}</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <GoogleLogin
                    onSuccess={handleLogin}
                    onError={(error) => console.error(error)}
                  />
                  <GitHubLoginButton />
                </div>
              )}
            </div>
          </GoogleOAuthProvider>
        </div>
        {/* voir google connect si besoin (cours ariane) */}

        <div
          className="logContainer"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 50px)",
              fontWeight: "bold",
              color: "#1761ab",
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: "30px",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            Se connecter
          </h2>

          <Input
            type="text"
            placeholder="Username"
            value={signInUsername}
            onChange={(e) => {
              setSignInUsername(e.target.value);
              if (signInErrorMessage && e.target.value) {
                setSignInErrorMessage("");
              }
            }}
            style={{ width: "300px", padding: "12px" }}
          />

          <Input
            type="password"
            placeholder="Password"
            value={signInPassword}
            onChange={(e) => {
              setSignInPassword(e.target.value);
              if (signInErrorMessage && e.target.value) {
                setSignInErrorMessage("");
              }
            }}
            style={{ width: "300px", padding: "12px" }}
          />

          {signInErrorMessage && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "15px",
                textAlign: "center",
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                padding: "8px 12px",
                width: "300px",
              }}
            >
              {signInErrorMessage}
            </div>
          )}

          <Button
            onClick={handleConnection}
            variant="primary"
            style={{
              height: "60px",
              width: "200px",
              fontSize: "18px",
              marginRight: "15px",
              marginBottom: "20px",
            }}
          >
            Suivant
          </Button>

          <div
            style={{
              width: "200px",
              height: "3px",
              backgroundColor: "#1761ab",
              marginBottom: "20px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
