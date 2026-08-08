import { useState } from "react";
import { api } from "../api";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1 className="admin-login__title">Sosuslar admin</h1>
        <label className="admin-field">
          <span>İstifadəçi adı</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="admin-field">
          <span>Şifrə</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? "..." : "Daxil ol"}
        </button>
      </form>
    </div>
  );
}
