type PlusButtonProps = {
  onClick: () => void;
};

export default function PlusButton({ onClick }: PlusButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#000000",
        color: "#ffffff",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "20px",
        lineHeight: "1",
      }}
    >
      +
    </button>
  );
}
