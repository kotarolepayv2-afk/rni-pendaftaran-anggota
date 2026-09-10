// Mutex sederhana berbasis Promise untuk memastikan proses
// "cek ID terakhir -> buat ID baru -> tulis baris baru" tidak
// tumpang tindih ketika dua pendaftaran masuk hampir bersamaan
// dalam satu instance server.
//
// CATATAN: ini hanya melindungi dalam satu proses Node.js. Jika
// backend dijalankan di banyak instance sekaligus (multi-server),
// pertimbangkan mekanisme locking terpusat (mis. lock di database
// terpisah atau Excel table dengan idempotency key).

let queue = Promise.resolve();

export function withLock(task) {
  const result = queue.then(() => task());
  // Pastikan queue tetap berjalan walau task gagal, supaya antrian berikutnya tidak macet.
  queue = result.catch(() => {});
  return result;
}
