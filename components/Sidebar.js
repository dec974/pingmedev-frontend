import styles from "../styles/Sidebar.module.css";
import TextArea from "../ui-kit/atoms/TextArea";
import Button from "../ui-kit/atoms/Button";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/router";



function Sidebar() {
  const router = useRouter();
const handleRetourClick = () => {
    router.push("/home");
  };
const handleMyAccountClick = () => {
    router.push("/myProfile");
  };
  return (
    <aside className={styles.sidebar}>
      <Button variant={"primary"} onClick={handleRetourClick}>retour</Button>
      <div className={styles.profile}>
        <img src="/avatar.png" className={styles.avatar} alt="avatar" />
        <h2 className={styles.userName}>Dmitry Novitsky</h2>
        <div className={styles.links}>
          <a href="#">
            <span onClick={handleMyAccountClick}>mon compte </span>
            <span className={styles.pencil}>
              <FaPencil />
            </span>
          </a>
        </div>

        <div className={styles.follows}>
          <h3 className={styles.followsTitle}>Personne(s) suivi(e)s</h3>

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
      </div>
    </aside>
  );
}

export default Sidebar;
