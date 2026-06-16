import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateCampaign = async () => {
    try {
      setLoading(true);

      const response = await api.post("/generate-campaign", {
        domain,
        description,
      });

      navigate("/review", {
        state: {
          emails: response.data,
        },
      });
    } catch (err) {
      console.error(err);
      alert(
        "Failed to generate outreach emails. Please check the company domain or try again later as the AI service may have reached its usage limit.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4F6",
        padding: "40px",
      }}>
      <div style={styles.container}>
        <div>
          <h1 style={styles.title}>Automated Outreach Pipeline</h1>

          <p style={styles.subtitle}>
            Enter a target company domain and describe your offering. The system will discover
            similar companies, identify decision makers, generate personalized outreach emails, and
            prepare them for review.
          </p>
        </div>

        <div>
          <div style={styles.label}>Company Domain</div>

          <input
            placeholder="stripe.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={styles.input}
          />
        </div>

        <div>
          <div style={styles.label}>Email Description</div>

          <textarea
            placeholder="Example: We help companies reduce AI infrastructure costs by up to 30% using intelligent model routing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button
          onClick={generateCampaign}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? "Generating Campaign..." : "Generate Outreach"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "60px auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: "16px",
    marginBottom: "20px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    outline: "none",
    transition: "0.2s",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    padding: "16px",
    fontSize: "16px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  button: {
    padding: "16px",
    background: "#2563EB",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

  card: {
    background: "#F9FAFB",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
  },
};

export default Dashboard;
