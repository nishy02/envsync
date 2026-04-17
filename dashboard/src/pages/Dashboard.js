import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .dash-page {
    min-height: 100vh;
    background: #07090f;
    font-family: 'JetBrains Mono', monospace;
    position: relative;
    overflow-x: hidden;
  }

  .dash-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .dash-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }

  .dash-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,255,136,0.05), transparent 70%);
    top: -200px; right: -100px;
  }

  .dash-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    border-bottom: 1px solid #1e2733;
  }

  .dash-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    color: #e6edf3;
    letter-spacing: -0.03em;
  }

  .dash-logo span { color: #00ff88; }

  .dash-nav {
    display: flex;
    gap: 8px;
  }

  .dash-nav-btn {
    background: transparent;
    border: 1px solid #1e2733;
    border-radius: 6px;
    color: #6e7a8a;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 7px 14px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    text-transform: uppercase;
  }

  .dash-nav-btn:hover { color: #e6edf3; border-color: #3a4455; }
  .dash-nav-btn.active { color: #00ff88; border-color: rgba(0,255,136,0.3); }

  .dash-body {
    position: relative;
    z-index: 1;
    padding: 40px;
    max-width: 900px;
  }

  .dash-project-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .dash-project-name {
    font-size: 13px;
    color: #e6edf3;
  }

  .dash-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(0,255,136,0.07);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 10px;
    color: #00ff88;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .dash-role-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #00ff88;
  }

  .dash-section-label {
    font-size: 10px;
    color: #3a4455;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
  }

  .dash-secret-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0d1117;
    border: 1px solid #1e2733;
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 8px;
    transition: border-color 0.15s;
  }

  .dash-secret-card:hover { border-color: #2a3545; }

  .dash-secret-key {
    font-size: 12px;
    color: #00ff88;
    letter-spacing: 0.05em;
  }

  .dash-secret-value {
    font-size: 12px;
    color: #4a5568;
    letter-spacing: 0.03em;
  }

  .dash-empty {
    color: #3a4455;
    font-size: 12px;
    padding: 40px 0;
    text-align: center;
    border: 1px dashed #1e2733;
    border-radius: 8px;
  }
`;

function Dashboard() {
  const [secrets, setSecrets] = useState({});
  const [project, setProject] = useState(null);
  const [revealed, setRevealed] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/secrets/pull`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setSecrets(res.data.secrets || {});
      setProject(res.data.project || null);
    }).catch(console.error);
  }, [token]);

  function toggleReveal(key) {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <style>{css}</style>
      <div className="dash-page">
        <div className="dash-orb dash-orb-1" />

        <header className="dash-header">
          <div className="dash-logo">env<span>sync</span></div>
          <nav className="dash-nav">
            <button className="dash-nav-btn active">secrets</button>
            <button className="dash-nav-btn" onClick={() => window.location.href = "/logs"}>logs</button>
            <button className="dash-nav-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>logout</button>
          </nav>
        </header>

        <div className="dash-body">
          {project && (
            <div className="dash-project-bar">
              <span className="dash-project-name">{project.name}</span>
              <span className="dash-role-badge">
                <span className="dash-role-dot" />
                {project.role}
              </span>
            </div>
          )}

          <div className="dash-section-label">
            {Object.keys(secrets).length} secret{Object.keys(secrets).length !== 1 ? "s" : ""}
          </div>

          {Object.keys(secrets).length === 0 ? (
            <div className="dash-empty">
              no secrets yet — push a .env file using the CLI
            </div>
          ) : (
            Object.entries(secrets).map(([key, value]) => (
              <div className="dash-secret-card" key={key}>
                <span className="dash-secret-key">{key}</span>
                <span className="dash-secret-value" style={{ cursor: "pointer" }} onClick={() => toggleReveal(key)}>
                  {revealed[key] ? value : "••••••••"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
