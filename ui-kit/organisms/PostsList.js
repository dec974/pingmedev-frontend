import styles from "./PostsList.module.css";
import { SiJavascript, SiReact } from "react-icons/si";

import moment from 'moment';



const iconMap = {
  javascript: SiJavascript,
  react: SiReact,
};

export default function PostsList({ posts }) {
  return (
    <div className={styles.list}>
      {posts.map((post) => {
        const Icon = iconMap[post.language] || null;

        //calcul de la durée depuis la création du post
        let date = moment(post.createdAt);
        let now = moment();
        let duration = moment.duration(now.diff(date));
      
        //formatage du temps
        let timeAgo = '';
        if (duration.asDays() >= 1) {
          // Si + d'un jour, afficher en jours
          timeAgo = `${Math.floor(duration.asDays())}j`;
        } else if (duration.asHours() >= 1) { // Correction : else if sur une seule ligne
          // Si + d'une heure, afficher en heures
          timeAgo = `${Math.floor(duration.asHours())}h`;
        } else { // Correction : else sur une seule ligne
          // Sinon afficher les minutes
          timeAgo = `${Math.floor(duration.asMinutes())}min`;
        }
                
                
        return (
          <div key={post.id} className={styles.post}>
            <div className={styles.header}>
              {Icon && <Icon className={styles.icon} />}
              <h3 className={styles.title}>{post.title}</h3>

              <div className={styles.meta}>
                <span className={styles.username}>@{post.userId.username}</span>
                {/*affichage du temps calculté avec timeAgo*/}
                <time className={styles.date}>il y a {timeAgo}</time>
              </div>
            </div>
            <p className={styles.content}>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}
