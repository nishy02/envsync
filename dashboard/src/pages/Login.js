import { useState } from "react";
import axios from "axios";
import "./auth.css";

function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setBanner(null);
    try {
      const res = await axios.post(
        "https://envsync-tqj1.onrender.com/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      setBanner({ type: "ok", msg: "Authentication successful. Redirecting…" });
      window.location.href = "/dashboard";
    } catch (err) {
      setBanner({ type: "fail", msg: err.response?.data?.msg || "Login failed. Check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="auth-wrap">
        <div className="term-bar">
          <div className="dots">
            <div className="dot dot-r" />
            <div className="dot dot-y" />
            <div className="dot dot-g" />
          </div>
          <div className="term-path">envsync — <span>auth/login</span></div>
        </div>

        <div className="card">
          <div className="brand">
            <div className="brand-title">env<span className="hl">sync</span></div>
            <div className="brand-sub">Secure .env distribution</div>
          </div>

          <div className="section-label">sign in</div>

          {banner && (
            <div className={`banner ${banner.type}`}>
              {banner.type === "ok" ? "✓" : "✗"} {banner.msg}
            </div>
          )}

          <div className="field">
            <div className="field-label"><span className="prompt">$</span> email</div>
            <div className="input-box">
              <input
                className={`input${errors.email ? " err" : ""}`}
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
              />
            </div>
            {errors.email && <div className="field-err">↳ {errors.email}</div>}
          </div>

          <div className="field">
            <div className="field-label"><span className="prompt">$</span> password</div>
            <div className="input-box">
              <input
                className={`input${errors.password ? " err" : ""}`}
                type={showPw ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                style={{ paddingRight: "60px" }}
              />
              <button className="pw-btn" onClick={() => setShowPw(!showPw)}>
                {showPw ? "[hide]" : "[show]"}
              </button>
            </div>
            {errors.password && <div className="field-err">↳ {errors.password}</div>}
          </div>

          <div className="row">
            <label className="check-label" onClick={() => setRemember(!remember)}>
              <div className={`check-box${remember ? " on" : ""}`}>{remember ? "✓" : ""}</div>
              remember me
            </label>
            <button className="link-btn">forgot password?</button>
          </div>

          <button className="submit" onClick={handleLogin} disabled={loading}>
            {loading ? <><div className="spinner" /> authenticating…</> : "→ sign in"}
          </button>

          <div className="footer-note">
            no account?{" "}
            <span className="accent" onClick={onSwitch}>register here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
