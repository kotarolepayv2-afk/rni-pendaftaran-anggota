import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { api } from "../../api/client";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load(q = "") {
    setLoading(true);
    api
      .adminMembers(q)
      .then((res) => setMembers(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(query);
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-rni-green mb-6">Daftar Anggota</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari ID Anggota, Nama Lengkap, Username Roblox, atau Nama IC"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rni-gold"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-rni-green text-rni-gold-light font-medium hover:bg-rni-green-light transition-colors"
        >
          Cari
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-rni-green/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rni-green/5 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">ID Anggota</th>
              <th className="px-4 py-3 font-medium">Nama Lengkap</th>
              <th className="px-4 py-3 font-medium">Username Roblox</th>
              <th className="px-4 py-3 font-medium">Nama IC</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
            )}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Tidak ada anggota ditemukan.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.idAnggota} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-rni-green">{m.idAnggota}</td>
                <td className="px-4 py-3">{m.namaLengkap}</td>
                <td className="px-4 py-3">{m.usernameRoblox}</td>
                <td className="px-4 py-3">{m.namaIC}</td>
                <td className="px-4 py-3">{m.tanggalBergabung}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/members/${m.idAnggota}`}
                    className="text-rni-green font-medium hover:text-rni-gold underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
