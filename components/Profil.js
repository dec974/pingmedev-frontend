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
  const [selectedLanguage, setSelectedLanguage] = useState([]); // ✅ Changer en tableau
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
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
        alert("Erreur  " + data.error);
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

  const RadioItem = ({ name, label, value, selectedValue, onChange }) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        style={{ margin: 0 }}
      />
      <span>{label}</span>
    </label>
  );

  const languageOptions = languages
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((lang) => ({
      value: lang.name,
      label: lang.name,
      color: lang.color || "#1761ab",
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
      color: "#1761ab",
      fontWeight: "500",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "#1761ab",
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

        <div style={{ width: "600px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1761ab" }}>
            Actuellement sur:
          </h3>

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
          <input
            type="text"
            placeholder="localité :"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "150px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "0",
          right: "0",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handleCreateProfile}
          variant="primary"
          style={{
            height: "60px",
            width: "200px",
            fontSize: "18px",
          }}
        >
          Créer ton profil
        </Button>
      </div>
    </div>
  );
}
