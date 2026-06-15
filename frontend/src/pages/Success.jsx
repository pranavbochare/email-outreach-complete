import { useLocation, useNavigate } from "react-router-dom";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✓</div>

        <h1 style={styles.title}>Campaign Completed</h1>

        <p style={styles.subtitle}>Your outreach campaign has been processed successfully.</p>

        <div style={styles.noteBox}>
          <h3 style={styles.noteTitle}>Important Note</h3>

          <p style={styles.noteText}>
            To manage API and email delivery costs, the current demo version is limited to:
          </p>

          <ul style={styles.list}>
            <li>Maximum 1 lookalike companies</li>
            <li>Maximum 1 decision-makers per company</li>
          </ul>

          <p style={styles.noteText}>We are going to increase these limits in the future.</p>
        </div>

        <button style={styles.button} onClick={() => navigate("/")}>
          Start New Campaign
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },

  icon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#22C55E",
    color: "#FFFFFF",
    fontSize: "42px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "36px",
    color: "#111827",
    fontWeight: "700",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: "12px",
    marginBottom: "30px",
    fontSize: "16px",
  },

  noteBox: {
    background: "#FFFBEB",
    border: "1px solid #FCD34D",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
    marginBottom: "30px",
  },

  noteTitle: {
    margin: 0,
    marginBottom: "12px",
    color: "#92400E",
    fontSize: "18px",
  },

  noteText: {
    color: "#78350F",
    lineHeight: "1.6",
    margin: "8px 0",
  },

  list: {
    color: "#78350F",
    marginTop: "10px",
    marginBottom: "10px",
    paddingLeft: "20px",
    lineHeight: "1.8",
  },

  button: {
    padding: "14px 28px",
    border: "none",
    borderRadius: "12px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Success;
