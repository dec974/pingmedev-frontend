import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Landing.module.css";

export default function Home() {
  const router = useRouter();

  const handleConnexionClick = () => {
    router.push("/connexionPage");
  };
  const handleVisitClick = () => {
    router.push("/home");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerElement}>
          <h1 className={styles.h1}>
            La plateforme des développeurs ouverte à tous les parcours.
            <img src="/logo.png" alt="Logo" className={styles.logo} />
          </h1>

          <div className={styles.buttonContainer}>
            <Button
              onClick={handleVisitClick}
              variant="secondary"
              style={{
                fontSize: "18px",
                padding: "1vw 2vw",
              }}
            >
              Visiter*
            </Button>

            <Button
              onClick={handleConnexionClick}
              variant="primary"
              style={{
                fontSize: "18px",
                padding: "1vw 2vw",
              }}
            >
              Connexion
            </Button>
          </div>

          <p className={styles.p}>
            *Vous devrez vous connecter pour échanger avec les autres
            utilisateurs.
          </p>
        </div>

        <div>
          <img
            src="/landingImage.png"
            alt="Landing Image"
            className={styles.landingImage}
          />
        </div>
      </div>
    </>
  );
}