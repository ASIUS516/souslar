import { useLanguage } from "../context/LanguageContext";

export default function ProductCard({ product, onClick }) {
  const { lang, t } = useLanguage();
  const name = product[`name_${lang}`];

  return (
    <button className="card" onClick={() => onClick(product)}>
      <div className={`card__image-wrap${!product.image_url ? " placeholder" : ""}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={name} loading="lazy" />
        ) : (
          name?.slice(0, 1)
        )}
      </div>
      <span className="card__name">{name}</span>
      <div className="card__meta">
        {product.price ? (
          <span className="card__price">{product.price} ₼</span>
        ) : (
          <span />
        )}
        {!product.in_stock && <span className="card__stock">{t.outOfStock}</span>}
      </div>
    </button>
  );
}
