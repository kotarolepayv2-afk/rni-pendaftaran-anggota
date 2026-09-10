import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { api } from "../../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .adminDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-rni-green mb-8">Dashboard</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {data && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-rni-green/10">
            <p className="text-sm text-gray-500 mb-1">Total Anggota</p>
            <p className="text-4xl font-bold text-rni-green">{data.totalAnggota}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-rni-green/10">
            <p className="text-sm text-gray-500 mb-1">Anggota Terbaru</p>
            {data.anggotaTerbaru ? (
              <>
                <p className="text-2xl font-bold text-rni-green">{data.anggotaTerbaru.idAnggota}</p>
                <p className="text-sm text-gray-600">{data.anggotaTerbaru.namaLengkap}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Belum ada anggota.</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/admin/members"
          className="inline-block px-5 py-2.5 rounded-lg bg-rni-green text-rni-gold-light font-medium hover:bg-rni-green-light transition-colors"
        >
          Lihat Semua Anggota
        </Link>
      </div>
    </AdminLayout>
  );
}
