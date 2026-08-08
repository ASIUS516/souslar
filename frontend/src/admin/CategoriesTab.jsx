import { useState } from "react";
import { api } from "../api";

const emptyForm = { name_az: "", name_ru: "", name_en: "", sort_order: 0 };

export default function CategoriesTab({ categories, onChange }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function startEdit(cat) {
    setEditingId(cat.id);
    setForm({
      name_az: cat.name_az, name_ru: cat.name_ru, name_en: cat.name_en,
      sort_order: cat.sort_order
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.updateCategory(editingId, form);
      } else {
        await api.createCategory(form);
      }
      const updated = await api.getCategories();
      onChange(updated);
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) return;
    await api.deleteCategory(id);
    const updated = await api.getCategories();
    onChange(updated);
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">Kateqoriyalar</h2>

      <form className="admin-section" onSubmit={handleSubmit}>
        <h3>{editingId ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}</h3>
        <label className="admin-field">
          <span>Ad (AZ)</span>
          <input value={form.name_az} onChange={(e) => setForm({ ...form, name_az: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Ad (RU)</span>
          <input value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Ad (EN)</span>
          <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Sıralama nömrəsi</span>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </label>
        <div className="admin-save-bar">
          <button className="admin-btn admin-btn--primary" disabled={saving}>
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
        {categories.map((c) => (
          <div className="admin-list__row" key={c.id}>
            <span>{c.name_az} / {c.name_ru} / {c.name_en}</span>
            <div className="admin-list__actions">
              <button className="admin-btn admin-btn--small" onClick={() => startEdit(c)}>
                Redaktə
              </button>
              <button className="admin-btn admin-btn--small admin-btn--danger" onClick={() => handleDelete(c.id)}>
                Sil
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="admin-empty">Hələ kateqoriya yoxdur</p>}
      </div>
    </div>
  );
}
