import Link from "next/link";
import styles from "./Header.module.css";
import { FaEnvelope } from "react-icons/fa";
import { PiChats } from "react-icons/pi";
import Image from "next/image";
import Avatar from "../atoms/Avatar";

export default function Header({ unreadCount = 0,  }) {
  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <Link href="/home" className={styles.logo}>
          <Image
            src="/logo.png"
            width={140}
            height={90}
            className={styles.logoImg}
            alt="PingMe logo"
            priority={true}
          />
          Accueil
        </Link>

        <div className={styles.navLinks}>
          <Link href="/chat" className={styles.iconLink}>
            <PiChats />
          </Link>
          <Link href="/messenger" className={styles.iconLink}>
            <FaEnvelope className={styles.icon} />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </Link>

          <Link href="/dashboard" className={styles.avatarLink}>
            <Avatar />
          </Link>
        </div>
      </div>
    </header>
  );
}
