import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/connexionPage");
  };
  return (
    <header
      style={{
        backgroundColor: "grey",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>PingMe.dev</h1>
      </div>
      <div>
        <button style={{}} onClick={handleLogin}>
          Se Connecter
        </button>
      </div>
    </header>
  );
}
