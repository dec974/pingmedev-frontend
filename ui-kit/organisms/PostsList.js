import styles from "./PostsList.module.css";
import { SiJavascript, SiReact } from "react-icons/si";
import { FaTrash } from "react-icons/fa";
import { formatDate } from "../../modules/formatDate";


const iconMap = {
  javascript: SiJavascript,
  react: SiReact,
};

export default function PostsList({
  posts,
  showIcons = true,
  showAuthor = true,
  showDelete = false,
  onDelete,
}) {

  // on s'assure de recevoir un tableau, sinon on contourne l'erreur.
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>Aucun post à afficher.</p>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => {
        const Icon = iconMap[post.language] || null;

        // on prend la première valeur qui remonte (populate Mongoose ou autre format, sinon null)
        const author = post?.userId?.username ?? post?.username ?? null;

        return (
          <div key={post._id} className={styles.post}>
            <div className={styles.header}>
              <div className={styles.headerleft}>
                {showIcons && Icon && <Icon className={styles.icon} />}

                {showAuthor && author && (
                  <p className={styles.username}>
                    <span className={styles.type}>Question de </span>
                    {author}
                  </p>
                )}
              </div>
              <div className={styles.headerright}>
                <div className={styles.meta}>
                  <time className={styles.date}>
                    {formatDate(post.createdAt)}
                  </time>
                  {showDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        if (!onDelete) return;
                        const ok = window.confirm(
                          "Êtes-vous sûr de vouloir supprimer ce post ?"
                        );
                        if (ok) onDelete(post._id);
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <h3 className={styles.title}>{post.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
