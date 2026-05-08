import { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "https://restaurant-pos-backend-816k.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setUser(res.data.user);
    } catch (err) {
      console.error(err);

      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">
        <h1 className="text-4xl font-black mb-8">
          POS Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-zinc-200 rounded-2xl px-4 py-3"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-zinc-200 rounded-2xl px-4 py-3"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={login}
            className="w-full bg-black text-white py-3 rounded-2xl font-bold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;