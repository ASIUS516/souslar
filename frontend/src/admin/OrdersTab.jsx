import { useState } from "react";
import { api, API_URL } from "../api";

const STATUSES = [
  { key: "new", label: "Yeni" },
  { key: "processing", label: "İcra olunur" },
  { key: "done", label: "Tamamlandı" },
  { key: "cancelled", label: "Ləğv edildi" }
];

export default function OrdersTab({ orders, onChange }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function handleStatusChange(id, status) {
    await api.updateOrderStatus(id, status);
    const updated = await api.getOrders();
    onChange(updated);
  }

  async function handleDelete(id) {
    if (!confirm("Bu sifarişi silmək istədiyinizə əminsiniz?")) return;
    await api.deleteOrder(id);
    const updated = await api.getOrders();
    onChange(updated);
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header-row">
        <h2 className="admin-panel__title">Sifarişlər</h2>
        <a
          className="admin-btn admin-btn--small"
          href={`${API_URL}/orders/export/csv`}
          target="_blank"
          rel="noreferrer"
        >
          CSV yüklə
        </a>
      </div>

      <div className="admin-filter-chips">
        <button className={`admin-chip${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>
          Hamısı
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            className={`admin-chip${filter === s.key ? " active" : ""}`}
            onClick={() => setFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="admin-list">
        {filtered.map((o) => (
          <div className="admin-order" key={o.id}>
            <div className="admin-order__top">
              <span className="admin-order__id">#{o.id}</span>
              <span className="admin-order__date">{new Date(o.created_at).toLocaleString("az-AZ")}</span>
            </div>
            <div className="admin-order__items">
              {o.items.map((i, idx) => (
                <span key={idx}>{i.name} × {i.qty || 1}</span>
              ))}
            </div>
            {o.total > 0 && <div className="admin-order__total">Cəmi: {o.total} ₼</div>}
            <div className="admin-order__bottom">
              <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <button className="admin-btn admin-btn--small admin-btn--danger" onClick={() => handleDelete(o.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="admin-empty">Sifariş yoxdur</p>}
      </div>
    </div>
  );
}
