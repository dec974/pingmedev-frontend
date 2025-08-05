import styles from "./MainLayout.module.css";
import Header from "../organisms/Header";
import UserProfileCard from "../molecules/UserProfileCard"
import Footer from "../organisms/Footer";

export default function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header unreadCount={3}/>
      <UserProfileCard name="Jane Doe" avatar="/avatar.png" />
      <main className={`${styles.main} container`}>{children}</main>
      <Footer />
    </div>
  );
}
