import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";
import Checkbox from "../ui-kit/atoms/Checkbox";

export default function Profil() {
  const [checkedItems, setCheckedItems] = useState({});
  const router = useRouter();

  const handleCheckboxChange = (itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleCreateProfile = () => {
    router.push("/home");
    //a modifier avec la homePage des que prete
  };

  const experienceOptions = [
    "Débutant",
    "Junior",
    "Confirmé",
    "Sénior",
    "Mentor / Formateur",
  ];

  const techOptions = [
    "JavaScript",
    "Vue.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Python",
    "AWS",
    "Docker",
    "Git",
  ];

  const CheckboxItem = ({ name, label }) => (
    <Checkbox
      label={label}
      checked={checkedItems[name] || false}
      onChange={() => handleCheckboxChange(name)}
    />
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
              <CheckboxItem
                key={`exp-${index}`}
                name={`experience-${index}`}
                label={option}
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
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {techOptions.slice(0, 5).map((tech, index) => (
                <CheckboxItem
                  key={`tech-${index}`}
                  name={`tech-${index}`}
                  label={tech}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {techOptions.slice(5, 10).map((tech, index) => (
                <CheckboxItem
                  key={`tech-${index + 5}`}
                  name={`tech-${index + 5}`}
                  label={tech}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          onClick={handleCreateProfile}
          variant="primary"
          style={{
            height: "60px",
            width: "200px",
            fontSize: "18px",
            marginRight: "15px",
            marginBottom: "20px",
          }}
        >
          Créer ton profil
        </Button>
      </div>
    </div>
  );
}
