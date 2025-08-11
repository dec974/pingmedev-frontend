import { useState, useEffect } from "react";
import Header from "../ui-kit/organisms/Header";
import Input from "../ui-kit/atoms/Input";
import styles from "../styles/Home.module.css";
import PostsList from "../ui-kit/organisms/PostsList";
import { useState as useStateLang, useEffect as useEffectLang } from "react";
import axios from "axios";
import Button from "../ui-kit/atoms/Button";
import Footer from "../ui-kit/organisms/Footer";
import { useRouter } from "next/router";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useStateLang([]);
  const router = useRouter();

  const handleNewPostClick = () => {
    router.push("/posts/new");
  };

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.slice(0, 10)); //Affiche les 10 premiers posts
        setLoading(false);
      });
  }, []);

  useEffectLang(() => {
    axios.get("http://localhost:3000/languages/").then((res) => {
      if (res.data && res.data.result) setLanguages(res.data.data);
    });
  }, []);

  //voici le composant Home qui affiche les posts
  return (
    <>
      <Header />
      <div className={styles.home}>
        <div className={styles.fixedContent}>
          <h1 className={styles.title}>Bienvenue sur PingMeDev</h1>
          <h2 className={styles.nameTitle}>John Doe</h2>

          <div className={styles.searchArea}>
            <Input type="text" placeholder="Rechercher un sujet ..." />
            <Button variant={"primary"} onClick={() => alert("Rechercher!")}>
              Chercher
            </Button>
          </div>

          <div className={styles.postHeader}>
            <h3 className={styles.postsTitle}> Derniers posts</h3>
            <div className={styles.newPostBtn}>
              <Button variant={"secondary"} onClick={handleNewPostClick}>
                Nouveau Sujet
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.postsContainer}>
          {loading ? (
            <p> Chargement en cours</p>
          ) : (
            <PostsList posts={posts} languages={languages} />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
