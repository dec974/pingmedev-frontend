import { useState } from "react";

export default function Profil() {
  const [checkedItems, setCheckedItems] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
    tech1: false,
    tech2: false,
    tech3: false,
    tech4: false,
    tech5: false,
    tech6: false,
    tech7: false,
    tech8: false,
    tech9: false,
    tech10: false,
  });

  const handleCheckboxChange = (itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        Crée ton profil
      </h1>

      <hr
        style={{
          width: "60%",
          border: "none",
          borderTop: "6px solid black ",
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
        }}
      >
        <div
          style={{
            width: "300px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#333" }}>Expérience</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems.option1}
                onChange={() => handleCheckboxChange("option1")}
                style={{
                  marginRight: "10px",
                  transform: "scale(1.2)",
                }}
              />
              <span>Débutant</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems.option2}
                onChange={() => handleCheckboxChange("option2")}
                style={{
                  marginRight: "10px",
                  transform: "scale(1.2)",
                }}
              />
              <span>Junior</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems.option3}
                onChange={() => handleCheckboxChange("option3")}
                style={{
                  marginRight: "10px",
                  transform: "scale(1.2)",
                }}
              />
              <span>Confirmé</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems.option4}
                onChange={() => handleCheckboxChange("option4")}
                style={{
                  marginRight: "10px",
                  transform: "scale(1.2)",
                }}
              />
              <span>Sénior</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={checkedItems.option5}
                onChange={() => handleCheckboxChange("option5")}
                style={{
                  marginRight: "10px",
                  transform: "scale(1.2)",
                }}
              />
              <span>Mentor / Formateur</span>
            </label>
          </div>
        </div>

        <div
          style={{
            width: "600px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#333" }}>
            Actuellement sur:{" "}
          </h3>

          <div
            style={{
              display: "flex",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                flex: 1,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech1}
                  onChange={() => handleCheckboxChange("tech1")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>JavaScript</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech2}
                  onChange={() => handleCheckboxChange("tech2")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>React</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech3}
                  onChange={() => handleCheckboxChange("tech3")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>Node.js</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech4}
                  onChange={() => handleCheckboxChange("tech4")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>Python</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech5}
                  onChange={() => handleCheckboxChange("tech5")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>Docker</span>
              </label>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                flex: 1,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech6}
                  onChange={() => handleCheckboxChange("tech6")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>Vue.js</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech7}
                  onChange={() => handleCheckboxChange("tech7")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>TypeScript</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech8}
                  onChange={() => handleCheckboxChange("tech8")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>MongoDB</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech9}
                  onChange={() => handleCheckboxChange("tech9")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>AWS</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.tech10}
                  onChange={() => handleCheckboxChange("tech10")}
                  style={{
                    marginRight: "10px",
                    transform: "scale(1.2)",
                  }}
                />
                <span>Git</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
