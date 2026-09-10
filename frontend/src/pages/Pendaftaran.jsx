import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { api } from "../api/client";
import KTPCard from "../components/KTPCard";

const initialForm = {
  namaLengkap: "",
  usernameRoblox: "",
  namaIC: "",
  umurIC: "",
  nomorWhatsApp: "",
};

export default function Pendaftaran() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // data anggota baru setelah sukses
  const ktpRef = useRef(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.daftar(form);
      setResult(res.data);
    } catch (err) {
      setErrors(err.details && err.details.length ? err.details : [err.message]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!ktpRef.current || !result) return;
    const dataUrl = await toPng(ktpRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `KTP-${result.idAnggota}.png`;
    link.href = dataUrl;
    link.click();
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14">
        <h1 className="font-serif text-2xl font-bold text-rni-green text-center mb-2">
          Pendaftaran Berhasil
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Selamat datang di Republik Nusa Indah. Berikut KTP Digital RNI Anda.
        </p>

        <KTPCard
          ref={ktpRef}
          member={{
            idAnggota: result.idAnggota,
            namaLengkap: result.namaLengkap,
            namaIC: result.namaIC,
            umurIC: result.umurIC,
            status: "AKTIF",
          }}
        />

        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-lg bg-rni-gold text-rni-green font-semibold hover:bg-rni-gold-light transition-colors"
          >
            Download KTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-rni-green text-center mb-2">
        Pendaftaran Anggota
      </h1>
      <p className="text-center text-gray-600 text-sm mb-8">
        Isi data di bawah ini untuk bergabung dengan Republik Nusa Indah.
      </p>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-rni-green/10 p-6 space-y-4">
        <Field label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} />
        <Field label="Username Roblox" name="usernameRoblox" value={form.usernameRoblox} onChange={handleChange} />
        <Field label="Nama IC" name="namaIC" value={form.namaIC} onChange={handleChange} />
        <Field label="Umur IC" name="umurIC" type="number" value={form.umurIC} onChange={handleChange} />
        <Field label="Nomor WhatsApp" name="nomorWhatsApp" value={form.nomorWhatsApp} onChange={handleChange} placeholder="08xxxxxxxxxx" />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-rni-green text-rni-gold-light font-semibold hover:bg-rni-green-light transition-colors disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rni-gold"
      />
    </div>
  );
}
