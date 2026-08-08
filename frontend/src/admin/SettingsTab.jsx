import { useState } from "react";
import { api } from "../api";

const LANGS = [
  { key: "az", label: "AZ" },
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" }
];

export default function SettingsTab({ settings, onUpdated }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.updateSettings(form);
      onUpdated(updated);
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">Sayt tənzimləmələri</h2>

      <div className="admin-section">
        <h3>Şirkət adı</h3>
        <label className="admin-field">
          <span>Ad (bütün dillərdə eyni görünür başlıqda)</span>
          <input value={form.site_name} onChange={(e) => set("site_name", e.target.value)} />
        </label>
      </div>

      <div className="admin-section">
        <h3>Giriş ekranı (splash) — alt yazı</h3>
        {LANGS.map((l) => (
          <label className="admin-field" key={l.key}>
            <span>{l.label}</span>
            <textarea
              rows={2}
              value={form[`hero_subtitle_${l.key}`] || ""}
              onChange={(e) => set(`hero_subtitle_${l.key}`, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="admin-section">
        <h3>"Haqqımızda" mətni</h3>
        {LANGS.map((l) => (
          <label className="admin-field" key={l.key}>
            <span>{l.label}</span>
            <textarea
              rows={3}
              value={form[`about_${l.key}`] || ""}
              onChange={(e) => set(`about_${l.key}`, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="admin-section">
        <h3>Əlaqə</h3>
        <label className="admin-field">
          <span>Telefon</span>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+994 XX XXX XX XX" />
        </label>
        <label className="admin-field">
          <span>WhatsApp (rəqəm, ölkə kodu ilə, + işarəsiz — məs. 994501234567)</span>
          <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="994501234567" />
        </label>
      </div>

      <div className="admin-section">
        <h3>Sosial şəbəkələr (tam link)</h3>
        <label className="admin-field">
          <span>Instagram</span>
          <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
        </label>
        <label className="admin-field">
          <span>TikTok</span>
          <input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@..." />
        </label>
        <label className="admin-field">
          <span>YouTube</span>
          <input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/@..." />
        </label>
        <label className="admin-field">
          <span>Facebook</span>
          <input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/..." />
        </label>
      </div>

      <div className="admin-section">
        <h3>Ünvan</h3>
        {LANGS.map((l) => (
          <label className="admin-field" key={l.key}>
            <span>{l.label}</span>
            <input
              value={form[`location_${l.key}`] || ""}
              onChange={(e) => set(`location_${l.key}`, e.target.value)}
            />
          </label>
        ))}
        <label className="admin-field">
          <span>Google Maps linki (ixtiyari)</span>
          <input value={form.location_map_url} onChange={(e) => set("location_map_url", e.target.value)} />
        </label>
      </div>

      <div className="admin-save-bar">
        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saxlanılır..." : "Yadda saxla"}
        </button>
        {saved && <span className="admin-saved">Saxlanıldı ✓</span>}
      </div>
    </div>
  );
}
