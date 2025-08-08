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
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailInputs, setShowEmailInputs] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const router = useRouter();

  // Fonction pour récupérer le token utilisateur
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
        alert("Veuillez sélectionner votre niveau d'expérience");
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
        router.push("/home");
      } else {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur ", error);
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
            variant={showUsernameInput ? "primary" : "secondary"}
            style={{
              height: "40px",
              width: "240px",
            }}
            onClick={() => setShowUsernameInput(!showUsernameInput)}
            //style.classname n est pas prit en compte via moduleE.CSS
          >
            Modifier UserName
          </Button>
          <Button
            variant={showPasswordInputs ? "primary" : "secondary"}
            style={{
              height: "40px",
              width: "240px",
            }}
            onClick={() => setShowPasswordInputs(!showPasswordInputs)}
          >
            Modifier Mot de passe
          </Button>
          <Button
            variant={showEmailInputs ? "primary" : "secondary"}
            style={{
              height: "40px",
              width: "240px",
            }}
            onClick={() => setShowEmailInputs(!showEmailInputs)}
          >
            Modifier Email
          </Button>
        </div>

        {showUsernameInput && (
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
            >
              Enregistrer
            </Button>
          </div>
        )}

        {showPasswordInputs && (
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
            >
              Enregistrer
            </Button>
          </div>
        )}

        {showEmailInputs && (
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
    </>
  );
}
