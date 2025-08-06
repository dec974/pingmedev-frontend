import styles from "./MainLayout.module.css";
import Header from "../organisms/Header";
import Avatar from "../atoms/Avatar"
import Footer from "../organisms/Footer";

export default function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header unreadCount={3}/>
      <main className={`${styles.main} container`}>{children}</main>
      <Footer />
    </div>
  );
}
