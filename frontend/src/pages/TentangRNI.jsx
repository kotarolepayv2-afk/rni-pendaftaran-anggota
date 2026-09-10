const struktur = [
  "OWNER",
  "CO OWNER",
  "FOUNDER",
  "CO FOUNDER",
  "ADMINISTRATOR",
  "HEAD MEDIA",
  "HEAD RP STAF",
];

const misi = [
  "Membangun lingkungan RP yang nyaman.",
  "Meningkatkan kualitas roleplay anggota.",
  "Membuat sistem administrasi yang rapi.",
  "Menjaga ketertiban komunitas.",
  "Mengembangkan kegiatan komunitas RNI.",
];

export default function TentangRNI() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-rni-green mb-6 text-center">
        REPUBLIK NUSA INDAH
      </h1>
      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-12">
        RNI adalah komunitas Brookhaven Roleplay yang memiliki sistem keanggotaan,
        administrasi, dan organisasi untuk mendukung kegiatan roleplay.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-rni-green/10">
          <h2 className="font-serif font-bold text-rni-green text-xl mb-3">Visi</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Membangun komunitas Brookhaven Roleplay yang aktif, tertib, dan terorganisir.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-rni-green/10">
          <h2 className="font-serif font-bold text-rni-green text-xl mb-3">Misi</h2>
          <ul className="text-gray-600 text-sm leading-relaxed list-disc list-inside space-y-1">
            {misi.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="font-serif font-bold text-rni-green text-xl mb-6 text-center">
          Struktur Organisasi
        </h2>
        <div className="flex flex-col items-center gap-2">
          {struktur.map((jabatan, i) => (
            <div key={jabatan} className="w-full max-w-xs">
              <div className="bg-rni-green text-rni-gold-light font-semibold text-center py-3 rounded-lg shadow-sm">
                {jabatan}
              </div>
              {i < struktur.length - 1 && (
                <div className="flex justify-center text-rni-green/50 text-lg">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
