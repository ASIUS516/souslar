import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function Catalog({ products, categories, whatsapp }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category_id === activeCategory;
      const name = (p[`name_${lang}`] || "").toLowerCase();
      const matchesSearch = name.includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search, lang]);

  return (
    <section id="catalog" className="catalog">
      <h2 className="catalog__heading">{t.catalog}</h2>

      <div className="catalog__controls">
        <input
          className="catalog__search"
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {categories.length > 0 && (
          <div className="catalog__chips">
            <button
              className={`chip${activeCategory === "all" ? " active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              {t.allCategories}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`chip${activeCategory === c.id ? " active" : ""}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c[`name_${lang}`]}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="catalog__empty">{t.noProducts}</p>
      ) : (
        <div className="catalog__grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={setSelected} />
          ))}
        </div>
      )}

      <ProductModal
        product={selected}
        whatsapp={whatsapp}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
