import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/connexionPage");
  };

  return (
    <div>
      <header
        style={{
          position: "absolute",
          top: "400px",
          right: "800px",
        }}
      >
        <button onClick={handleLogin}>Se Connecter</button>
      </header>
    </div>
  );
}

export default Home;
