import React, {useEffect, useState} from "react";
import styles from "../styles/ProfileModal.module.css"

export default function ProfileModal({ isOpen, onClose, userId }) {

    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        if (!isOpen || !user.token || !userId) return;

        setLoading(true);
        fetch("http://localhost:3000/users/" + userId)
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur chargement utilisateur :", err);
            setLoading(false);
        })
    }, [isOpen, userId]);
    
    if(!isOpen) return null;
    

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {loading && <p>Chargement...</p>}

            {!loading && user && (
                <>
                <img
                    src={user.avatar}
                    alt={`${user.username} avatar`}
                    className={styles.avatar}
                />
                <h3>{user.username}</h3>
                {user.profile.experience && <p>Expérience : {user.profile.experience}</p>}
                {user.location && <p> {user.location}</p>}
                

                <div className={styles.languagesContainer}>
                    <strong>Languages :</strong>
                    <div className={styles.languagesList}>
                    {user.languages.map((lang) => (
                        <span key={lang} className={styles.languageIcon}>
                        {lang}
                        </span>
                    ))}
                </div>
                <div className={styles.messenger}>
                    <span>Discuter</span>
                </div>
                <div className={styles.messenger}>
                    <span>Suivre</span>
                </div>
            </div>
            </>
            )}

            <button onClick={onClose} className={styles.closeBtn}>
                X
            </button>
            </div>
        </div>
    );
}