import { forwardRef } from "react";

// Kartu identitas INTERNAL komunitas RNI (bukan KTP resmi pemerintah).
// Sengaja tidak menampilkan foto maupun Nomor WhatsApp.
const KTPCard = forwardRef(function KTPCard({ member }, ref) {
  if (!member) return null;

  return (
    <div
      ref={ref}
      className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-rni-gold"
      style={{ background: "linear-gradient(135deg, #0B3D2E 0%, #12513D 100%)" }}
    >
      <div className="px-6 pt-5 pb-3 border-b border-rni-gold/40 flex items-center gap-3">
        <span className="text-2xl text-rni-gold-light">★</span>
        <div>
          <p className="text-rni-gold-light font-serif font-bold leading-tight">REPUBLIK NUSA INDAH</p>
          <p className="text-rni-cream/70 text-xs tracking-wide">KARTU IDENTITAS ANGGOTA</p>
        </div>
      </div>

      <div className="px-6 py-5 text-rni-cream space-y-3">
        <Field label="Nama Lengkap" value={member.namaLengkap} />
        <Field label="ID Anggota" value={member.idAnggota} emphasize />
        <Field label="Nama IC" value={member.namaIC} />
        <Field label="Umur IC" value={member.umurIC} />
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs uppercase tracking-wide text-rni-cream/60">Status Anggota</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rni-gold text-rni-green">
            {member.status || "AKTIF"}
          </span>
        </div>
      </div>

      <div className="px-6 py-3 bg-black/20 text-center text-[11px] text-rni-cream/60">
        Kartu identitas internal komunitas RP — bukan dokumen resmi pemerintah
      </div>
    </div>
  );
});

function Field({ label, value, emphasize }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-rni-cream/50">{label}</p>
      <p className={emphasize ? "text-rni-gold-light font-bold text-lg" : "text-rni-cream font-medium"}>
        {value}
      </p>
    </div>
  );
}

export default KTPCard;
