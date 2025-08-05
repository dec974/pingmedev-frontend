import styles from "./Checkbox.module.css";

export default function Checkbox({ id, label, checked, onChange }) {
    
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.custom}></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
