import { useEffect, useState } from "react";
import Login from "./pages/Login";
import POS from "./pages/POS";
import Kitchen from "./pages/Kitchen";
import MenuAdmin from "./pages/MenuAdmin";
import StaffAdmin from "./pages/StaffAdmin";
import RestaurantSettings from "./pages/RestaurantSettings";

function AppShell({ user, logout }) {
  const [view, setView] = useState(user.role === "kitchen" ? "kitchen" : "pos");
  const isAdmin = user.role === "admin";

  if (user.role === "kitchen") {
    return <Kitchen user={user} logout={logout} />;
  }

  return (
    <>
      <style>{`
        .app-tabs {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: center; gap: 8px; padding: 10px;
          background: #09070d; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .app-tab {
          height: 38px; padding: 0 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.68); background: rgba(255,255,255,0.06);
          font-weight: 900; cursor: pointer;
        }
        .app-tab.active { color: #150d06; background: #ffd166; }
        .admin-wrap {
          min-height: 100vh; padding: 18px; color: #fff;
          background:
            linear-gradient(135deg, rgba(245,166,35,0.12), transparent 30%),
            linear-gradient(225deg, rgba(0,229,204,0.12), transparent 28%),
            #09070d;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .admin-shell { width: min(1320px, 100%); margin: 0 auto; }
        .admin-head {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          margin-bottom: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px; background: rgba(255,255,255,0.055);
        }
        .admin-head h1 { margin: 0; color: #fff; font-size: 24px; }
        .admin-head p { margin: 4px 0 0; color: rgba(255,255,255,0.48); }
      `}</style>
      <nav className="app-tabs">
        <button className={`app-tab ${view === "pos" ? "active" : ""}`} onClick={() => setView("pos")}>POS</button>
        {isAdmin && (
          <>
            <button className={`app-tab ${view === "kitchen" ? "active" : ""}`} onClick={() => setView("kitchen")}>Kitchen</button>
            <button className={`app-tab ${view === "menu" ? "active" : ""}`} onClick={() => setView("menu")}>Menu Admin</button>
            <button className={`app-tab ${view === "staff" ? "active" : ""}`} onClick={() => setView("staff")}>Staff</button>
            <button className={`app-tab ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}>Settings</button>
          </>
        )}
        <button className="app-tab" onClick={logout}>Logout</button>
      </nav>
      {view === "pos" && <POS user={user} logout={logout} />}
      {view === "kitchen" && <Kitchen user={user} logout={logout} />}
      {view === "menu" && (
        <div className="admin-wrap">
          <main className="admin-shell">
            <header className="admin-head">
              <div>
                <h1>Menu Admin</h1>
                <p>Create and manage this restaurant's menu.</p>
              </div>
            </header>
            <MenuAdmin />
          </main>
        </div>
      )}
      {view === "staff" && (
        <div className="admin-wrap"><main className="admin-shell"><header className="admin-head"><div><h1>Staff</h1><p>Create cashier and kitchen users for this restaurant.</p></div></header><StaffAdmin /></main></div>
      )}
      {view === "settings" && (
        <div className="admin-wrap"><main className="admin-shell"><header className="admin-head"><div><h1>Settings</h1><p>Control billing defaults and tables for this restaurant.</p></div></header><RestaurantSettings /></main></div>
      )}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login setUser={setUser} />;

  return <AppShell user={user} logout={logout} />;
}

export default App;
