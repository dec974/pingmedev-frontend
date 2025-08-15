import { useState, useEffect, useRef } from "react";
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
    const closeTimer = useRef();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const open = Boolean(anchorEl);
    const router = useRouter();

    // Hover sur le trigger
    const handleTriggerMouseEnter = (event) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setAnchorEl(event.currentTarget);
    };
    const handleTriggerMouseLeave = () => {
        closeTimer.current = setTimeout(() => setAnchorEl(null), 600);
    };

    // Hover sur la popover
    const handlePopoverMouseEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    const handlePopoverMouseLeave = () => {
        closeTimer.current = setTimeout(() => setAnchorEl(null), 600);
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
                        const res = await fetch(
                            `http://localhost:3000/users/${userIdOrUsername}`
                        );
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

    return (
        <>
            <div
                onMouseEnter={handleTriggerMouseEnter}
                onMouseLeave={handleTriggerMouseLeave}
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
                slotProps={{
                    paper: {
                        onMouseEnter: handlePopoverMouseEnter,
                        onMouseLeave: handlePopoverMouseLeave,
                        style: { pointerEvents: "auto" },
                    },
                }}
            >
                <Box className={styles.popoverContainer} p={2} minWidth={250}>
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
                                <Typography>Localisation : {user.profile.location}</Typography>
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
                                    onClick={(e) => onDiscuss(e)}
                                    style={{ cursor: "pointer", fontSize: "1.1rem" }}
                                >
                                    <FaRegCommentDots size={28} /> Discuter
                                </span>

                                <span
                                    className={styles.followIcon}
                                    onClick={(e) => onToggleFollow(e)}
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
