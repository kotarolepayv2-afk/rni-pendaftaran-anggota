import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { api } from "../../api/client";

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .adminMemberDetail(id)
      .then((res) => setMember(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-rni-green mb-6">Detail Anggota</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {member && (
        <div className="bg-white rounded-xl shadow-sm border border-rni-green/10 p-6 max-w-lg space-y-4">
          <Row label="ID Anggota" value={member.idAnggota} />
          <Row label="Nama Lengkap" value={member.namaLengkap} />
          <Row label="Username Roblox" value={member.usernameRoblox} />
          <Row label="Nama IC" value={member.namaIC} />
          <Row label="Umur IC" value={member.umurIC} />
          <Row label="Nomor WhatsApp" value={member.nomorWhatsApp} />
          <Row label="Tanggal Bergabung" value={member.tanggalBergabung} />

          <div className="flex gap-3 pt-4">
            <Link
              to={`/admin/members/${member.idAnggota}/edit`}
              className="px-5 py-2 rounded-lg bg-rni-green text-rni-gold-light font-medium hover:bg-rni-green-light transition-colors"
            >
              Edit Data
            </Link>
            <a
              href={`/ktp/${member.idAnggota}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-lg border border-rni-green text-rni-green font-medium hover:bg-rni-green/5 transition-colors"
            >
              Lihat KTP
            </a>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
