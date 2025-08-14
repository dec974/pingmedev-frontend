const Button = ({
  active,
  children,
  onMouseDown,
  disabled = false,
  ...props
}) => {
  return (
    <button
      {...props}
      onMouseDown={onMouseDown}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        margin: "2px",
        border: "1px solid #ccc",
        backgroundColor: active ? "#e0e0e0" : "#fff",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.target.style.backgroundColor = "#f5f5f5";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.target.style.backgroundColor = "#fff";
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
