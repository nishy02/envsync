import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [secrets, setSecrets] = useState({});
  const token = localStorage.getItem("token");

  const fetchSecrets = async () => {
    try {
      const res = await axios.get(
        "https://envsync-tqj1.onrender.com/secrets/pull",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSecrets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  return (
    <div style={{ padding: "40px", color: "white", background: "#07090f", minHeight: "100vh" }}>
      <h2>Your Secrets</h2>

      {Object.keys(secrets).length === 0 ? (
        <p>No secrets found</p>
      ) : (
        <div>
          {Object.entries(secrets).map(([key, value]) => (
            <div key={key} style={{
              border: "1px solid #1e2733",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}>
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