import HeaderLanding from "../ui-kit/organisms/HeaderLanding";
export default function Home() {
  return (
    <>  
    <HeaderLanding />
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
        }}
      >
        <img
          src="/landingImage.png"
          alt="Landing Image"
          style={{
            maxWidth:
              window.innerWidth < 768
                ? //768px est la limite entre phone/tablette et ecran pc
                  "600px"
                : "1000px",
            height: "auto",
          }}
        />
      </div>
    </div></>
  
  );
}
