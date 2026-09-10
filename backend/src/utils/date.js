/**
 * Mengembalikan tanggal hari ini dalam format DD/MM/YYYY (fixed string),
 * BUKAN formula, sehingga nilainya tidak akan berubah lagi setelah ditulis
 * ke Excel (berbeda dengan =TODAY() yang selalu mengikuti tanggal saat ini).
 */
export function todayFormatted() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
