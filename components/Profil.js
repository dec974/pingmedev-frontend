import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";
import Checkbox from "../ui-kit/atoms/Checkbox";

export default function Profil() {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locality, setLocality] = useState("");
  const [selectedTech, setSelectedTech] = useState({
    language: "",
    frontend: "",
    backend: "",
    database: "",
    tool: "",
    other: "",
  });
  const router = useRouter();

  // Fonction pour récupérer le token utilisateur
  const getUserToken = () => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token récupéré:", token);
      return token;
    }

    console.log("Aucun token trouvé");
    return null;
  };

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

  const handleTechChange = (category, value) => {
    setSelectedTech((prev) => ({
      ...prev,
      [category]: value,
    }));
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
        token: token, // Envoyer le token au lieu de l'userId
        experience: selectedExperience,
        selectedTech: selectedTech,
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
            Actuellement sur:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <select
                value={selectedTech.language}
                onChange={(e) => handleTechChange("language", e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>
                  Langage principal
                </option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="typescript">TypeScript</option>
              </select>
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
