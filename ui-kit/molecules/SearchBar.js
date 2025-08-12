import Input from "../atoms/Input";
import Button from "../atoms/Button";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, className }) {
  return (
     <div className={`${styles.wrapper} ${className || ""}`}>
      <Input placeholder="Rechercher un sujet..." />
      <Button onClick={onSearch} className={styles.searchButton}>Chercher</Button>
    </div>
  );
}
