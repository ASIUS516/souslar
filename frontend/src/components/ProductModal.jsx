import { useLanguage } from "../context/LanguageContext";
import { api } from "../api";

export default function ProductModal({ product, whatsapp, onClose }) {
  const { lang, t } = useLanguage();
  if (!product) return null;

  const name = product[`name_${lang}`];
  const description = product[`description_${lang}`];

  async function handleOrder() {
    // Сохраняем заказ в базу для истории в админке (не блокирует открытие WhatsApp)
    api
      .createOrder({
        items: [{ id: product.id, name, price: product.price, qty: 1 }]
      })
      .catch(() => {});

    const message = encodeURIComponent(t.whatsappOrderText(name));
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__handle" />
        <button className="modal__close" onClick={onClose} aria-label={t.close}>
          ✕
        </button>

        <div className="modal__image-wrap">
          {product.image_url ? (
            <img src={product.image_url} alt={name} />
          ) : (
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              {name}
            </span>
          )}
        </div>

        <h2 className="modal__name">{name}</h2>

        <div className="modal__price-row">
          {product.price ? <span className="modal__price">{product.price} ₼</span> : null}
          {product.volume ? <span>{t.volume}: {product.volume}</span> : null}
          {!product.in_stock && <span>· {t.outOfStock}</span>}
        </div>

        {description && <p className="modal__desc">{description}</p>}

        <button className="btn-order" onClick={handleOrder} disabled={!product.in_stock}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.42a8.16 8.16 0 0 1 2.41 5.81c0 4.53-3.69 8.19-8.23 8.19zm4.5-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.88 2.4 1 2.56.13.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28z" />
          </svg>
          {t.orderBtn}
        </button>
      </div>
    </div>
  );
}
