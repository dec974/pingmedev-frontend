import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import styles from "../styles/ProfilePopover.module.css";

export default function ProfilePopover({ userIdOrUsername, trigger }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const open = Boolean(anchorEl);
    const router = useRouter();

    const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
const handleMouseLeave = () => setAnchorEl(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        if (!open || !userIdOrUsername) return;

        setLoading(true);
        fetch(`http://localhost:3000/api/user/${userIdOrUsername}`)
        .then((res) => {
            if (!res.ok) throw new Error("Utilisateur non trouvé");
            return res.json();
        })
        .then((data) => {
            setUser(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Erreur chargement utilisateur :", err);
            setUser(null);
            setLoading(false);
        });
    }, [open, userIdOrUsername]);

    return (
        <>
        <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer" }}
        >
            {trigger}
        </span>

        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Box className={styles.popoverContainer} p={2} minWidth={250}>
            {loading && <Typography>Chargement...</Typography>}

            {!loading && user && (
                <div className={styles.profileContent}>
                <Avatar
                    src={user.avatar || ""}
                    alt={`${user.username} avatar`}
                    className={styles.avatar}
                />
                <h3 
                    className={styles.username}
                >
                    {user.username}
                </h3>

                {user.profile?.experience && (
                    <Typography>Expérience : {user.profile.experience}</Typography>
                )}
                {user.profile?.location && (
                    <Typography>{user.profile.location}</Typography>
                )}

                {user.profile?.languages?.length > 0 && (
                    <div 
                        className={styles.languagesContainer}
                    >
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

                <div 
                    className={styles.actions}
                >
                    <span
                        className={styles.discuss}
                        onClick={handleDiscussClick}
                        style={{ cursor: "pointer" }}
                    >
                            💬 Discuter
                    </span>

                    <PersonAddAltIcon 
                        className={styles.followIcon}
                        fontSize="small"
                    />
                </div>
                </div>
            )}

            {!loading && !user && (
                <Typography>Utilisateur non trouvé ou erreur de chargement</Typography>
            )}
            </Box>
        </Popover>
        </>
    );
}