import { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext";
import { api } from "./api";
import Splash from "./components/Splash";
import Header from "./components/Header";
import About from "./components/About";
import Catalog from "./components/Catalog";
import Contact from "./components/Contact";

export default function App() {
  const { lang, t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getProducts(), api.getCategories()])
      .then(([s, p, c]) => {
        setSettings(s);
        setProducts(p);
        setCategories(c);
      })
      .catch((err) => console.error("Yüklənmə xətası:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        …
      </div>
    );
  }

  const sections = [
    { id: "about", label: t.about },
    { id: "catalog", label: t.catalog },
    { id: "contact", label: t.contact }
  ];

  return (
    <>
      {showSplash && (
        <Splash
          title={settings.site_name}
          subtitle={settings[`hero_subtitle_${lang}`]}
          swipeLabel={t.swipe}
          onFinish={() => setShowSplash(false)}
        />
      )}

      <Header siteName={settings.site_name} sections={sections} />
      <About text={settings[`about_${lang}`]} />
      <Catalog products={products} categories={categories} whatsapp={settings.whatsapp} />
      <Contact settings={settings} />
    </>
  );
}
