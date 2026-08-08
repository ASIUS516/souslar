import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Header({ siteName, sections }) {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  function goTo(id) {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  }

  return (
    <>
      <header className="header">
        <span className="header__name">{siteName}</span>
        <button
          className={`header__burger${open ? " open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={t.menu}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <nav className={`nav-overlay${open ? " open" : ""}`} aria-hidden={!open}>
        {sections.map((s) => (
          <button key={s.id} className="nav-overlay__link" onClick={() => goTo(s.id)}>
            {s.label}
          </button>
        ))}
        <div className="nav-overlay__langs">
          {["az", "ru", "en"].map((l) => (
            <button
              key={l}
              className={`nav-overlay__lang${lang === l ? " active" : ""}`}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
