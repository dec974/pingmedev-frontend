import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FaRegCommentDots } from "react-icons/fa";
import { MdGroupAdd, MdPersonRemoveAlt1 } from "react-icons/md";
import styles from "../styles/ProfilePopover.module.css";

export default function ProfilePopover({
  userIdOrUsername,
  trigger,
  onDiscuss,
  onToggleFollow,
  followedAuthor,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const open = Boolean(anchorEl);
  const router = useRouter();

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
          // On ferme seulement si on n'est pas en train de hover le popover
        setTimeout(() => {
            const popover = document.querySelector('[role="presentation"]');
            if (popover && !popover.matches(':hover')) {
                setAnchorEl(null);
            }
        }, 100);
    };

    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        if (!userIdOrUsername) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/${userIdOrUsername}`
        );

        if (!res.ok) {
          throw new Error("Utilisateur non trouvé");
        }
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3000/users/${userIdOrUsername}`);
                if (!res.ok) throw new Error("Utilisateur non trouvé");

        const data = await res.json();
        console.log("Données utilisateur :", JSON.stringify(data, null, 2));
        console.log("Experience:", data.experience);
        console.log("Location:", data.location);
        console.log("PreferredLanguages:", data.preferredLanguages);
        setUser(data);
      } catch (error) {
        console.error(error.message);
        setUser(null);
      }
    };
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error(error.message);
                setUser(null);
            }
        };

    fetchUser();
  }, [userIdOrUsername]);

    // se ferme si la souris sort
    useEffect(() => {
        if (open) {
            const handleGlobalMouseMove = (e) => {
                const popover = document.querySelector('[role="presentation"]');
                const triggerEl = anchorEl;
                
                if (popover && triggerEl) {
                    const popoverRect = popover.getBoundingClientRect();
                    const triggerRect = triggerEl.getBoundingClientRect();
                    
                    const isOverTrigger = e.clientX >= triggerRect.left && e.clientX <= triggerRect.right && e.clientY >= triggerRect.top && e.clientY <= triggerRect.bottom;
                    const isOverPopover = e.clientX >= popoverRect.left && e.clientX <= popoverRect.right && e.clientY >= popoverRect.top && e.clientY <= popoverRect.bottom;
                    
                    if (!isOverTrigger && !isOverPopover) {
                        setAnchorEl(null);
                    }
                }
            };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      return () =>
        document.removeEventListener("mousemove", handleGlobalMouseMove);
    }
  }, [open, anchorEl]);

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block", cursor: "pointer" }}
      >
        {trigger}
      </div>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                disableRestoreFocus
            >
                <Box className={styles.popoverContainer} p={2} minWidth={250}>
                    {loading && <Typography>Chargement...</Typography>}
                    {error && <Typography>{error}</Typography>}

                    {!loading && user && (
                        <div className={styles.profileContent}>
                            <Avatar src={user.avatar || ""} alt={`${user.username} avatar`} className={styles.avatar} />
                            <h3 className={styles.username}>{user.username}</h3>

                            {user.profile?.experience && <Typography>Expérience : {user.profile.experience}</Typography>}
                            {user.profile?.location && <Typography>Localisation : {user.profile.location}</Typography>}

                            {user.profile?.languages?.length > 0 && (
                                <div className={styles.languagesContainer}>
                                    <strong>Langues :</strong>
                                    <div className={styles.languagesList}>
                                        {user.profile.languages.map((lang) => (
                                            <span key={lang} className={styles.languageIcon}>{lang}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <span 
                                    className={styles.discuss} 
                                    onClick={(e) => onDiscuss(e)}
                                    style={{ cursor: "pointer", fontSize: "1.1rem" }}
                                >
                                    <FaRegCommentDots size={28} /> Discuter
                                </span>

                                <span 
                                    className={styles.followIcon} 
                                    onClick={(e) => onToggleFollow(e)} // ✅ On transmet l'événement
                                    style={{ cursor: "pointer", marginLeft: "10px" }}
                                >
                                    {followedAuthor ? (
                                        <MdPersonRemoveAlt1 size={32} color="var(--secondary-color)" />
                                    ) : (
                                        <MdGroupAdd size={32} color="var(--secondary-color)" />
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </Box>
            </Popover>
        </>
    );
}
