import styles from "./PostsList.module.css";
import Link from "next/link";

import { SiJavascript, SiReact } from "react-icons/si";
import { FaTrash } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { formatDate } from "../../modules/formatDate";
import { truncateInput } from "../../modules/truncateInput";
import Icon from "../atoms/Icon.js";

export default function PostsList({
  posts,
  className = "",
  showIcons = true,
  showAuthor = true,
  showDelete = false,
  onDelete,
  showUnfollow = false,
  onUnfollow,
  linkToDetail = true,
  maxTitle = 255,
  showStatus = false,
}) {
  // on s'assure de recevoir un tableau.
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>Aucun post à afficher.</p>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => {
        // on prend la première valeur qui remonte (populate Mongoose ou autre format, sinon null)
        const author = post?.userId?.username ?? post?.username ?? null;

        const Card = ({ children, className = "" }) =>
          linkToDetail ? (
            <Link
              href={`/posts/${post._id}`}
              className={`${styles.postLink} ${className}`}
            >
              {children}
            </Link>
          ) : (
            <div className={styles.post}>{children}</div>
          );

        if (showIcons) {
          console.log("languages", post.languages[0]);
        }
        return (
          <Card key={post._id} className={`${styles.card} ${className}`}>
            <div className={styles.header}>
              <div className={styles.headerleft}>
                {showIcons && post.languages[0] && (
                  <Icon
                    className={styles.icon}
                    language={post.languages[0]}
                    size={24}
                  />
                )}
                {showAuthor && author && (
                  <p className={styles.username}>
                    <span className={styles.type}>Question de </span>
                    {author}
                  </p>
                )}
                {post.language && (
                  <span className={styles.languageTag}>
                    LANGUAGE
                    {post.language}
                  </span>
                )}
              </div>
              <div className={styles.headerright}>
                <div className={styles.meta}>
                  {showStatus && (
                    <span
                      className={`${styles.status} ${
                        post.status === "published"
                          ? styles.published
                          : styles.draft
                      }`}
                    >
                      {post.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  )}
                  <time className={styles.date}>
                    {formatDate(post.createdAt)}
                  </time>

                  {showDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        if (!onDelete) return;
                        if (
                          window.confirm(
                            "Êtes-vous sûr de vouloir supprimer ce post ?"
                          )
                        )
                          onDelete(post._id);
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}

                  {showUnfollow && (
                    <button
                      className={styles.deleteBtn}
                      title="Ne plus suivre"
                      onClick={() => {
                        if (!onUnfollow) return;
                        if (window.confirm("Ne plus suivre ce post ?"))
                          onUnfollow(post._id);
                      }}
                    >
                      <FaRegBookmark size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Titre limité à 255 caractères avec module truncateInput*/}
            <h3 className={styles.title}>
              {truncateInput(post.title, maxTitle)}
            </h3>
          </Card>
        );
      })}
    </div>
  );
}
