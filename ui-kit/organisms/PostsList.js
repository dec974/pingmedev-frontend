import styles from "./PostsList.module.css";
import { SiJavascript, SiReact } from "react-icons/si";

const iconMap = {
  javascript: SiJavascript,
  react: SiReact,
};

export default function PostsList({ posts }) {
  return (
    <div className={styles.list}>
      {posts.map((post) => {
        const Icon = iconMap[post.language] || null;
        return (
          <div key={post.id} className={styles.post}>
            <div className={styles.header}>
              {Icon && <Icon className={styles.icon} />}
              <h3 className={styles.title}>{post.title}</h3>

              <div className={styles.meta}>
                <span className={styles.username}>@{post.username}</span>
                <time className={styles.date}>{post.timeAgo}</time>
              </div>
            </div>
            <p className={styles.content}>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}
