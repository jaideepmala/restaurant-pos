import { useEffect, useState } from "react";
import Login from "./pages/Login";
import POS from "./pages/POS"; // your old UI moved here

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return <POS user={user} logout={logout} />;
}

export default App;