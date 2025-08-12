import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Checkbox from "../ui-kit/atoms/Checkbox";
import Input from "../ui-kit/atoms/Input";
import Header from "../ui-kit/organisms/Header";

export default function Profil() {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locality, setLocality] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activeModifyType, setActiveModifyType] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const router = useRouter();

  const showModal = (title, message, type = "info") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
    });
  };

  const getUserToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token récupéré:", token);
      return token;
    }
    console.log("Aucun token trouvé");
    return null;
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:3000/languages");
        const data = await response.json();
        if (data.result && data.data) {
          setLanguages(data.data);
        } else {
          console.error("Erreur:", data.message);
          setLanguages([]);
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
        setLanguages([]);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getUserToken();
        if (!token) return;

        const response = await fetch(`http://localhost:3000/users/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("log de data user experience:", data.user.experience);
        console.log("log de data user locality:", data.user.locality);
        if (data.result && data.user) {
          const expValue = experienceOptions.find(
            (opt) => opt.toLowerCase() === data.user.experience?.toLowerCase()
          );
          if (expValue) {
            setSelectedExperience(expValue);
          }
          setLocality(data.user.locality || "");
          if (Array.isArray(data.user.languages)) {
            const langsMapped = data.user.languages.map((name) => {
              const foundLang = languages.find((l) => l.name === name);
              return {
                value: name,
                label: name,
                color: foundLang?.color || "var(--primary-color)",
                icon: foundLang?.icon,
              };
            });
            setSelectedLanguage(langsMapped);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleExperienceChange = (experience) => {
    setSelectedExperience(experience);
  };

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguage(selectedOptions || []);
  };

  const handleCreateProfile = async () => {
    try {
      const token = getUserToken();

      if (!selectedExperience) {
        showModal(
          "Expérience requise",
          "Veuillez sélectionner votre niveau d'expérience",
          "warning"
        );
        return;
      }

      const profileData = {
        token: token,
        experience: selectedExperience,
        selectedLanguage: selectedLanguage.map((lang) => lang.value),
        locality: locality,
      };

      const response = await fetch("http://localhost:3000/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.result) {
        showModal(
          "Succès !",
          "Votre profil a été mis à jour avec succès ! Redirection en cours...",
          "success"
        );

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        showModal(
          "Erreur",
          "Erreur lors de la sauvegarde: " + (data.error || "Erreur inconnue"),
          "error"
        );
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      showModal(
        "Erreur de connexion",
        "Impossible de se connecter au serveur. Veuillez réessayer.",
        "error"
      );
    }
  };

  const handleUpdateUsername = async () => {
    try {
      const token = getUserToken();

      if (!newUsername.trim()) {
        showModal(
          "Champ requis",
          "Veuillez entrer un nouveau nom d'utilisateur",
          "warning"
        );
        return;
      }

      if (newUsername !== confirmUsername) {
        showModal(
          "Erreur de saisie",
          "Les noms d'utilisateur ne correspondent pas",
          "warning"
        );
        return;
      }

      const updateData = {
        token: token,
        newUsername: newUsername,
      };

      const response = await fetch(
        "http://localhost:3000/users/update-username",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (data.result) {
        showModal(
          "Succès !",
          "Votre nom d'utilisateur a été mis à jour avec succès !",
          "success"
        );
        setNewUsername("");
        setConfirmUsername("");
        setActiveModifyType(null);
      } else {
        showModal(
          "Erreur",
          "Erreur lors de la mise à jour: " + (data.error || data.message),
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du nom d'utilisateur:",
        error
      );
      showModal(
        "Erreur de connexion",
        "Impossible de se connecter au serveur. Veuillez réessayer.",
        "error"
      );
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const token = getUserToken();

      if (
        !currentPassword.trim() ||
        !newPassword.trim() ||
        !confirmPassword.trim()
      ) {
        showModal(
          "Champs requis",
          "Veuillez remplir tous les champs de mot de passe",
          "warning"
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        showModal(
          "Erreur de saisie",
          "Les nouveaux mots de passe ne correspondent pas",
          "warning"
        );
        return;
      }

      if (newPassword.length < 6) {
        showModal(
          "Mot de passe trop court",
          "Le nouveau mot de passe doit contenir au moins 6 caractères",
          "warning"
        );
        return;
      }

      const updateData = {
        token: token,
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      const response = await fetch(
        "http://localhost:3000/users/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (data.result) {
        showModal(
          "Succès !",
          "Votre mot de passe a été mis à jour avec succès !",
          "success"
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveModifyType(null);
      } else {
        showModal(
          "Erreur",
          "Erreur lors de la mise à jour: " + (data.error || data.message),
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      showModal(
        "Erreur de connexion",
        "Impossible de se connecter au serveur. Veuillez réessayer.",
        "error"
      );
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const token = getUserToken();

      if (!newEmail.trim() || !confirmEmail.trim()) {
        showModal(
          "Champs requis",
          "Veuillez remplir tous les champs d'email",
          "warning"
        );
        return;
      }

      if (newEmail !== confirmEmail) {
        showModal(
          "Erreur de saisie",
          "Les nouveaux emails ne correspondent pas",
          "warning"
        );
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        showModal(
          "Email invalide",
          "Veuillez entrer une adresse email valide",
          "warning"
        );
        return;
      }

      const updateData = {
        token: token,
        newEmail: newEmail,
      };

      const response = await fetch("http://localhost:3000/users/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.result) {
        showModal(
          "Succès !",
          "Votre email a été mis à jour avec succès !",
          "success"
        );
        setNewEmail("");
        setConfirmEmail("");
        setActiveModifyType(null);
      } else {
        showModal(
          "Erreur",
          "Erreur lors de la mise à jour: " + (data.error || data.message),
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error);
      showModal(
        "Erreur de connexion",
        "Impossible de se connecter au serveur. Veuillez réessayer.",
        "error"
      );
    }
  };

  const experienceOptions = [
    "Junior",
    "Confirme",
    "Senior",
    "Autodidacte",
    "Mentor / Formateur",
  ];

  const languageOptions = languages
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((lang) => ({
      value: lang.name,
      label: lang.name,
      color: lang.color || "var(--primary-color)",
      icon: lang.icon,
    }));

  // méthode de personnalisation de react-select la en dessous
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "10px",
      borderRadius: "8px",
      fontSize: "16px",
      minHeight: "50px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#666",
      fontSize: "16px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--primary-color)",
      fontWeight: "500",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--primary-color)",
      color: "#333",
      padding: "12px 20px",
      fontSize: "14px",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      border: "1px solid #e1e5e9",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
  };

  const CustomOption = ({ children, ...props }) => {
    const { data } = props;
    return (
      <div {...props.innerProps} className={styles.customOption}>
        <div
          className={styles.colorDot}
          style={{
            backgroundColor: data.color,
          }}
        />
        <span>{children}</span>
      </div>
    );
  };

  const animatedComponents = makeAnimated();

  return (
    <>
      <Header />

      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <img className={styles.img} src="/logo.png" alt="Logo" />
        </div>

        <h1 className={styles.h1}>Modifie ton profil</h1>
        <hr className={styles.hrContainer} />

        <div className={styles.buttonModify}>
          <Button
            variant={activeModifyType === "username" ? "primary" : "secondary"}
            className={styles.modifyButton}
            onClick={() =>
              setActiveModifyType(
                activeModifyType === "username" ? null : "username"
              )
            }
          >
            Modifier UserName
          </Button>
          <Button
            variant={activeModifyType === "password" ? "primary" : "secondary"}
            className={styles.modifyButton}
            onClick={() =>
              setActiveModifyType(
                activeModifyType === "password" ? null : "password"
              )
            }
          >
            Modifier Mot de passe
          </Button>
          <Button
            variant={activeModifyType === "email" ? "primary" : "secondary"}
            className={styles.modifyButtonEmail}
            onClick={() =>
              setActiveModifyType(activeModifyType === "email" ? null : "email")
            }
          >
            Modifier Email
          </Button>
        </div>

        {activeModifyType === "username" && (
          <div className={styles.inputModify}>
            <div className={styles.inputContainer}>
              <Input
                type="text"
                placeholder="Nouveau nom d'utilisateur"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={styles.inputEmail}
              />
              <Input
                type="text"
                placeholder="Confirmer nouveau nom d'utilisateur"
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
                className={styles.inputEmail}
              />
            </div>
            <Button
              variant="primary"
              className={styles.saveButton}
              onClick={handleUpdateUsername}
            >
              Enregistrer
            </Button>
          </div>
        )}

        {activeModifyType === "password" && (
          <div className={styles.inputModify}>
            <div className={styles.inputContainerPassword}>
              <Input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.inputPassword}
              />
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.inputPassword}
              />
              <Input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputPassword}
              />
            </div>
            <Button
              variant="primary"
              className={styles.saveButton}
              onClick={handleUpdatePassword}
            >
              Enregistrer
            </Button>
          </div>
        )}

        {activeModifyType === "email" && (
          <div className={styles.inputModify}>
            <div className={styles.inputContainer}>
              <Input
                type="email"
                placeholder="Nouvel email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={styles.inputEmail}
              />
              <Input
                type="email"
                placeholder="Confirmer le nouvel email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className={styles.inputEmail}
              />
            </div>
            <Button
              variant="primary"
              className={styles.saveButton}
              onClick={handleUpdateEmail}
            >
              Enregistrer
            </Button>
          </div>
        )}

        <div className={styles.divContainer}>
          <div className={styles.selectContainer300}>
            <h3 className={styles.h3}>Expérience</h3>
            <div className={styles.experienceContainer}>
              {experienceOptions.map((option, index) => (
                <Checkbox
                  key={`exp-${index}`}
                  label={option}
                  checked={selectedExperience === option}
                  onChange={() => handleExperienceChange(option)}
                />
              ))}
            </div>
          </div>

          <div className={styles.selectContainer600}>
            <h3 className={styles.h3}>Actuellement sur:</h3>

            <div className={styles.selectCenterContainer}>
              <div className={styles.selectContainer500}>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  options={languageOptions}
                  styles={customStyles}
                  components={{ ...animatedComponents, Option: CustomOption }}
                  placeholder={"Sélectionne tes langages"}
                  isClearable={true}
                  isMulti={true}
                  closeMenuOnSelect={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.localityContainer}>
            <p className={styles.localityText}>
              Tu souhaites trouver des membres de la communauté dans ta région ?
              (optionel)
            </p>
            <Input
              type="text"
              placeholder="Inscris ta ville :"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className={styles.localityInput}
            />
          </div>
        </div>
        <hr className={styles.hrContainer} />

        <div className={styles.saveButtonContainer}>
          <Button
            onClick={handleCreateProfile}
            variant="primary"
            className={styles.saveProfileButton}
          >
            Sauvegarder ton profil
          </Button>
        </div>
      </div>

      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.modalIcon} ${
                modal.type === "success"
                  ? styles.modalIconSuccess
                  : modal.type === "error"
                  ? styles.modalIconError
                  : modal.type === "warning"
                  ? styles.modalIconWarning
                  : styles.modalIconInfo
              }`}
            >
              {modal.type === "success"
                ? "✓"
                : modal.type === "error"
                ? "✕"
                : modal.type === "warning"
                ? "⚠"
                : "ℹ"}
            </div>

            {modal.title && (
              <h3 className={styles.modalTitle}>{modal.title}</h3>
            )}

            <p className={styles.modalMessage}>{modal.message}</p>

            <Button
              variant="primary"
              onClick={closeModal}
              className={styles.modalButton}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
