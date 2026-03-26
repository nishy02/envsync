import { useEffect, useState } from "react";
import axios from "axios";

function Logs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        "https://envsync-tqj1.onrender.com/secrets/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    fetchLogs();
    }, [token]);

  return (
    <div style={{ padding: "40px", background: "#07090f", minHeight: "100vh", color: "white" }}>
      <h2>Audit Logs 📜</h2>

      {logs.length === 0 ? (
        <p>No logs yet</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} style={{
            border: "1px solid #1e2733",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}>
            <strong>{log.action}</strong> — Project {log.project_id}  
            <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Logs;