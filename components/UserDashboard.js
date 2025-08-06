import React from "react";
import Sidebar from "./Sidebar";
import UserContent from "./UserContent";
import styles from "../styles/UserDashboard.module.css";

function UserDashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <UserContent />
    </div>
  );
}

export default UserDashboard;
