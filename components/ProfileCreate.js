import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Checkbox from "../ui-kit/atoms/Checkbox";

export default function Profil() {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locality, setLocality] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

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
      return token;
    }
    console.log("Aucun token trouvé");
    return null;
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);

        const response = await fetch("https://pingmedev-backend.vercel.app/languages");
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

      const response = await fetch("https://pingmedev-backend.vercel.app/users/profile", {
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
          "Votre profil a été créé avec succès ! Redirection en cours...",
          "success"
        );

        setTimeout(() => {
          router.push("/home");
        }, 1200);
      } else {
        console.error("Erreur:", data.error);
        showModal(
          "Erreur",
          "Erreur lors de la création: " + (data.error || "Erreur inconnue"),
          "error"
        );
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
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img className={styles.img} src="/logo.png" alt="Logo" />
      </div>

      <h1 className={styles.h1}>Crée ton profil</h1>

      <hr className={styles.hrContainer} />

      <div className={styles.divContainer}>
        <div style={{ width: "300px" }}>
          <h3 className={styles.h3}>Expérience</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
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
          <h3 className={styles.languageTitle}>Actuellement sur:</h3>

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
          <input
            type="text"
            placeholder="Inscris ta ville :"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className={styles.localityInput}
          />
        </div>
      </div>

      <div className={styles.createButtonContainer}>
        <Button
          onClick={handleCreateProfile}
          variant="primary"
          className={styles.createButton}
        >
          Créer ton profil
        </Button>
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
    </div>
  );
}
