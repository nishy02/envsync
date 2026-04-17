import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

function Dashboard() {
  const [secrets, setSecrets] = useState({});
  const [project, setProject] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/secrets/pull`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSecrets(res.data.secrets || {});
        setProject(res.data.project || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSecrets();
  }, [token]);

  return (
    <div style={{ padding: "40px", color: "white", background: "#07090f", minHeight: "100vh" }}>
      <h2>Your Secrets</h2>
      {project && <p style={{ color: "#8b98a7" }}>Project: {project.name} ({project.role})</p>}

      {Object.keys(secrets).length === 0 ? (
        <p>No secrets found</p>
      ) : (
        <div>
          {Object.entries(secrets).map(([key, value]) => (
            <div
              key={key}
              style={{
                border: "1px solid #1e2733",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <strong>{key}</strong>: {value}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => window.location.href = "/logs"}>
        View Logs
      </button>
    </div>
  );
}

export default Dashboard;
