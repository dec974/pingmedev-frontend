import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/UserContent.module.css";
import Button from "../ui-kit/atoms/Button";
import PostsList from "../ui-kit/organisms/PostsList";

function UserContent() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedPosts, setFollowedPosts] = useState([]);
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    setLoading(true);

    if (activeTab === "posts") {
      fetch(`http://localhost:3000/users/user/${user.token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("data reçue (posts):", data);
         
          setPosts(userPosts);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors du fetch des posts :", err);
          setLoading(false);
        });
    }

    if (activeTab === "topics") {
      fetch(`http://localhost:3000/users/followed-posts/${user.token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("data reçue (followedPosts):", data);
          if (data.result) {
            setFollowedPosts(data.followedPosts);
          }
          setLoading(false);
        });
    }
  }, [activeTab, user.token]);

  return (
    <main className={styles.userContent}>
      <div className={styles.buttons}>
        <Button
          variant={"primary"}
          className={`${styles.tab} ${
            activeTab === "posts" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Mes posts
        </Button>
        <Button
          variant={"primary"}
          className={`${styles.tab} ${
            activeTab === "topics" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("topics")}
        >
          Topics suivis
        </Button>
      </div>

      <div className={styles.sort}>Du + récent au + ancien</div>

      {loading ? (
        <p>Chargement des posts...</p>
      ) : activeTab === "posts" ? (
        <PostsList posts={posts} />
      ) : (
        <PostsList posts={followedPosts} />
      )}
    </main>
  );
}

export default UserContent;
