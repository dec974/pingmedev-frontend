import Input from "../atoms/Input";
import Button from "../atoms/Button";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch }) {
  return (
    <div className={styles.wrapper}>
      <Input placeholder="Rechercher un sujet..." />
      <Button onClick={onSearch}>Chercher</Button>
    </div>
  );
}
