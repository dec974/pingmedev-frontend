import styles from "./UiKitSection.module.css";

export default function UiKitSection({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}
