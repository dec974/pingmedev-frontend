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
  const [loading, setLoading] = useState(true);
  const [activeModifyType, setActiveModifyType] = useState(null); // 'username', 'password', 'email', ou null
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
        setLoading(true);
        console.log("Récupération des langages depuis /languages...");

        const response = await fetch("http://localhost:3000/languages");
        const data = await response.json();

        console.log("Réponse reçue:", data);

        if (data.result && data.data) {
          setLanguages(data.data);
          console.log(`${data.count} langages chargés:`, data.data);
        } else {
          console.error("Erreur:", data.message);
          setLanguages([]);
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
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

        // Rediriger vers la page home après 2 secondes
        setTimeout(() => {
          router.push("/home");
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

      // Validation simple d'email
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
    "Confirmé",
    "Sénior",
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

  // méthode de personnalisation de react-select
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
      <div
        {...props.innerProps}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
          backgroundColor: "#c4c8ccff",

          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: data.color,
            borderRadius: "50%",
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
            style={{
              height: "40px",
              width: "240px",
            }}
            onClick={() =>
              setActiveModifyType(
                activeModifyType === "username" ? null : "username"
              )
            }
            //style.classname n est pas prit en compte via moduleE.CSS
          >
            Modifier UserName
          </Button>
          <Button
            variant={activeModifyType === "password" ? "primary" : "secondary"}
            style={{
              height: "40px",
              width: "240px",
            }}
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
            style={{
              height: "40px",
              width: "240px",
            }}
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
                style={{
                  width: "300px",
                  height: "40px",
                }}
              />
              <Input
                type="text"
                placeholder="Confirmer nouveau nom d'utilisateur"
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
                style={{
                  width: "300px",
                  height: "40px",
                }}
              />
            </div>
            <Button
              variant="primary"
              style={{
                height: "35px",
                width: "120px",
              }}
              onClick={handleUpdateUsername}
            >
              Enregistrer
            </Button>
          </div>
        )}

        {activeModifyType === "password" && (
          <div className={styles.inputModify}>
            <div
              style={{
                display: "flex",
                gap: "50px",
              }}
            >
              <Input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: "240px",
                  height: "40px",
                }}
              />
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "240px",
                  height: "40px",
                }}
              />
              <Input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "240px",
                  height: "40px",
                }}
              />
            </div>
            <Button
              variant="primary"
              style={{
                height: "35px",
                width: "120px",
              }}
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
                style={{
                  width: "300px",
                  height: "40px",
                }}
              />
              <Input
                type="email"
                placeholder="Confirmer le nouvel email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                style={{
                  width: "300px",
                  height: "40px",
                }}
              />
            </div>
            <Button
              variant="primary"
              style={{
                height: "35px",
                width: "120px",
              }}
              onClick={handleUpdateEmail}
            >
              Enregistrer
            </Button>
          </div>
        )}

        <div className={styles.divContainer}>
          <div style={{ width: "300px" }}>
            <h3 className={styles.h3}>Expérience</h3>
            <div className={StyleSheetList.experienceContainer}>
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

          <div style={{ width: "600px" }}>
            <h3 className={styles.h3}>Actuellement sur:</h3>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "500px" }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "#1761ab",
                margin: "0",
                textAlign: "center",
              }}
            >
              Tu souhaites trouver des membres de la communauté dans ta région ?
              (optionel)
            </p>
            <Input
              type="text"
              placeholder="Inscris ta ville :"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              style={{
                width: "150px",
              }}
            />
          </div>
        </div>
        <hr className={styles.hrContainer} />

        <div className={styles.saveButtonContainer}>
          <Button
            onClick={handleCreateProfile}
            variant="primary"
            style={{
              height: "60px",
              width: "300px",
            }}
          >
            Sauvegarder ton profil
          </Button>
        </div>
      </div>

      {/* Modal simple pour les messages de confirmation */}
      {modal.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
                color:
                  modal.type === "success"
                    ? "#28a745"
                    : modal.type === "error"
                    ? "#dc3545"
                    : modal.type === "warning"
                    ? "#ffc107"
                    : "#17a2b8",
              }}
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
              <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
                {modal.title}
              </h3>
            )}

            <p
              style={{ margin: "0 0 20px 0", color: "#666", lineHeight: "1.5" }}
            >
              {modal.message}
            </p>

            <Button
              variant="primary"
              onClick={closeModal}
              style={{
                height: "40px",
                width: "100px",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
