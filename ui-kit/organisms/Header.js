import Link from "next/link";
import Button from "../atoms/Button";
import styles from "./Header.module.css";
import { FaEnvelope } from "react-icons/fa";
import Image from "next/image";

export default function Header({ unreadCount = 0, onLoginClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" width={175} height={100} className={styles.logoImg}/>
          PingMe.dev
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/messages" className={styles.iconLink}>
            <FaEnvelope className={styles.icon} />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </Link>

          <Button variant="primary" onClick={onLoginClick}>
            Connexion
          </Button>
        </nav>
      </div>
    </header>
  );
}

