import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import { LanguageProvider } from "./context/LanguageContext";
import "./styles/index.css";
import "./styles/admin.css";

// Простой роутинг без библиотек: /admin открывает панель, всё остальное — сайт
const isAdmin = window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? (
      <AdminApp />
    ) : (
      <LanguageProvider defaultLang="az">
        <App />
      </LanguageProvider>
    )}
  </React.StrictMode>
);
