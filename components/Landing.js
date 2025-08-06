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
          </h1>

          <div className={styles.buttonContainer}>
            <Button
              onClick={handleVisitClick}
              variant="primary"
              style={{
                height: "60px",
                width: "200px",
                fontSize: "18px",
                minWidth: "150px",
              }}
            >
              Visiter
            </Button>

            <Button
              onClick={handleConnexionClick}
              variant="primary"
              style={{
                height: "60px",
                width: "200px",
                fontSize: "18px",
                minWidth: "150px",
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
          <img src="/logo.png" alt="Logo" className={styles.logo} />
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
