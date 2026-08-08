import { useState, useEffect } from "react";
import { api } from "../api";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function AdminApp() {
  const [auth, setAuth] = useState(null); // null = загрузка, false = не авторизован, {username} = авторизован

  useEffect(() => {
    api.me().then((res) => {
      setAuth(res.isAdmin ? { username: res.username } : false);
    });
  }, []);

  if (auth === null) return <div className="admin-loading">…</div>;

  if (!auth) {
    return <Login onSuccess={() => api.me().then((res) => setAuth({ username: res.username }))} />;
  }

  return <Dashboard username={auth.username} onLogout={() => setAuth(false)} />;
}
