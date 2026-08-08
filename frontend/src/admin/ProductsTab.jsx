import { useState } from "react";
import { api } from "../api";

const emptyForm = {
  category_id: "", name_az: "", name_ru: "", name_en: "",
  description_az: "", description_ru: "", description_en: "",
  price: "", volume: "", image_url: "", image_public_id: "",
  in_stock: 1, sort_order: 0
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductsTab({ products, categories, onChange }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      category_id: p.category_id || "",
      name_az: p.name_az, name_ru: p.name_ru, name_en: p.name_en,
      description_az: p.description_az || "", description_ru: p.description_ru || "",
      description_en: p.description_en || "",
      price: p.price || "", volume: p.volume || "",
      image_url: p.image_url || "", image_public_id: p.image_public_id || "",
      in_stock: p.in_stock, sort_order: p.sort_order || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await api.uploadImage(base64);
      set("image_url", result.url);
      set("image_public_id", result.public_id);
    } catch (err) {
      alert("Şəkil yüklənmədi: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        price: form.price ? Number(form.price) : 0
      };
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      const updated = await api.getProducts();
      onChange(updated);
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;
    await api.deleteProduct(id);
    const updated = await api.getProducts();
    onChange(updated);
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">Məhsullar</h2>

      <form className="admin-section" onSubmit={handleSubmit}>
        <h3>{editingId ? "Məhsulu redaktə et" : "Yeni məhsul"}</h3>

        <label className="admin-field">
          <span>Şəkil</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <span className="admin-hint">Yüklənir...</span>}
          {form.image_url && (
            <img src={form.image_url} alt="" className="admin-image-preview" />
          )}
        </label>

        <label className="admin-field">
          <span>Kateqoriya</span>
          <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
            <option value="">— Seçilməyib —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_az}</option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Ad (AZ)</span>
          <input value={form.name_az} onChange={(e) => set("name_az", e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Ad (RU)</span>
          <input value={form.name_ru} onChange={(e) => set("name_ru", e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Ad (EN)</span>
          <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} required />
        </label>

        <label className="admin-field">
          <span>Təsvir (AZ)</span>
          <textarea rows={2} value={form.description_az} onChange={(e) => set("description_az", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>Təsvir (RU)</span>
          <textarea rows={2} value={form.description_ru} onChange={(e) => set("description_ru", e.target.value)} />
        </label>
        <label className="admin-field">
          <span>Təsvir (EN)</span>
          <textarea rows={2} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} />
        </label>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Qiymət (₼)</span>
            <input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Həcm (məs. 500 ml)</span>
            <input value={form.volume} onChange={(e) => set("volume", e.target.value)} />
          </label>
        </div>

        <label className="admin-field admin-field--checkbox">
          <input
            type="checkbox"
            checked={!!form.in_stock}
            onChange={(e) => set("in_stock", e.target.checked ? 1 : 0)}
          />
          <span>Stokda var</span>
        </label>

        <div className="admin-save-bar">
          <button className="admin-btn admin-btn--primary" disabled={saving || uploading}>
            {editingId ? "Yadda saxla" : "Əlavə et"}
          </button>
          {editingId && (
            <button type="button" className="admin-btn" onClick={resetForm}>
              Ləğv et
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        {products.map((p) => (
          <div className="admin-list__row" key={p.id}>
            <div className="admin-list__product">
              {p.image_url && <img src={p.image_url} alt="" />}
              <span>{p.name_az} {p.price ? `· ${p.price} ₼` : ""} {!p.in_stock && "· stokda yoxdur"}</span>
            </div>
            <div className="admin-list__actions">
              <button className="admin-btn admin-btn--small" onClick={() => startEdit(p)}>
                Redaktə
              </button>
              <button className="admin-btn admin-btn--small admin-btn--danger" onClick={() => handleDelete(p.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="admin-empty">Hələ məhsul yoxdur</p>}
      </div>
    </div>
  );
}
