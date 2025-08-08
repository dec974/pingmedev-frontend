import styles from "./PostsList.module.css";
import { SiJavascript, SiReact } from "react-icons/si";
import {FaTrash} from "react-icons/fa";

import moment from "moment";

const iconMap = {
  javascript: SiJavascript,
  react: SiReact,
};

export default function PostsList({ posts, showDelete = false, onDelete }) {
  // console.log("PostsList reçoit :", posts);

  if (!Array.isArray(posts) || posts.length === 0) {
    console.log("Aucun post à afficher");
    return <p>Aucun post à afficher.</p>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => {
        const Icon = iconMap[post.language] || null;
        let date = moment(post.createdAt);
        let duration = moment.duration(moment().diff(date));

        let timeAgo = "";
        if (duration.asDays() >= 15) {
          timeAgo = moment(post.createdAt).format("DD/MM/YYYY");
        } else if (duration.asDays() >= 1) {
          timeAgo = `il y a ${Math.floor(duration.asDays())}j`;
        } else if (duration.asHours() >= 1) {
          timeAgo = `il y a ${Math.floor(duration.asHours())}h`;
        } else {
          timeAgo = `il y a ${Math.floor(duration.asMinutes())}min`;
        }

        return (
          <div key={post._id} className={styles.post}>
            <div className={styles.header}>
              {Icon && <Icon className={styles.icon} />}
              <h3 className={styles.title}>{post.title}</h3>

              <div className={styles.meta}>
                <time className={styles.date}>{timeAgo}</time>
                {showDelete && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete && onDelete(post._id)}
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            </div>
            <p className={styles.content}>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}

