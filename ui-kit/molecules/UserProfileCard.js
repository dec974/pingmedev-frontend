import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import styles from "./UserProfileCard.module.css";
import Link from "next/link";

export default function UserProfileCard({ name = "Utilisateur", avatar = "/avatar.png" }) {
  return (
    <div className={styles.profileCard}>
      <Avatar src={avatar} size={50} />
      <p className={styles.name}>{name}</p>
      <Link href="/dashboard">
        <Button variant="primary">Mon espace</Button>
      </Link>
    </div>
  );
}


