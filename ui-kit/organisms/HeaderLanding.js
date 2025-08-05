import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";

export default function HeaderLanding() {
  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          PingMe.dev
        </Link>
      </div>
    </header>
  );
}
