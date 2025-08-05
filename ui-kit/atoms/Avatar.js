import styles from "./Avatar.module.css";
import Image from "next/image";

export default function Avatar({ src = "/avatar.png", size = 50 }) {
  return (
    <Image
      src={src}
      width={50}
      height={50}
      alt="avatar"
      className={styles.avatar}
      style={{ width: size, height: size }}
    />
  );
}
