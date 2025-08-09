import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/Sidebar.module.css";
import TextArea from "../ui-kit/atoms/TextArea";
import Button from "../ui-kit/atoms/Button";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();
  const username = useSelector((state) => state.user.value.username);
  const token = useSelector((state) => state.user.value.token);

  const [followedUsers, setFollowedUsers] = useState([]);

  const handleRetourClick = () => {
    router.push("/home");
  };

  const handleMyAccountClick = () => {
    router.push("/myProfile");
  };

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:3000/users/followed-users/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setFollowedUsers(data.followedUsers);
        }
      });
  }, [token]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.profilCardTop}>
          <img src="/avatar.png" className={styles.avatar} alt="avatar" />
          <Button variant={"secondary"} onClick={handleRetourClick}>
            Déconnexion
          </Button>
        </div>
        <div className={styles.profilCardBot}>
          <h2 className={styles.userName}>{username}</h2>
          <div className={styles.links}>
            <a href="#">
              <span onClick={handleMyAccountClick}>modifier mon profil </span>
              <span className={styles.pencil}>
                <FaPencil />
              </span>
            </a>
          </div>
        </div>

        <div className={styles.follows}>
          <h3 className={styles.followsTitle}>Personne(s) suivi(e)s</h3>

          {followedUsers.length === 0 ? (
            <p className={styles.noFollow}>Aucune personne suivie</p>
          ) : (
            followedUsers.map((user) => (
              <>
                <div className={styles.followedUser} key={user._id}>
                  <div className={styles.followLine}>
                    <div className={styles.userLine}>
                      <img
                        src={user.profile?.avatar || "/avatar.png"}
                        className={styles.smallAvatar}
                        alt="avatar"
                      />
                      <p className={styles.followedUsername}>{user.username}</p>
                      <span className={styles.techIcons}>
                        {/* notes */}
                        JS 🧠 🗓️
                      </span>
                    </div>
                    <div className={styles.textarea}>
                      <TextArea placeholder="Notes" rows="4" cols="" className={styles.notes} />
                    </div>
                  </div>
                </div>
              </>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
