import { Link } from "react-router-dom";

export default function Beranda() {
  return (
    <div>
      <section className="bg-rni-green text-rni-cream">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <p className="text-rni-gold-light tracking-[0.3em] text-xs md:text-sm mb-4">
            NEGARA KESATUAN • BERSATU • TERTIB • SEJAHTERA
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-rni-gold-light mb-4">
            REPUBLIK NUSA INDAH
          </h1>
          <p className="text-lg md:text-xl text-rni-cream/90 mb-8">
            "Komunitas Brookhaven Roleplay"
          </p>
          <p className="max-w-2xl mx-auto text-rni-cream/80 mb-8 leading-relaxed">
            RNI merupakan komunitas roleplay yang dibangun untuk menciptakan lingkungan RP
            yang tertib, aktif, dan terorganisir bagi seluruh anggotanya.
          </p>
          <p className="text-sm text-rni-cream/60 mb-10">Berdiri sejak 29 Agustus 2026</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pendaftaran"
              className="px-8 py-3 rounded-lg bg-rni-gold text-rni-green font-semibold hover:bg-rni-gold-light transition-colors"
            >
              Daftar Anggota
            </Link>
            <Link
              to="/tentang"
              className="px-8 py-3 rounded-lg border border-rni-gold-light/60 text-rni-cream font-semibold hover:bg-rni-green-light transition-colors"
            >
              Pelajari RNI
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-8 text-center">
        <InfoItem title="Tertib" desc="Sistem administrasi dan regulasi yang jelas bagi seluruh anggota." />
        <InfoItem title="Aktif" desc="Kegiatan roleplay yang berkelanjutan dan terorganisir." />
        <InfoItem title="Terorganisir" desc="Struktur organisasi dan keanggotaan yang rapi." />
      </section>
    </div>
  );
}

function InfoItem({ title, desc }) {
  return (
    <div className="p-6 rounded-xl bg-white shadow-sm border border-rni-green/10">
      <h3 className="font-serif font-bold text-rni-green text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
