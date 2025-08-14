import styles from "./PostsList.module.css";
import Link from "next/link";
import { FaTrash, FaRegBookmark } from "react-icons/fa";
import { formatDate } from "../../modules/formatDate";
import { truncateInput } from "../../modules/truncateInput";
import Icon from "../atoms/Icon.js";
import ProfilePopover from "../../components/ProfilePopover.js";

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
  const handleDiscuss = (userId) => {
    console.log("Discuter avec:", userId);
  };

  const handleToggleFollow = (userId) => {
    console.log("Toggle follow pour:", userId);
  };

  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>Aucun post à afficher.</p>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => {
        const author = post?.userId?.username ?? post?.username ?? null;
        const authorId = post?.userId?._id ?? post?.userId ?? null;

        const typeKey = (post?.type || "").toLowerCase();
        const TYPE_META = {
          question: { prefix: "de ", 
            label: "Question", 
            cls: styles.badgeQuestion },
          tip: { prefix: "de ", 
            label: "Astuce", 
            cls: styles.badgeAstuce },
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

                    <ProfilePopover
                      userIdOrUsername={authorId || author}
                      trigger={
                        <span
                          className={styles.authorName}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {author}
                        </span>
                      }
                      onDiscuss={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDiscuss(authorId || author);
                      }}
                      onToggleFollow={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFollow(authorId || author);
                      }}
                      followedAuthor={false}
                    />
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
                        e.preventDefault();
                        e.stopPropagation();
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

            <h3 className={styles.title}>
              {truncateInput(post.title, maxTitle)}
            </h3>
          </Card>
        );
      })}
    </div>
  );
}