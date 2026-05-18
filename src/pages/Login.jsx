import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

function Login({ setUser }) {
  const [mode, setMode] = useState("login");
  const [restaurantName, setRestaurantName] = useState("Jaideep Bistro");
  const [ownerName, setOwnerName] = useState("Jaideep");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const storeSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post(API_BASE + "/auth/login", {
        email,
        password,
      });
      storeSession(res.data);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signupRestaurant = async () => {
    try {
      setLoading(true);
      const res = await axios.post(API_BASE + "/auth/signup-restaurant", {
        restaurantName,
        ownerName,
        email,
        password,
      });
      storeSession(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Restaurant signup failed");
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pos-root {
          font-family: 'DM Sans', sans-serif;
          background: #080510;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* Animated mesh background */
        .pos-bg {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(245,166,35,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255,78,26,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 50% 70% at 70% 5%, rgba(0,229,204,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(120,40,200,0.2) 0%, transparent 60%),
            #080510;
          animation: bgShift 12s ease-in-out infinite alternate;
        }
        @keyframes bgShift {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(20deg); }
        }

        /* Grain overlay */
        .pos-grain {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* Floating orbs */
        .pos-orb {
          position: fixed; border-radius: 50%; filter: blur(80px);
          pointer-events: none; z-index: 0; animation: orbFloat 8s ease-in-out infinite;
        }
        .pos-orb1 { width: 300px; height: 300px; background: rgba(245,166,35,0.15); top: -80px; left: -80px; animation-delay: 0s; }
        .pos-orb2 { width: 250px; height: 250px; background: rgba(255,78,26,0.18); bottom: -60px; right: -60px; animation-delay: -3s; }
        .pos-orb3 { width: 200px; height: 200px; background: rgba(0,229,204,0.12); top: 40%; right: 5%; animation-delay: -5s; }
        .pos-orb4 { width: 180px; height: 180px; background: rgba(120,40,200,0.15); bottom: 15%; left: 5%; animation-delay: -2s; }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-30px) scale(1.08); }
        }

        /* Wrapper */
        .pos-wrapper {
          position: relative; z-index: 10;
          display: flex; align-items: stretch;
          width: min(960px, 95vw);
          animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Left panel */
        .pos-left {
          flex: 1; padding: 56px 48px;
          display: flex; flex-direction: column; justify-content: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          border-radius: 32px 0 0 32px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          min-height: 600px;
          position: relative; overflow: hidden;
        }
        .pos-left::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,166,35,0.6), transparent);
        }

        .pos-brand-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 44px;
        }
        .pos-icon-wrap {
          width: 52px; height: 52px; border-radius: 16px; font-size: 24px;
          background: linear-gradient(135deg, #F5A623 0%, #FF4E1A 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 32px rgba(245,166,35,0.5), 0 0 60px rgba(245,166,35,0.2);
          animation: glowPulse 3s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 32px rgba(245,166,35,0.5), 0 0 60px rgba(245,166,35,0.2); }
          50%      { box-shadow: 0 0 48px rgba(245,166,35,0.8), 0 0 90px rgba(245,166,35,0.35); }
        }
        .pos-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 900; letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 30%, #FFD166);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .pos-tagline {
          font-size: 11px; font-weight: 500; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 2px;
        }

        .pos-headline {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 900; line-height: 1.08;
          color: #fff; margin-bottom: 16px; letter-spacing: -1px;
        }
        .pos-headline span {
          background: linear-gradient(90deg, #F5A623, #FF4E1A);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .pos-sub {
          color: rgba(255,255,255,0.45); font-size: 15px; line-height: 1.7;
          max-width: 320px; margin-bottom: 40px;
        }

        .pos-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .pos-pill {
          padding: 8px 16px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 500;
          backdrop-filter: blur(8px);
          transition: all 0.2s; cursor: default;
        }
        .pos-pill:hover {
          border-color: #F5A623; color: #FFD166;
          background: rgba(245,166,35,0.08);
        }

        .pos-status { display: flex; align-items: center; gap: 7px; margin-top: 40px; }
        .pos-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
          box-shadow: 0 0 10px rgba(34,197,94,0.8);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .pos-status-text {
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* Vertical divider */
        .pos-vdivider {
          width: 1px; flex-shrink: 0; align-self: stretch;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent);
        }

        /* Right panel */
        .pos-right {
          width: 380px; flex-shrink: 0;
          padding: 48px 40px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0 32px 32px 0;
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(32px);
          min-height: 600px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }
        .pos-right::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,229,204,0.5), transparent);
        }

        .pos-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px;
        }
        .pos-form-sub {
          font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 36px;
        }

        .pos-mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 6px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
          margin-bottom: 24px;
        }
        .pos-mode-btn {
          border: 0;
          border-radius: 12px;
          padding: 10px 12px;
          color: rgba(255,255,255,0.52);
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pos-mode-btn.active {
          color: #130d05;
          background: linear-gradient(135deg, #FFD166, #F5A623);
          box-shadow: 0 10px 24px rgba(245,166,35,0.22);
        }

        /* Demo badge */
        .pos-demo {
          background: linear-gradient(135deg, rgba(245,166,35,0.15), rgba(255,78,26,0.1));
          border: 1px solid rgba(245,166,35,0.3);
          border-radius: 16px; padding: 14px 18px; margin-bottom: 28px;
        }
        .pos-demo-title {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #F5A623;
          margin-bottom: 8px;
        }
        .pos-demo-creds { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.9; }
        .pos-demo-creds strong { color: rgba(255,255,255,0.9); font-weight: 500; }

        /* Fields */
        .pos-field { margin-bottom: 16px; }
        .pos-label {
          display: block;
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px;
        }
        .pos-input-wrap { position: relative; }
        .pos-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 15px; pointer-events: none;
        }
        .pos-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 16px 14px 44px;
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: all 0.25s;
        }
        .pos-input::placeholder { color: rgba(255,255,255,0.25); }
        .pos-input:focus {
          border-color: #F5A623;
          background: rgba(245,166,35,0.07);
          box-shadow: 0 0 0 3px rgba(245,166,35,0.15), 0 0 20px rgba(245,166,35,0.1);
        }

        /* Button */
        .pos-btn {
          width: 100%; padding: 16px; margin-top: 24px;
          border: none; border-radius: 14px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #fff;
          background: linear-gradient(135deg, #F5A623 0%, #FF4E1A 60%, #c0392b 100%);
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.3s;
          box-shadow: 0 4px 32px rgba(245,166,35,0.35), 0 0 60px rgba(255,78,26,0.2);
        }
        .pos-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          border-radius: inherit;
        }
        .pos-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer { 0% { left: -100%; } 60%,100% { left: 150%; } }
        .pos-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 40px rgba(245,166,35,0.5), 0 0 80px rgba(255,78,26,0.3);
        }
        .pos-btn:active:not(:disabled) { transform: scale(0.98); }
        .pos-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .pos-footer {
          text-align: center; font-size: 12px;
          color: rgba(255,255,255,0.25); margin-top: 20px;
        }
        .pos-footer strong { color: #00E5CC; font-weight: 500; }

        @media (max-width: 720px) {
          .pos-left, .pos-vdivider { display: none; }
          .pos-right { width: 100%; border-radius: 28px; min-height: unset; }
        }
      `}</style>

      <div className="pos-root">
        <div className="pos-bg" />
        <div className="pos-grain" />
        <div className="pos-orb pos-orb1" />
        <div className="pos-orb pos-orb2" />
        <div className="pos-orb pos-orb3" />
        <div className="pos-orb pos-orb4" />

        <div className="pos-wrapper">
          {/* ── LEFT PANEL ── */}
          <div className="pos-left">
            <div className="pos-brand-row">
              <div className="pos-icon-wrap">🍽️</div>
              <div>
                <div className="pos-brand-name">POS Bistro</div>
                <div className="pos-tagline">Restaurant Management</div>
              </div>
            </div>

            <h1 className="pos-headline">
              Run your<br />restaurant<br /><span>effortlessly.</span>
            </h1>
            <p className="pos-sub">
              A blazing-fast point-of-sale system built for the modern kitchen —
              orders, tables, and analytics all in one place.
            </p>

            <div className="pos-pills">
              {["⚡ Real-time Orders", "📊 Live Analytics", "🪑 Table Management", "☁️ Cloud Native", "🧾 Smart Billing"].map((p) => (
                <div key={p} className="pos-pill">{p}</div>
              ))}
            </div>

            <div className="pos-status">
              <div className="pos-status-dot" />
              <div className="pos-status-text">All Systems Operational</div>
            </div>
          </div>

          <div className="pos-vdivider" />

          {/* ── RIGHT PANEL ── */}
          <div className="pos-right">
            <div className="pos-form-title">
              {isSignup ? "Create restaurant" : "Welcome back"}
            </div>
            <div className="pos-form-sub">
              {isSignup
                ? "Start a new POS workspace in seconds"
                : "Sign in to your dashboard"}
            </div>

            <div className="pos-mode-switch">
              <button
                className={`pos-mode-btn ${!isSignup ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
              <button
                className={`pos-mode-btn ${isSignup ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Create
              </button>
            </div>

            {!isSignup && (
              <div className="pos-demo">
              <div className="pos-demo-title">✦ Demo Access</div>
              <div className="pos-demo-creds">
                <strong>admin@test.com</strong><br />
                password: <strong>123456</strong>
              </div>
              </div>
            )}

            {isSignup && (
              <>
                <div className="pos-field">
                  <label className="pos-label">Restaurant Name</label>
                  <div className="pos-input-wrap">
                    <span className="pos-input-icon">🍽️</span>
                    <input
                      className="pos-input"
                      type="text"
                      placeholder="Jaideep Bistro"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pos-field">
                  <label className="pos-label">Owner Name</label>
                  <div className="pos-input-wrap">
                    <span className="pos-input-icon">👤</span>
                    <input
                      className="pos-input"
                      type="text"
                      placeholder="Restaurant owner"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pos-field">
              <label className="pos-label">Email Address</label>
              <div className="pos-input-wrap">
                <span className="pos-input-icon">✉</span>
                <input
                  className="pos-input"
                  type="email"
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pos-field">
              <label className="pos-label">Password</label>
              <div className="pos-input-wrap">
                <span className="pos-input-icon">🔒</span>
                <input
                  className="pos-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="pos-btn"
              onClick={isSignup ? signupRestaurant : login}
              disabled={loading}
            >
              {loading
                ? isSignup
                  ? "Creating restaurant…"
                  : "Signing in…"
                : isSignup
                  ? "Create Restaurant →"
                  : "Login to Dashboard →"}
            </button>

            <div className="pos-footer">
              {isSignup ? "Creates an admin account for your restaurant" : "Secured by "}
              {!isSignup && <strong>256-bit encryption</strong>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;