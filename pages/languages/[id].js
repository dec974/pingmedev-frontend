import styles from "../../styles/LanguagesPage.module.css";
import MainLayout from "../../ui-kit/template/MainLayout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "../../ui-kit/atoms/Spinner";
import PostsList from "../../ui-kit/organisms/PostsList";
import Icon from "../../ui-kit/atoms/Icon";
import Button from "../../ui-kit/atoms/Button";

function LangagesPage() {
  const [posts, setPosts] = useState([]);
  const [language, setLanguage] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && typeof id === "string" && id !== "undefined" && id !== "") {
      fetch(`http://localhost:3000/languages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setLanguage(data?.language);
        })
        .catch((error) => {
          console.error("Error fetching languages:", error);
        });

      fetch(`http://localhost:3000/posts/languages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
        })
        .catch((error) => {
          console.error("Error fetching languages:", error);
        });
    }
  }, [id]);

  if (!id && !language) {
    return <Spinner size={50} />;
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.btnBack} onClick={() => router.back()}>
          <Button className={styles.buttonBack} variant="primary">
            Retour
          </Button>
        </div>
        <div className={styles.header}>
          <Icon language={language} size={54} />
          <h1 className={styles.title}>
            {language && language.name ? language.name : "loading ..."}
          </h1>
        </div>
        <div className={styles.postsList}>
          {posts.length > 0 ? (
            <PostsList posts={posts} />
          ) : (
            <p>Pas de posts pour ce language.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default LangagesPage;
