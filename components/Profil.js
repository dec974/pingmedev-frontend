import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../ui-kit/atoms/Button";
import styles from "../styles/Profil.module.css";

export default function Profil() {
  const [selectedExperience, setSelectedExperience] = useState("");
  const [locality, setLocality] = useState("");
  const router = useRouter();

  const handleExperienceChange = (experience) => {
    setSelectedExperience(experience);
  };

  const handleCreateProfile = () => {
    router.push("/home");
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
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="typescript">TypeScript</option>
              </select>

              <select
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
                <option value="next">Next.js</option>
                <option value="nuxt">Nuxt.js</option>
              </select>

              <select
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="nodejs">Node.js</option>
                <option value="express">Express.js</option>
                <option value="django">Django</option>
                <option value="flask">Flask</option>
                <option value="laravel">Laravel</option>
                <option value="spring">Spring Boot</option>
              </select>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <select
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="mongodb">MongoDB</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="redis">Redis</option>
                <option value="firebase">Firebase</option>
              </select>

              <select
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="docker">Docker</option>
                <option value="aws">AWS</option>
                <option value="vercel">Vercel</option>
                <option value="netlify">Netlify</option>
                <option value="git">Git/GitHub</option>
                <option value="vscode">VS Code</option>
              </select>

              <select
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                <option value="graphql">GraphQL</option>
                <option value="tailwind">Tailwind CSS</option>
                <option value="bootstrap">Bootstrap</option>
                <option value="sass">Sass/SCSS</option>
                <option value="webpack">Webpack</option>
                <option value="jest">Jest</option>
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
