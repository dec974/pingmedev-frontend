import React, { useState } from "react";
import styles from "../styles/UserContent.module.css";
import Button from "../ui-kit/atoms/Button";

function UserContent() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <main className={styles.userContent}>
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
          Topics suivis
        </Button>
      </div>

      <div className={styles.sort}>Du + récent au + ancien</div>

      {[1, 2].map((_, i) => (
        <div key={i} className={styles.postCard}>
          <div className={styles.cardHeader}>
            <img src="/avatar.png" className={styles.avatar} alt="avatar" />
            <div>
              <strong>John Doe</strong>
              <p>133 reviews</p>
            </div>
          </div>

          <p className={styles.content}>
            How can I calculate delta-latitude and delta-longitude values
            from...
          </p>
        </div>
      ))}
    </main>
  );
}

export default UserContent;
