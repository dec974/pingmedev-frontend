import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} PingMe.dev - Tous droits réservés
    </footer>
  );
}
