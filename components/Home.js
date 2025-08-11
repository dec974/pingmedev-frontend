import { useState, useEffect } from "react";
import Header from "../ui-kit/organisms/Header";
import styles from "../styles/Home.module.css";
import PostsList from "../ui-kit/organisms/PostsList";
import Button from "../ui-kit/atoms/Button";
import Footer from "../ui-kit/organisms/Footer";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleNewPostClick = () => {
    router.push("/posts/new");
  };

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => {
        const tenPosts = data.slice(0, 10);
        setPosts(tenPosts);
        setFilteredPosts(tenPosts);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredPosts(posts);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredPosts(
      posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(lower) ||
          post.languages?.some((lang) =>
            typeof lang === "string"
              ? lang.toLowerCase().includes(lower)
              : lang.name?.toLowerCase().includes(lower)
          )
      )
    );
  };

  //voici le composant Home qui affiche les posts
  return (
    <>
      <Header />
      <div className={styles.home}>
        {/* Colonne gauche */}
        <div className={styles.colLeft}></div>

        {/* Colonne centrale */}
        <div className={styles.colCenter}>
          <div className={styles.centerHeader}>
            <h1 className={styles.title}>Bienvenue sur PingMeDev</h1>
            <h2 className={styles.nameTitle}>John Doe</h2>
          </div>

          <div className={styles.searchArea}>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className={styles.postHeader}>
            <h3 className={styles.postsTitle}>Derniers posts</h3>
            <div className={styles.newPostBtn}>
              <Button variant="secondary" onClick={handleNewPostClick}>
                Nouveau Sujet
              </Button>
            </div>
          </div>

          <div className={styles.postsContainer}>
            {loading ? (
              <p>Chargement en cours</p>
            ) : (
              <PostsList posts={filteredPosts} />
            )}
          </div>
        </div>

        {/* Colonne droite */}
        <div className={styles.colRight}></div>
      </div>

      <Footer />
    </>
  );
}
