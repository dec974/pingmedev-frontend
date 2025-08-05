import styles from "./TextArea.module.css";

export default function TextArea({ placeholder = "", rows = 4 }) {
  return (
    <textarea
      className={styles.textarea}
      placeholder={placeholder}
      rows={rows}
    />
  );
}

