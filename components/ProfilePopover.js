import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "../styles/ProfilePopover.module.css";
import { FaRegCommentDots } from "react-icons/fa";
import { MdGroupAdd, MdPersonRemoveAlt1 } from "react-icons/md";

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

  // sert à éviter que la fermeture ne soit immédiate
  const hoverTimeoutRef = useRef(null);
  const anchorRef = useRef(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  // la souris entre sur le trigger
  const handleMouseEnter = (event) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    anchorRef.current = event.currentTarget;
    setAnchorEl(event.currentTarget);
  };

  // la souris quitte le trigger
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
      hoverTimeoutRef.current = null;
    }, 150); // petit délai pour éviter le clignotement
  };

  //la souris entre dans le popover = on annule la fermeture
  const handlePopoverMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (anchorRef.current) setAnchorEl(anchorRef.current);
  };

  //la souris quitte le popover = on ferme
  const handlePopoverMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleClose = () => setAnchorEl(null);

  const handleDiscussClick = () => {
    if (user?.username) router.push(`/messenger`);
  };

  useEffect(() => {
    if (!userIdOrUsername) return;

    console.log("userIdOrUsername reçu :", userIdOrUsername);

    const fetchUser = async () => {
      try {
        // On pointe sur le backend (port 3000)
        const res = await fetch(
          `http://localhost:3000/users/${userIdOrUsername}`
        );

        if (!res.ok) {
          throw new Error("Utilisateur non trouvé");
        }

        const data = await res.json();
        console.log("Données utilisateur :", data);
        setUser(data);
      } catch (error) {
        console.error(error.message);
        setUser(null);
      }
    };

    fetchUser();
  }, [userIdOrUsername]);

  return (
    <>
      {/* trigger */}
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
        <Box
          className={styles.popoverContainer}
          p={2}
          minWidth={250}
          // on garde ouvert si la souris est dessus
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          {loading && <Typography>Chargement...</Typography>}
          {error && <Typography>{error}</Typography>}

          {!loading && user && (
            <div className={styles.profileContent}>
              <Avatar
                src={user.avatar || ""}
                alt={`${user.username} avatar`}
                className={styles.avatar}
              />
              <h3 className={styles.username}>{user.username}</h3>
              {user.profile?.experience && (
                <Typography>Expérience : {user.profile.experience}</Typography>
              )}
              {user.profile?.location && (
                <Typography>{user.profile.location}</Typography>
              )}
              {user.profile?.languages?.length > 0 && (
                <div className={styles.languagesContainer}>
                  <strong>Langues :</strong>
                  <div className={styles.languagesList}>
                    {user.profile.languages.map((lang) => (
                      <span key={lang} className={styles.languageIcon}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.actions}>
                <span
                  className={styles.discuss}
                  onClick={onDiscuss}
                  style={{ cursor: "pointer", fontSize: "1.1rem" }}
                >
                  <FaRegCommentDots size={28} />
                  Discuter
                </span>

                <span
                  className={styles.followIcon}
                  onClick={onToggleFollow}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                >
                  {followedAuthor ? (
                    <MdPersonRemoveAlt1
                      size={32}
                      color="var(--secondary-color)"
                    />
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
