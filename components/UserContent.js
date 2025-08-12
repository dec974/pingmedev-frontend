import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/UserContent.module.css";
import Button from "../ui-kit/atoms/Button";
import PostsList from "../ui-kit/organisms/PostsList";
import Spinner from "../ui-kit/atoms/Spinner";

function UserContent() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedPosts, setFollowedPosts] = useState([]);
  const user = useSelector((state) => state.user.value);

  // Stockage en local du tri des posts par défaut (les plus récents au-dessus)
  const [sortOrder, setSortOrder] = useState("desc");

  // Fonction pour basculer l'ordre de tri
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortPosts = (list) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  // Récupération des posts de l'utilisateur
  useEffect(() => {
    setLoading(true);

    if (activeTab === "posts") {
      fetch(`http://localhost:3000/users/user/${user.token}`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then((data) => {
          // console.log(" Données reçues (posts) :", data);
          setPosts(data);
          setLoading(false);
        });
    }

    // Récupération des posts suivis par l'utilisateur
    if (activeTab === "topics") {
      fetch(`http://localhost:3000/users/followed-posts/${user.token}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("data reçue (followedPosts):", data);
          if (data.result) {
            setFollowedPosts(data.followedPosts);
          }
          setLoading(false);
        });
    }
  }, [activeTab, user.token]);

  const visiblePosts = sortPosts(
    (posts ?? []).filter((p) => p?.status !== "deleted")
  );

  const getHref = (post) =>
    post?.status === "draft" ? `/posts/edit/${post._id}` : `/posts/${post._id}`;

  if (loading) return <Spinner />;

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
          Mes suivis
        </Button>
      </div>

      <div className={styles.userContentContainer}>
        <div className={styles.sort}>
          <button onClick={toggleSortOrder} className={styles.sortBtn}>
            {sortOrder === "desc"
              ? "du plus récent au plus ancien"
              : "du plus ancien au plus récent"}
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : activeTab === "posts" ? (
          <PostsList
            posts={visiblePosts}
            showIcons={true}
            showAuthor={false}
            showStatus={true}
            showDelete={true}
            linkToDetail={true}
            getHref={getHref}
            onDelete={(postId) => {
              // Suppression d'un de MES posts

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
            posts={sortPosts(followedPosts)}
            showIcons={true}
            showUnfollow={true}
            onUnfollow={(postId) => {
              // CE post ne sera plus suivi

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
