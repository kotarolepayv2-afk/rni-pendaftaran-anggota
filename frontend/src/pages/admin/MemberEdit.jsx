import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { api } from "../../api/client";

export default function MemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .adminMemberDetail(id)
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.adminMemberUpdate(id, form);
      navigate(`/admin/members/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-rni-green mb-6">Edit Anggota — {id}</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {form && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-rni-green/10 p-6 max-w-lg space-y-4">
          <Field label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} />
          <Field label="Username Roblox" name="usernameRoblox" value={form.usernameRoblox} onChange={handleChange} />
          <Field label="Nama IC" name="namaIC" value={form.namaIC} onChange={handleChange} />
          <Field label="Umur IC" name="umurIC" value={form.umurIC} onChange={handleChange} />
          <Field label="Nomor WhatsApp" name="nomorWhatsApp" value={form.nomorWhatsApp} onChange={handleChange} />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-rni-green text-rni-gold-light font-medium hover:bg-rni-green-light transition-colors disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

function Field({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rni-gold"
      />
    </div>
  );
}
