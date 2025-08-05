import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { signUp, signIn } from "../reducers/user";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch("http://localhost:3000/auth/github/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from your backend. Maybe store an authentication token or set user data.
        });
    }
  }, []);

  function GitHubLoginButton() {
    const loginWithGitHub = () => {
      const clientID = "Ov23lio8tZ02RbB9eJUC";
      const redirectURI = "http://localhost:3000/auth/github/callback";
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };

    return <button onClick={loginWithGitHub}>Se connecter avec GitHub</button>;
  }

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

  const handleRegister = () => {
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
        }
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        <h2>S'inscrire</h2>
        <input
          type="text"
          placeholder="Username"
          value={signUpUsername}
          onChange={(e) => setSignUpUsername(e.target.value)}
          style={{ width: "200px", padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={signUpMail}
          onChange={(e) => setSignUpMail(e.target.value)}
          style={{ width: "200px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
          style={{ width: "200px", padding: "8px" }}
        />
        <button
          onClick={handleRegister}
          style={{ width: "120px", padding: "8px" }}
        >
          Suivant
        </button>

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
        <h2>Se Connecter</h2>
        <input
          type="text"
          placeholder="Username"
          value={signInUsername}
          onChange={(e) => setSignInUsername(e.target.value)}
          style={{ width: "200px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={signInPassword}
          onChange={(e) => setSignInPassword(e.target.value)}
          style={{ width: "200px", padding: "8px" }}
        />
        <button
          onClick={handleConnection}
          style={{ width: "120px", padding: "8px" }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
