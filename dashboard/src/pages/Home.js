import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  .home-page {
    min-height: 100vh;
    background: #07090f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    position: relative;
    overflow: hidden;
  }

  .home-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .home-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }

  .home-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,255,136,0.06), transparent 70%);
    top: -200px; left: -200px;
  }

  .home-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(56,139,253,0.06), transparent 70%);
    bottom: -150px; right: -150px;
  }

  .home-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 24px;
    animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .home-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,255,136,0.07);
    border: 1px solid rgba(0,255,136,0.18);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 10.5px;
    color: #00ff88;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  .home-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00ff88;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .home-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(36px, 6vw, 64px);
    color: #e6edf3;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .home-title .hl { color: #00ff88; }

  .home-sub {
    font-size: 13px;
    color: #4a5568;
    max-width: 420px;
    margin: 0 auto 40px;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .home-sub .accent { color: #6e7a8a; }

  .home-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    padding: 12px 28px;
    background: #00ff88;
    color: #07090f;
    border: none;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.12s;
  }

  .btn-primary:hover { opacity: 0.88; }
  .btn-primary:active { transform: scale(0.97); }

  .btn-ghost {
    padding: 12px 28px;
    background: transparent;
    color: #6e7a8a;
    border: 1px solid #1e2733;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.18s, color 0.18s;
  }

  .btn-ghost:hover { border-color: #3a4455; color: #e6edf3; }

  .home-features {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 56px;
  }

  .feat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0d1117;
    border: 1px solid #1e2733;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 11px;
    color: #4a5568;
    letter-spacing: 0.05em;
  }

  .feat-chip-icon { font-size: 14px; }

  /* ── modal overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal-inner {
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 10;
    background: #0d1117;
    border: 1px solid #1e2733;
    border-radius: 5px;
    color: #4a5568;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 4px 9px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    letter-spacing: 0.05em;
  }

  .modal-close:hover { color: #e6edf3; border-color: #3a4455; }
`;

function Home() {
  const [mode, setMode] = useState(null); // "login" | "register" | null

  return (
    <>
      <style>{css}</style>
      <div className="home-page">
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />

        <div className="home-content">
          <div className="home-badge">
            <div className="home-badge-dot" />
            end-to-end encrypted
          </div>

          <div className="home-title">
            env<span className="hl">sync</span>
          </div>

          <div className="home-sub">
            Securely distribute <span className="accent">.env</span> files across your team.
            No plaintext. No leaks. Just encrypted, version-controlled secrets.
          </div>

          <div className="home-actions">
            <button className="btn-primary" onClick={() => setMode("login")}>
              → sign in
            </button>
            <button className="btn-ghost" onClick={() => setMode("register")}>
              create account
            </button>
          </div>

          <div className="home-features">
            <div className="feat-chip"><span className="feat-chip-icon"></span> AES-256 encryption</div>
            <div className="feat-chip"><span className="feat-chip-icon"></span> CLI sync</div>
            <div className="feat-chip"><span className="feat-chip-icon"></span> Team access control</div>
            <div className="feat-chip"><span className="feat-chip-icon"></span> Project namespaces</div>
          </div>
        </div>

        {mode && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setMode(null); }}>
            <div className="modal-inner">
              <button className="modal-close" onClick={() => setMode(null)}>[esc]</button>
              {mode === "login"
                ? <Login onSwitch={() => setMode("register")} />
                : <Register onSwitch={() => setMode("login")} />
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
