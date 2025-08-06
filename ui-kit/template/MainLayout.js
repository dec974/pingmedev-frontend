import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import styles from "../template/MainLayout.module.css";

export default function MainLayout({ children, className }) {
  return (
    <div>
      <Header unreadCount={3} />
      <div className={className}>{children}</div>
      <Footer />
    </div>
  );
}

