import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";
import Checkbox from "../ui-kit/atoms/Checkbox";

export default function Profil() {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locality, setLocality] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
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

  // Récupérer les langages depuis la route /languages
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

  // Debug: Afficher le contenu du localStorage
  useEffect(() => {
    console.log("=== DEBUG LOCALSTORAGE ===");
    console.log("token:", localStorage.getItem("token"));
    console.log("username:", localStorage.getItem("username"));
    console.log("email:", localStorage.getItem("email"));
    console.log("=== FIN DEBUG ===");
  }, []);

  const handleExperienceChange = (experience) => {
    setSelectedExperience(experience);
    console.log("Expérience sélectionnée:", experience);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log("Langage sélectionné:", language);
  };

  const handleCreateProfile = async () => {
    try {
      const token = getUserToken();

      if (!token) {
        alert("Veuillez vous connecter d'abord");
        router.push("/connexion");
        return;
      }

      if (!selectedExperience) {
        alert("Veuillez sélectionner votre niveau d'expérience");
        return;
      }

      const profileData = {
        token: token,
        experience: selectedExperience,
        selectedLanguage: selectedLanguage,
        locality: locality,
      };

      console.log("Données à envoyer:", profileData);

      const response = await fetch("http://localhost:3000/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.result) {
        console.log("Profil créé avec succès:", data.profile);
        alert("Profil créé avec succès !");
        router.push("/home");
      } else {
        console.error("Erreur:", data.error);
        alert("Erreur lors de la création du profil: " + data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error);
      alert("Erreur lors de la création du profil");
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
              <RadioItem
                key={`exp-${index}`}
                name="experience"
                value={option}
                label={option}
                selectedValue={selectedExperience}
                onChange={handleExperienceChange}
              />
            ))}
          </div>
        </div>

        <div style={{ width: "600px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1761ab" }}>
            Ton langage/technologie principal:
          </h3>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "2px solid #1761ab",
                fontSize: "16px",
                backgroundColor: "white",
                cursor: "pointer",
                width: "300px",
                minHeight: "50px",
              }}
            >
              <option value="" disabled>
                {loading
                  ? "Chargement..."
                  : "Sélectionne ton langage/techno principal"}
              </option>
              {!loading && languages.length > 0 ? (
                languages
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((lang) => (
                    <option
                      key={lang._id}
                      value={lang.name}
                      style={{
                        padding: "10px",
                        fontSize: "14px",
                      }}
                    >
                      {lang.name}
                    </option>
                  ))
              ) : !loading ? (
                <option disabled>Aucun langage disponible</option>
              ) : null}
            </select>
          </div>

          {selectedLanguage && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f0f8ff",
                borderRadius: "8px",
                textAlign: "center",
                border: "2px solid #1761ab",
              }}
            >
              <strong
                style={{ color: "#1761ab", fontSize: "16px" }}
              >{`✅ Sélectionné: ${selectedLanguage}`}</strong>
            </div>
          )}

          {/* Debug info */}
          {!loading && (
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "#666",
                textAlign: "center",
              }}
            >
              {languages.length} langages disponibles
            </div>
          )}
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
