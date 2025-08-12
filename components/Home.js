import { useState, useEffect } from "react";
import Header from "../ui-kit/organisms/Header";
import styles from "../styles/Home.module.css";
import PostsList from "../ui-kit/organisms/PostsList";
import Button from "../ui-kit/atoms/Button";
import Footer from "../ui-kit/organisms/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const router = useRouter();
  const user = useSelector((state) => state.user.value);

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

      // get all languages for the sidebar
    fetch("http://localhost:3000/languages")
      .then((res) => res.json())
      .then((data) => {
        // Handle languages data if needed
        console.log(data.data);
        // setlanguges sort by name
        const sortedLanguages = data.data.sort((a, b) => a.name.localeCompare(b.name));
        setLanguages(sortedLanguages);
      })
      .catch((error) => {
        console.error("Error fetching languages:", error);
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

  const languagesList = languages.map((lang) => (
    <li key={lang._id} className={styles.languageItem}>
      <Link href={`/languages/${lang._id}`} className={styles.link}>{lang.name}</Link> 
    </li>
  ));
  //voici le composant Home qui affiche les posts
return (
  <>
    <Header />
    <div className={styles.home}>
      {/* Colonne gauche */}
      <div className={styles.colLeft}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Langages</h2>
          </div>
          <div className={styles.sidebarContent}>
            {/* language sort by name */}
            <ul className={styles.languageList}>
              {languagesList}
            </ul>
          </div>
        </div>
      </div>

      {/* Colonne centrale */}
      <div className={styles.colCenter}>
        <div className={styles.centerHeader}>
          <h1 className={styles.title}>Bienvenue sur PingMe.dev</h1>
          <h2 className={styles.nameTitle}>{user.username}</h2>
        </div>

          <div className={styles.searchArea}>
            <SearchBar className={styles.input} onSearch={handleSearch} />
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
