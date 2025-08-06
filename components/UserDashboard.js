import React from "react";
import Sidebar from "./Sidebar";
import UserContent from "./UserContent";
import styles from "../styles/UserDashboard.module.css";
import MainLayout from "../ui-kit/template/MainLayout"

function UserDashboard() {
  return (
    <MainLayout className={styles.dashboard}>
      <Sidebar />
      <UserContent />
    </MainLayout>
  );
}

export default UserDashboard;
