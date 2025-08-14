import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../reducers/user.js";
import styles from "../styles/Sidebar.module.css";
import TextArea from "../ui-kit/atoms/TextArea";
import Button from "../ui-kit/atoms/Button";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/router";
import Icon from "../ui-kit/atoms/Icon.js";
import { PiKeyReturnLight } from "react-icons/pi";


function Sidebar() {
  const router = useRouter();
  const username = useSelector((state) => state.user.value.username);
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);
  const [followedUsers, setFollowedUsers] = useState([]);

  const handleDisconnectUser = () => {
    dispatch(signOut());
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
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

    // Met à jour la note localement dans followedUsers
  const handleNoteChange = (e, followId) => {
    const newNote = e.target.value;
    setFollowedUsers((prev) =>
      prev.map((u) =>
        u._id === followId ? { ...u, internalNote: newNote } : u
      )
    );
  };

  // Soumet la note au backend
  const handleSubmitNote = (e, followId) => {
    e.preventDefault();
    const note = followedUsers.find((u) => u._id === followId)?.internalNote || "";
    console.log("Note submitted:", note, "for user ID:", followId);
    fetch(`http://localhost:3000/follows/users/${user.id}/${followId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ internalNote: note }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          console.log("Note updated successfully");
          alert("Note mise à jour avec succès !");
        } else {
          console.error("Failed to update note:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
  };

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
                    <p className={styles.followedUsername}>
                      {u.following.username}
                    </p>

                    <span className={styles.techBadgesRow}>
                      {Array.isArray(u.profile?.languages) &&
                      
                        u.profile.languages.map((lang, i) => (
                          
                         <span
                         
                              key={
                                (typeof lang === "string" ? lang : lang?._id) ||
                                i
                              }
                              className={styles.langPill}
                            >
                              {typeof lang === "string" ? lang : lang?.name}
                            </span>
                        ))}
                    </span>
                  </div>

                  <div className={styles.textarea}>
                    <form onSubmit={(e) => handleSubmitNote(e, u._id)}>
                      <TextArea
                        placeholder="Notes"
                        rows={4}
                        className={styles.notes}
                        value={u.internalNote || ""}
                        onChange={(e) => handleNoteChange(e, u._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            e.target.form && e.target.form.requestSubmit();
                          }
                        }}
                      />
                      <div style={{ fontSize: "0.65em", color: "#888", marginTop: 4 }}>
                        <b>Shift + Entrée</b> <PiKeyReturnLight size={18}/>
                      </div>
                    </form>
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
