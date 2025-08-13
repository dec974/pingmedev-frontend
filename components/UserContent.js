import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/UserContent.module.css";
import Button from "../ui-kit/atoms/Button";
import PostsList from "../ui-kit/organisms/PostsList";
import Spinner from "../ui-kit/atoms/Spinner";
import ConfirmDialog from "./ConfirmDialog";

function UserContent({ postId, onDeleted }) {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [open, setOpen] = useState(false);
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

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirmer",
    confirmVariant: "danger",
    onConfirm: () => {},
    isBusy: false,
  });

  const openConfirm = (opts) =>
    setConfirmState((s) => ({ ...s, open: true, ...opts, isBusy: false }));

  const closeConfirm = () =>
    setConfirmState((s) => ({ ...s, open: false, isBusy: false }));

  const runConfirm = async () => {
    try {
      setConfirmState((s) => ({ ...s, isBusy: true }));
      await confirmState.onConfirm?.();
    } finally {
      closeConfirm();
    }
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
      <div className={styles.userContentContainer}>
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
          <div className={styles.sort}>
            <Button onClick={toggleSortOrder} className={styles.sortBtn}>
              {sortOrder === "desc"
                ? "du plus récent au plus ancien"
                : "du plus ancien au plus récent"}
            </Button>
          </div>
        </div>

        {activeTab === "posts" ? (
          <PostsList
            posts={visiblePosts}
            className={styles.postCard}
            showIcons={true}
            showAuthor={false}
            showStatus={true}
            showDelete={true}
            linkToDetail={true}
            getHref={getHref}
            onDelete={(id, post) => {
              post = posts.find((p) => p._id === id);
              openConfirm({
                title: "Supprimer le post",
                message: (
                  <>
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <strong>{post?.title ?? "ce post"}</strong> ?<br />
                    Cette action est irréversible.
                  </>
                ),
                confirmLabel: "Supprimer",
                confirmVariant: "danger",
                onConfirm: () => {
                  return fetch(`http://localhost:3000/posts/${id}/deleted`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                  })
                    .then((res) =>
                      res.ok
                        ? res.json()
                        : res.json().then((e) => Promise.reject(e))
                    )
                    .then(() => {
                      setPosts((prev) => prev.filter((p) => p._id !== id));
                    });
                },
              });
            }}
          />
        ) : (
          <PostsList
            posts={sortPosts(followedPosts)}
            showIcons={true}
            showUnfollow={true}
            onUnfollow={(id, post) => {
              const target = post ?? followedPosts.find((p) => p._id === id);

              openConfirm({
                title: "Ne plus suivre ce post",
                message: (
                  <>
                    Voulez-vous arrêter de suivre{" "}
                    <strong>{target?.title ?? "ce post"}</strong> ?
                  </>
                ),
                confirmLabel: "Désuivre",
                confirmVariant: "danger",

                onConfirm: () => {
                  fetch("http://localhost:3000/users/unfollow-post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: user.token, postId: id }),
                  })
                    .then((res) =>
                      res
                        .json()
                        .catch(() => ({
                          result: false,
                          error: "Réponse JSON invalide",
                        }))
                        .then((data) => ({ ok: res.ok, data }))
                    )
                    .then(({ ok, data }) => {
                      if (!ok || !data.result) {
                        return;
                      }
                      setFollowedPosts((prev) =>
                        prev.filter((p) => p._id !== id)
                      );
                    });
                },
              });
            }}
          />
        )}
      </div>
      <ConfirmDialog
        isOpen={confirmState.open}
        onClose={closeConfirm}
        onConfirm={runConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        confirmVariant={confirmState.confirmVariant}
        cancelLabel="Annuler"
        isBusy={confirmState.isBusy}
      />
    </main>
  );
}

export default UserContent;
