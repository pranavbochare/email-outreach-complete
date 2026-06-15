import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function ReviewEmails() {
  const location = useLocation();
  const navigate = useNavigate();

  const emails = location.state?.emails || [];

  const navigateBack = () => navigate("/");

  const [subject, setSubject] = useState(emails[0]?.subject || "");

  const [body, setBody] = useState(emails[0]?.body || "");

  const [loading, setLoading] = useState(false);

  const sendEmails = async () => {
    try {
      setLoading(true);

      const updatedEmails = emails.map((email) => ({
        ...email,
        subject,
        body,
      }));

      const response = await api.post("/send-campaign", {
        emails: updatedEmails,
      });

      navigate("/success", {
        state: response.data,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send emails");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Review Outreach Email</h1>

          <p style={styles.subtitle}>
            Review and edit the email before sending it to all discovered contacts.
          </p>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h2>{emails.length}</h2>
            <p>Recipients</p>
          </div>

          <div style={styles.statCard}>
            <h2>{new Set(emails.map((email) => email.company)).size}</h2>
            <p>Companies</p>
          </div>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>Subject</label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Email Body</label>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.secondaryButton} onClick={navigateBack}>
            Back
          </button>

          <button
            style={{
              ...styles.primaryButton,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
            onClick={sendEmails}>
            {loading ? "Sending Emails..." : `Send To ${emails.length} Contacts`}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    padding: "40px",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: "16px",
  },

  statsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    flex: 1,
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    marginBottom: "24px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "350px",
    padding: "16px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    resize: "vertical",
    fontSize: "15px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },

  primaryButton: {
    padding: "14px 28px",
    border: "none",
    borderRadius: "12px",
    background: "#2563EB",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "14px 28px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default ReviewEmails;
