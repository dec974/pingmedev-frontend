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
  console.log(" Utilisateur connecté :", user);

  useEffect(() => {
    setLoading(true);

    if (activeTab === "posts") {
      fetch(`http://localhost:3000/users/user/${user.token}`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then((data) => {
          console.log(" Données reçues (posts) :", data);
          setPosts(data);
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
      <div className={styles.userContentContainer}>
        <div className={styles.sort}>Du + récent au + ancien</div>

        {loading ? (
          <p>Chargement des posts...</p>
        ) : activeTab === "posts" ? (
          <PostsList
            posts={posts}
            showIcons={false}
            showAuthor={false}
            showDelete={true}
            linkToDetail={true}
            onDelete={(postId) => {
              console.log("Suppression d'un de MES posts", postId);

              fetch(`http://localhost:3000/posts/${postId}/deleted`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
              })
                .then((res) => res.json())
                .then(() => {
                  setPosts((prev) => prev.filter((p) => p._id !== postId));
                });
            }}
          />
        ) : (
          <PostsList
            posts={followedPosts}
            showIcons={false}
            showAuthor={true}
            showUnfollow={true}
            onUnfollow={(postId) => {
              console.log("Ce post ne sera plus suivi", postId);

              fetch(`http://localhost:3000/users/unfollow-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token, postId }),
              })
                .then((res) => res.json())
                .then(() => {
                  setFollowedPosts((prev) =>
                    prev.filter((p) => p._id !== postId)
                  );
                });
            }}
          />
        )}
      </div>
    </main>
  );
}

export default UserContent;
