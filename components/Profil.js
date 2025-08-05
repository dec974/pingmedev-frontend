import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";

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
    router.push("/landingPage");
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
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checkedItems[name] || false}
        onChange={() => handleCheckboxChange(name)}
        style={{
          marginRight: "10px",
          transform: "scale(1.2)",
        }}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <h1
        style={{ marginBottom: "20px", textAlign: "center", color: "#1761ab" }}
      >
        Crée ton profil
      </h1>

      <hr
        style={{
          width: "60%",
          border: "none",
          borderTop: "6px solid #1761ab",
          marginBottom: "30px",
          margin: "0 auto 30px auto",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "50px",
        }}
      >
        <div style={{ width: "300px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1761ab" }}>Expérience</h3>
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
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
