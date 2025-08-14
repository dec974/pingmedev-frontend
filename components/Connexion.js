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
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });
  };

  // inscription avec github
  function GitHubSignUpButton() {
    const signUpWithGitHub = () => {
      if (!acceptTerms) {
        showModal(
          "Conditions requises",
          "Vous devez accepter les conditions d'utilisation",
          "warning"
        );
        return;
      }
      const clientID = "Ov23lio8tZ02RbB9eJUC";
      const redirectURI = "http://localhost:3001/githubPage?action=signup";
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };
    return (
      <Button
        onClick={signUpWithGitHub}
        variant="primary"
        // className={styles.githubButton} pour les couleurs github standard desactiver le com
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "1vh",
          gap: "10px",
          backgroundColor: "fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        S'inscrire avec GitHub
      </Button>
    );
  }
  // svg sert à avoir la petite tete github le chat la
  //connection avec github
  function GitHubSignInButton() {
    const signInWithGitHub = () => {
      const clientID = "Ov23lio8tZ02RbB9eJUC";
      const redirectURI = "http://localhost:3001/githubPage?action=signin";
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };
    // voir dans le Notion dans github auth le lien pour explication de ces lignes
    return (
      <Button
        onClick={signInWithGitHub}
        variant="primary"
        // className={styles.githubButton} pareil que 20 lignes au dessus
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "1vh",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Se connecter avec GitHub
      </Button>
    );
  }

  const handleGitHubCallback = (githubUserData) => {
    fetch("http://localhost:3000/users/signingithub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: githubUserData.email,
        username: githubUserData.login,
        githubId: githubUserData.id.toString(),
        avatarUrl: githubUserData.avatar_url,
        name: githubUserData.name || githubUserData.login,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);
          dispatch(
            signIn({
              id: data._id,
              username: data.username,
              token: data.token,
              email: data.email,
            })
          );
          // voir dans Notion dans localstorage pour explication de ces lignes
          if (data.isNewUser) {
            router.push("/profilPage");
          } else {
            router.push("/home");
          }
        } else {
          showModal(
            "Erreur GitHub",
            data.error || "Erreur de connexion GitHub",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion GitHub:", error);
        showModal("Erreur de connexion", "Erreur de connexion GitHub", "error");
      });
  };
  // voir le exo Ariane Google Connect pour explications de lignes dessous
  // connexion avec Google

  const handleSignInGoogle = (credentialResponse) => {
    const userInfo = jwtDecode(credentialResponse.credential);
    fetch("http://localhost:3000/users/signingoogle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        username: userInfo.name,
        googleId: userInfo.sub,
        isSignIn: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);

          setUser(userInfo);
          dispatch(
            signIn({
              id: data._id,
              username: data.username,
              token: data.token,
              email: data.email,
            })
          );
          router.push("/home");
        } else {
          showModal(
            "Erreur de connexion",
            data.error || "Utilisateur non inscrit",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error);
        showModal(
          "Erreur de connexion",
          "Erreur de connexion au serveur",
          "error"
        );
      });
  };
  // inscritpion avec Google
  const handleSignUpGoogle = (credentialResponse) => {
    if (!acceptTerms) {
      showModal(
        "Conditions requises",
        "Vous devez accepter les conditions d'utilisation",
        "warning"
      );
      return;
    }

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
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);

          dispatch(
            signIn({
              id: data._id,
              username: data.username,
              token: data.token,
              email: data.email,
            })
          );

          if (data.isNewUser) {
            showModal(
              "Succès !",
              "Inscription réussie ! Redirection en cours...",
              "success"
            );

            setTimeout(() => {
              router.push("/profilPage");
            }, 1200);
          } else {
            showModal(
              "Succès !",
              "Connexion réussie ! Redirection en cours...",
              "success"
            );

            setTimeout(() => {
              router.push("/home");
            }, 1200);
          }
        } else {
          showModal(
            "Erreur d'inscription",
            data.error || "Erreur lors de la connexion",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error);
        showModal(
          "Erreur de connexion",
          "Erreur de connexion au serveur",
          "error"
        );
      });
  };

  // inscription usernam email
  const handleSignUp = () => {
    if (!signUpUsername || !signUpMail || !signUpPassword || !acceptTerms) {
      showModal(
        "Champs requis",
        "Champs vides ou conditions non acceptées",
        "warning"
      );
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
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);

          dispatch(
            signUp({
              id: data._id,
              username: signUpUsername,
              token: data.token,
              email: signUpMail,
            })
          );
          setSignUpUsername("");
          setSignUpPassword("");
          setSignUpMail("");
          showModal(
            "Succès !",
            "Inscritption réussie ! Redirection en cours...",
            "success"
          );

          setTimeout(() => {
            router.push("/profilPage");
          }, 1200);
        } else {
          showModal(
            "Erreur d'inscription",
            data.error || "Username ou email déjà utilisé",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'inscription:", error);
        showModal(
          "Erreur de connexion",
          "Erreur de connexion au serveur",
          "error"
        );
      });
  };
  // voir Notion dans local storage le lien pour explication
  // connexion username password
  const handleSignIn = () => {
    if (!signInUsername || !signInPassword) {
      showModal("Champs requis", "Champs vides", "warning");
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
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          if (data.email) {
            localStorage.setItem("email", data.email);
          }

          dispatch(
            signIn({
              id: data._id,
              username: signInUsername,
              token: data.token,
              email: data.email,
            })
          );
          setSignInUsername("");
          setSignInPassword("");
          setSignUpMail("");

          showModal(
            "Succès !",
            "Connexion réussie ! Redirection en cours...",
            "success"
          );

          setTimeout(() => {
            router.push("/home");
          }, 1200);
        } else {
          showModal(
            "Erreur de connexion",
            data.error || "Utilisateur non inscrit",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
        showModal(
          "Erreur de connexion",
          "Erreur de connexion au serveur",
          "error"
        );
      });
  };

  useEffect(() => {
    if (router.query.github === "callback") {
      const githubUser = localStorage.getItem("githubUser");
      if (githubUser) {
        const userData = JSON.parse(githubUser);
        handleGitHubCallback(userData);
        localStorage.removeItem("githubUser");
      }
    }
  }, [router.query]);

  return (
    <div className={styles.container}>
      <div className={styles.containerImg}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>

      <div className={styles.section}>
        <div className={styles.signContainer}>
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
            <label className={styles.floatingLabel}>Nom d'utilisateur</label>
          </div>
          {/* label sert a avoir le texte qui flotte au dessus de l'input */}
          <div className={styles.inputWrapper}>
            <Input
              type="email"
              placeholder=" "
              value={signUpMail}
              onChange={(e) => {
                setSignUpMail(e.target.value);
                if (errorMessage && e.target.value) {
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
            <label className={styles.floatingLabel}>Mot de passe</label>
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
            label={
              <span className={styles.cbText}>
                J'accepte les conditions d'utilisation
              </span>
            }
            checked={acceptTerms}
            onChange={() => {
              setAcceptTerms(!acceptTerms);
              if (!acceptTerms) {
                setErrorMessage("");
              }
            }}
          />
          <div className={styles.blueLine}></div>
          <Button
            onClick={handleSignUp}
            variant="primary"
            style={{
              fontSize: "16px",
              padding: ".5vw 1vw",
              margin: ".5vw",
            }}
          >
            S'inscrire
          </Button>

          <GoogleOAuthProvider clientId={clientId}>
            {user ? (
              console.log("Utilisateur connecté :", user)
            ) : (
              <div>
                <GoogleLogin
                  onSuccess={handleSignUpGoogle}
                  onError={(error) => console.error(error)}
                  text="signup"
                  theme="outline"
                  size="large"
                  width="2vw"
                />
              </div>
            )}
          </GoogleOAuthProvider>
          <GitHubSignUpButton />
        </div>

        <div className={styles.logContainer}>
          <h2 className={styles.textLog}>Se connecter</h2>

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
            <label className={styles.floatingLabel}>Nom d'utilisateur</label>
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
            <label className={styles.floatingLabel}>Mot de passe</label>
          </div>

          <Button
            onClick={handleSignIn}
            variant="primary"
            style={{
              fontSize: "16px",
              padding: ".5vw 1vw",
              margin: ".5vw",
            }}
          >
            Se connecter
          </Button>

          <div className={styles.blueLine}></div>

          <GoogleOAuthProvider clientId={clientId}>
            {user ? (
              console.log("User already signed in")
            ) : (
              <div>
                <GoogleLogin
                  onSuccess={handleSignInGoogle}
                  onError={(error) => console.error(error)}
                  text="signin_with"
                  theme="outline"
                />
              </div>
            )}
            <GitHubSignInButton />
          </GoogleOAuthProvider>
        </div>
      </div>

      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.modalIcon} ${
                modal.type === "success"
                  ? styles.modalIconSuccess
                  : modal.type === "error"
                  ? styles.modalIconError
                  : modal.type === "warning"
                  ? styles.modalIconWarning
                  : styles.modalIconInfo
              }`}
            >
              {modal.type === "success"
                ? "✓"
                : modal.type === "error"
                ? "✕"
                : modal.type === "warning"
                ? "⚠"
                : "ℹ"}
            </div>

            {modal.title && (
              <h3 className={styles.modalTitle}>{modal.title}</h3>
            )}

            <p className={styles.modalMessage}>{modal.message}</p>

            <Button
              variant="primary"
              onClick={closeModal}
              style={{
                height: "40px",
                width: "100px",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
