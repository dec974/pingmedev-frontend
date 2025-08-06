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
        if (duration.asDays() >= 15) {
          timeAgo = moment(post.createdAt).format('DD/MM/YYYY');
        }else if (duration.asDays() >= 1 && duration.asDays() < 15) {
          // Si + d'un jour, afficher en jours
          timeAgo = `il y a ${Math.floor(duration.asDays())}j`;
        } else if (duration.asHours() >= 1) { 
          // Si + d'une heure, afficher en heures
          timeAgo = `il y a ${Math.floor(duration.asHours())}h`;
        } else { 
          // Sinon afficher les minutes
          timeAgo = `il y a ${Math.floor(duration.asMinutes())}min`;
        }
                
                
        return (
          <div key={post.id} className={styles.post}>
            <div className={styles.header}>
              {Icon && <Icon className={styles.icon} />}
              <h3 className={styles.title}>{post.title}</h3>

              <div className={styles.meta}>
                <span className={styles.username}>@{post.userId.username}</span>
                {/*affichage du temps calculté avec timeAgo*/}
                <time className={styles.date}>{timeAgo}</time>
              </div>
            </div>
            <p className={styles.content}>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}
