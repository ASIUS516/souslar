import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function About({ text }) {
  const { t } = useLanguage();
  const [shown, setShown] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Запускаем печать только когда секция реально попала в область видимости
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    setShown("");
    let i = 0;
    const speed = 22;
    const interval = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <section id="about" className="about" ref={ref}>
      <span className="about__eyebrow">{t.about}</span>
      <p className="about__text">
        {shown}
        <span className="about__cursor" />
      </p>
    </section>
  );
}
