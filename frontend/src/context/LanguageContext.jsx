import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children, defaultLang = "az" }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("sosuslar_lang") || defaultLang
  );

  useEffect(() => {
    localStorage.setItem("sosuslar_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang] || translations.az;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
