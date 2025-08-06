import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { signUp, signIn } from "../reducers/user";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Button from "../ui-kit/atoms/Button";
import Input from "../ui-kit/atoms/Input";
import styles from "../styles/Connexion.module.css";
import Checkbox from "../ui-kit/atoms/Checkbox";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
  const [showPopover, setShowPopover] = useState(false);

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

  function GitHubCallback() {
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        // Send code to backend
        fetch("http://localhost:3000/auth/callback/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Handle the response from your backend. Maybe store an authentication token or set user data.
          });
      }
    }, []);

    return <div>Processing GitHub login...</div>;
  }
  //function pour se co via github

  const handleLogup = (credentialResponse) => {
    const userInfo = jwtDecode(credentialResponse.credential);
    fetch("http://localhost:3000/users/signupgoogle", {
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
            signUp({
              username: data.username,
              token: data.token,
              email: data.email,
            })
          );
          router.push("/profilPage");
        }
      });
  };

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
    if (!signUpUsername || !signUpMail || !signUpPassword || !acceptTerms) {
      setErrorMessage("Champs vides ou conditions non acceptées");
      return;
    }

    setErrorMessage("");
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
    if (!signInUsername || !signInPassword) {
      setSignInErrorMessage("Champs vides");
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
          router.push("/index_UI");
          //a changer pour homePage quand sera dispo
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerImg}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>

      <div className={styles.section} style={{}}>
        <div className={styles.logContainer}>
          <h2 className={styles.textLog}>S'inscrire</h2>

          <div className={styles.inputWrapper}>
            <Input
              type="text"
              placeholder=" "
              value={signUpUsername}
              onChange={(e) => {
                setSignUpUsername(e.target.value);
                if (errorMessage && e.target.value) {
                  setErrorMessage("");
                }
              }}
              style={{ width: "300px", padding: "12px" }}
            />
            <label className={styles.floatingLabel}>Username</label>
          </div>
          <div className={styles.inputWrapper}>
            <Input
              type="email"
              placeholder=" "
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
            <label className={styles.floatingLabel}>Email</label>
          </div>
          <div className={styles.inputWrapper}>
            <Input
              type="password"
              placeholder=" "
              value={signUpPassword}
              onChange={(e) => {
                setSignUpPassword(e.target.value);
                if (errorMessage && e.target.value) {
                  setErrorMessage("");
                }
              }}
              style={{ width: "300px", padding: "12px" }}
            />
            <label className={styles.floatingLabel}>Password</label>
          </div>

          <div className={styles.termsSection}>
            <button
              type="button"
              className={styles.termsButton}
              onClick={() => setShowPopover(!showPopover)}
            >
              Lire Les Conditions D'utilisation
            </button>

            {showPopover && (
              <div className={styles.popover}>
                <div className={styles.popoverContent}>
                  <h3>Conditions d'Utilisation</h3>
                  <p>
                    En utilisant ce service, vous acceptez de respecter les
                    règles suivantes :
                  </p>
                  <ul>
                    <li>Utilisation respectueuse de la plateforme</li>
                    <li>Respect des autres utilisateurs</li>
                    <li>Pas de contenu inapproprié ou offensant</li>
                    <li>Protection de vos données personnelles</li>
                    <li>Respect de la propriété intellectuelle</li>
                  </ul>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowPopover(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>

          <Checkbox
            label="J'accepte les conditions d'utilisation"
            checked={acceptTerms}
            onChange={() => {
              setAcceptTerms(!acceptTerms);
              // Efface le message derreur quand lutilisateur coche la case
              if (!acceptTerms) {
                setErrorMessage("");
              }
            }}
          />

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
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
            S'inscrire
          </Button>

          <div className={styles.blueLine}></div>

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
                    text="signup_with"
                  />
                  <GitHubLoginButton />
                </div>
              )}
            </div>
          </GoogleOAuthProvider>
        </div>
        {/* voir google connect si besoin (cours ariane) */}

        <div className={styles.logContainer}>
          <h2 className={styles.textLog} style={{}}>
            Se connecter
          </h2>

          <div className={styles.inputWrapper}>
            <Input
              type="text"
              placeholder=" "
              value={signInUsername}
              onChange={(e) => {
                setSignInUsername(e.target.value);
                if (signInErrorMessage && e.target.value) {
                  setSignInErrorMessage("");
                }
              }}
              style={{ width: "300px", padding: "12px" }}
            />
            <label className={styles.floatingLabel}>Username</label>
          </div>

          <div className={styles.inputWrapper}>
            <Input
              type="password"
              placeholder=" "
              value={signInPassword}
              onChange={(e) => {
                setSignInPassword(e.target.value);
                if (signInErrorMessage && e.target.value) {
                  setSignInErrorMessage("");
                }
              }}
              style={{ width: "300px", padding: "12px" }}
            />
            <label className={styles.floatingLabel}>Password</label>
          </div>

          {signInErrorMessage && (
            <div className={styles.errorMessage}>{signInErrorMessage}</div>
          )}

          <Button
            onClick={handleConnection}
            variant="primary"
            style={{
              height: "60px",
              width: "200px",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            Se connecter
          </Button>

          <div className={styles.blueLine}></div>
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
                    onSuccess={handleConnection}
                    onError={(error) => console.error(error)}
                    text="signin_with"
                  />
                  <GitHubLoginButton />
                </div>
              )}
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
