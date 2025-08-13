import { useState } from "react";
import styles from "../styles/SearchBar.module.css";
import Input from "../ui-kit/atoms/Input";
import Button from "../ui-kit/atoms/Button";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Une astuce, une question ?"
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
