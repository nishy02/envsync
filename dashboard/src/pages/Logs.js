import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

const ACTION_COLORS = {
  PUSH: "#00ff88",
  PULL: "#388bfd",
  CREATE_PROJECT: "#e3b341",
  SHARE_EDITOR: "#bc8cff",
  SHARE_VIEWER: "#bc8cff",
};

function Logs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/secrets/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setLogs(res.data)).catch(console.error);
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'JetBrains Mono', monospace" }}>
      {/* header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 40px", borderBottom: "1px solid #1e2733" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "#e6edf3", letterSpacing: "-0.03em" }}>
          env<span style={{ color: "#00ff88" }}>sync</span>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          {[["secrets", "/dashboard"], ["logs", null]].map(([label, href]) => (
            <button key={label} onClick={() => href && (window.location.href = href)}
              style={{ background: "transparent", border: `1px solid ${!href ? "rgba(0,255,136,0.3)" : "#1e2733"}`, borderRadius: 6, color: !href ? "#00ff88" : "#6e7a8a", fontFamily: "inherit", fontSize: 11, letterSpacing: "0.08em", padding: "7px 14px", cursor: "pointer", textTransform: "uppercase" }}>
              {label}
            </button>
          ))}
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            style={{ background: "transparent", border: "1px solid #1e2733", borderRadius: 6, color: "#6e7a8a", fontFamily: "inherit", fontSize: 11, letterSpacing: "0.08em", padding: "7px 14px", cursor: "pointer", textTransform: "uppercase" }}>
            logout
          </button>
        </nav>
      </header>

      {/* body */}
      <div style={{ padding: "40px", maxWidth: 900 }}>
        <div style={{ fontSize: 10, color: "#3a4455", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
          {logs.length} event{logs.length !== 1 ? "s" : ""}
        </div>

        {logs.length === 0 ? (
          <div style={{ color: "#3a4455", fontSize: 12, padding: "40px 0", textAlign: "center", border: "1px dashed #1e2733", borderRadius: 8 }}>
            no activity yet
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d1117", border: "1px solid #1e2733", borderRadius: 8, padding: "14px 18px", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: ACTION_COLORS[log.action] || "#6e7a8a", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {log.action}
              </span>
              <span style={{ fontSize: 11, color: "#3a4455" }}>project #{log.project_id}</span>
              <span style={{ fontSize: 10, color: "#2a3545" }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Logs;
