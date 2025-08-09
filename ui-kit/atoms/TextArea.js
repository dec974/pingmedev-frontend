import styles from "./TextArea.module.css";

export default function TextArea({
  placeholder = "",
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <textarea
      className={`${styles.textarea} ${className}`}
      placeholder={placeholder}
      rows={rows}
      {...props}
    />
  );
}
