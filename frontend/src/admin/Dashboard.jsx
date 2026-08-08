import { useState, useEffect } from "react";
import { api } from "../api";
import SettingsTab from "./SettingsTab";
import CategoriesTab from "./CategoriesTab";
import ProductsTab from "./ProductsTab";
import OrdersTab from "./OrdersTab";

const TABS = [
  { key: "settings", label: "Tənzimləmələr" },
  { key: "categories", label: "Kateqoriyalar" },
  { key: "products", label: "Məhsullar" },
  { key: "orders", label: "Sifarişlər" }
];

export default function Dashboard({ username, onLogout }) {
  const [tab, setTab] = useState("settings");
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSettings(),
      api.getCategories(),
      api.getProducts(),
      api.getOrders()
    ]).then(([s, c, p, o]) => {
      setSettings(s);
      setCategories(c);
      setProducts(p);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    await api.logout();
    onLogout();
  }

  if (loading) return <div className="admin-loading">…</div>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Sosuslar</div>
        <nav className="admin-sidebar__nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-sidebar__link${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{username}</span>
          <button className="admin-btn admin-btn--small" onClick={handleLogout}>
            Çıxış
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "settings" && <SettingsTab settings={settings} onUpdated={setSettings} />}
        {tab === "categories" && <CategoriesTab categories={categories} onChange={setCategories} />}
        {tab === "products" && (
          <ProductsTab products={products} categories={categories} onChange={setProducts} />
        )}
        {tab === "orders" && <OrdersTab orders={orders} onChange={setOrders} />}
      </main>
    </div>
  );
}
