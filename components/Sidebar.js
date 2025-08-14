import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../reducers/user.js";
import styles from "../styles/Sidebar.module.css";
import TextArea from "../ui-kit/atoms/TextArea";
import Button from "../ui-kit/atoms/Button";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/router";
import Icon from "../ui-kit/atoms/Icon.js";



function Sidebar() {
  const router = useRouter();
  const username = useSelector((state) => state.user.value.username);
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [followedUsers, setFollowedUsers] = useState([]);

  const handleDisconnectUser = () => {
    dispatch(signOut());
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    router.replace("/");
  };

  const handleMyAccountClick = () => {
    router.push("/myProfile");
  };

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:3000/follows/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setFollowedUsers(data.follows);
        }
      });
  }, [token]);

  useEffect(() => {
    console.log(
      "followedUsers sample:",
      JSON.stringify(followedUsers[0]?.profile?.languages, null, 2)
    );
  }, [followedUsers]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.profilCardTop}>
          <img src="/avatar.png" className={styles.avatar} alt="avatar" />
          <Button variant={"secondary"} onClick={handleDisconnectUser}>
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
            followedUsers.map((u) => (
              <div className={styles.followedUser} key={u._id}>
                <div className={styles.followLine}>
                  <div className={styles.userLine}>
                    <img
                      src={u.profile?.avatar || "/avatar.png"}
                      className={styles.smallAvatar}
                      alt="avatar"
                    />
                    <p className={styles.followedUsername}>{u.following.username}</p>

                    <span className={styles.techIcons}>
                      {Array.isArray(u.profile?.languages) &&
                        u.profile.languages.map((lang, i) => (
                          <Icon
                            key={lang?._id || i}
                            language={lang} // { icon, color, name }
                            size={16}
                            className={styles.techIcon}
                          />
                        ))}
                    </span>
                  </div>

                  <div className={styles.textarea}>
                    <TextArea
                      placeholder="Notes"
                      rows={4}
                      className={styles.notes}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
