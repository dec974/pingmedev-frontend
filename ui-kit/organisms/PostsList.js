import styles from "./PostsList.module.css";
import Link from "next/link";

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
  getHref,
  showTypeBadge = true,
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

        const typeKey = (post?.type || "").toLowerCase(); // "question" | "astuce" | ""
        const TYPE_META = {
          question: {
            prefix: "de ",
            label: "Question",
            cls: styles.badgeQuestion,
          },
          tip: {
            prefix: "de ",
            label: "Tips",
            cls: styles.badgeAstuce,
          },
        };
        const meta = TYPE_META[typeKey] ?? { prefix: "", label: null, cls: "" };
        const href =
          typeof getHref === "function" ? getHref(post) : `/posts/${post._id}`;
        const Card = ({ children, className = "" }) =>
          linkToDetail ? (
            <Link href={href} className={`${styles.postLink} ${className}`}>
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
                    size={32}
                  />
                )}
                {showAuthor && author && (
                  <p className={styles.username}>
                    {showTypeBadge && meta.label && (
                      <span className={`${styles.typeBadge} ${meta.cls}`}>
                        {meta.label}
                      </span>
                    )}
                    <span className={styles.type}>{meta.prefix}</span>
                    {author}
                  </p>
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
                      onClick={(e) => {
                        e.preventDefault(); // empêche le comportement par défaut de <Link>
                        e.stopPropagation(); // bloque la remontée du clic vers le parent

                        onDelete?.(post._id, post);
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}

                  {showUnfollow && (
                    <button
                      className={styles.deleteBtn}
                      title="Ne plus suivre"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                          onUnfollow?.(post._id, post);
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
