import React from "react";
import Image from "next/image";
import styles from "../styles/Sidebar.module.css";
import TextArea from "../ui-kit/atoms/TextArea"



function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <img src="/avatar.png" className={styles.avatar} alt="avatar" />
        <h2>Dmitry Novitsky</h2>
        <div className={styles.links}>
          <a href="#">Mon compte</a> · <a href="#">Modifier ✏️</a>
        </div>
      </div>

      <div className={styles.follows}>
        <h3>Personne(s) suivi(e)s</h3>

        {[1, 2, 3].map((_, i) => (
          <div className={styles.followedUser} key={i}>
            <div className={styles.userLine}>
              <img
                src="/avatar.png"
                className={styles.smallAvatar}
                alt="avatar"
              />
              <span>Jean Bont</span>
              <span className={styles.techIcons}>JS 🧠 🗓️</span>
            </div>
            <TextArea placeholder="Notes" className={styles.notes} />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
