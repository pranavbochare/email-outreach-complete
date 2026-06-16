import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function ReviewEmails() {
  const location = useLocation();
  const navigate = useNavigate();

  const emails = location.state?.emails || [];

  const [editableEmails, setEditableEmails] = useState(emails);
  const [loading, setLoading] = useState(false);

  const navigateBack = () => navigate("/");

  const API = import.meta.env.VITE_API_URL || "https://email-outreach-complete.vercel.app";

  const updateSubject = (index, value) => {
    const updated = [...editableEmails];
    updated[index] = {
      ...updated[index],
      subject: value,
    };
    setEditableEmails(updated);
  };

  const updateBody = (index, value) => {
    const updated = [...editableEmails];
    updated[index] = {
      ...updated[index],
      body: value,
    };
    setEditableEmails(updated);
  };

  const sendEmails = async () => {
    try {
      setLoading(true);

      const response = await api.post(`${API}/send-campaign`, {
        emails: editableEmails,
      });

      navigate("/success", {
        state: response.data,
      });
    } catch (err) {
      console.error("Failed to send emails:", err);
      alert(
        "Failed to generate outreach emails. Please check the company domain or try again later as the AI service may have reached its usage limit.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Review Outreach Emails</h1>

          <p style={styles.subtitle}>Review and edit each email before sending.</p>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h2>{editableEmails.length}</h2>
            <p>Recipients</p>
          </div>

          <div style={styles.statCard}>
            <h2>
              {new Set(editableEmails.map((email) => email.company || "Unknown Company")).size}
            </h2>
            <p>Companies</p>
          </div>
        </div>

        {editableEmails.length === 0 ? (
          <div style={styles.emptyCard}>
            <h3>No Emails Found</h3>
            <p>Please go back and generate emails first.</p>
          </div>
        ) : (
          editableEmails.map((email, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.emailHeader}>
                <h3 style={styles.emailTitle}>{email.company || "Unknown Company"}</h3>

                <span style={styles.emailNumber}>Email #{index + 1}</span>
              </div>

              <label style={styles.label}>Recipient</label>
              <input
                type="text"
                value={email.name || ""}
                readOnly
                style={{
                  ...styles.input,
                  backgroundColor: "#F9FAFB",
                  cursor: "not-allowed",
                }}
              />

              <label style={styles.label}>Subject</label>
              <input
                type="text"
                value={email.subject || ""}
                onChange={(e) => updateSubject(index, e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Email Body</label>
              <textarea
                value={email.body || ""}
                onChange={(e) => updateBody(index, e.target.value)}
                style={styles.textarea}
              />
            </div>
          ))
        )}

        <div style={styles.buttonContainer}>
          <button style={styles.secondaryButton} onClick={navigateBack} disabled={loading}>
            Back
          </button>

          <button
            style={{
              ...styles.primaryButton,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading || editableEmails.length === 0}
            onClick={sendEmails}>
            {loading ? "Sending Emails..." : `Send To ${editableEmails.length} Contacts`}
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
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  emptyCard: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  emailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  emailTitle: {
    margin: 0,
    color: "#111827",
  },

  emailNumber: {
    background: "#DBEAFE",
    color: "#1D4ED8",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    marginTop: "15px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "250px",
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
    marginBottom: "40px",
  },

  primaryButton: {
    padding: "14px 28px",
    border: "none",
    borderRadius: "12px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "14px 28px",
    border: "1px solid #D1D5DB",
    borderRadius: "12px",
    background: "#FFFFFF",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default ReviewEmails;
