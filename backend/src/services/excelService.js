import { graphClient, GRAPH_CONFIG } from "../config/graph.js";

// Urutan kolom di sheet "DATA ANGGOTA" (JANGAN diubah urutannya
// tanpa mengubah juga struktur Excel aslinya):
// A: Nama Lengkap | B: Username Roblox | C: Nama IC | D: Umur IC
// E: Nomor WhatsApp | F: ID Anggota | G: Tanggal Bergabung
export const COLUMNS = {
  NAMA_LENGKAP: 0,
  USERNAME_ROBLOX: 1,
  NAMA_IC: 2,
  UMUR_IC: 3,
  NOMOR_WHATSAPP: 4,
  ID_ANGGOTA: 5,
  TANGGAL_BERGABUNG: 6,
};

const worksheetPath = () => {
  const { userId, fileId, worksheetName } = GRAPH_CONFIG;
  const encodedSheet = encodeURIComponent(worksheetName);
  return `/users/${userId}/drive/items/${fileId}/workbook/worksheets/${encodedSheet}`;
};

/**
 * Mengambil seluruh data yang terpakai di sheet DATA ANGGOTA.
 * Baris pertama dianggap header, tidak ikut dikembalikan sebagai data.
 * Mengembalikan { headers, rows } di mana setiap row adalah array nilai kolom.
 */
export async function getUsedRange() {
  const client = await graphClient();
  const res = await client.get(`${worksheetPath()}/usedRange`);
  const values = res.data.values || [];
  if (values.length === 0) {
    return { headers: [], rows: [], rowCount: 0 };
  }
  const [headers, ...rows] = values;
  return { headers, rows, rowCount: values.length };
}

/**
 * Mengambil seluruh anggota sebagai array objek yang mudah dipakai.
 */
export async function getAllMembers() {
  const { rows } = await getUsedRange();
  return rows
    .filter((row) => row && row[COLUMNS.ID_ANGGOTA]) // skip baris kosong
    .map(rowToMember);
}

function rowToMember(row) {
  return {
    namaLengkap: row[COLUMNS.NAMA_LENGKAP] || "",
    usernameRoblox: row[COLUMNS.USERNAME_ROBLOX] || "",
    namaIC: row[COLUMNS.NAMA_IC] || "",
    umurIC: row[COLUMNS.UMUR_IC] || "",
    nomorWhatsApp: row[COLUMNS.NOMOR_WHATSAPP] || "",
    idAnggota: row[COLUMNS.ID_ANGGOTA] || "",
    tanggalBergabung: row[COLUMNS.TANGGAL_BERGABUNG] || "",
  };
}

/**
 * Mencari anggota berdasarkan Username Roblox (case-insensitive).
 * Dipakai untuk mengecek duplikat saat pendaftaran.
 */
export async function findByUsernameRoblox(username) {
  const members = await getAllMembers();
  const target = String(username).trim().toLowerCase();
  return members.find((m) => String(m.usernameRoblox).trim().toLowerCase() === target) || null;
}

/**
 * Mencari anggota berdasarkan ID Anggota (mis. RNI-001).
 */
export async function findById(idAnggota) {
  const members = await getAllMembers();
  return members.find((m) => m.idAnggota === idAnggota) || null;
}

/**
 * Pencarian bebas untuk admin: ID Anggota, Nama Lengkap, Username Roblox, atau Nama IC.
 */
export async function searchMembers(query) {
  const members = await getAllMembers();
  const q = String(query).trim().toLowerCase();
  if (!q) return members;
  return members.filter(
    (m) =>
      m.idAnggota.toLowerCase().includes(q) ||
      m.namaLengkap.toLowerCase().includes(q) ||
      m.usernameRoblox.toLowerCase().includes(q) ||
      m.namaIC.toLowerCase().includes(q)
  );
}

/**
 * Menghasilkan ID Anggota berikutnya dengan mencari nomor RNI-XXX terbesar
 * yang sudah ada, lalu menambah 1. Format selalu 3 digit: RNI-001, RNI-002, dst.
 */
export async function generateNextId() {
  const members = await getAllMembers();
  let maxNumber = 0;
  for (const m of members) {
    const match = /^RNI-(\d+)$/.exec(m.idAnggota);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNumber) maxNumber = n;
    }
  }
  const next = maxNumber + 1;
  return `RNI-${String(next).padStart(3, "0")}`;
}

/**
 * Menambahkan baris anggota baru ke akhir data yang terpakai.
 *
 * CATATAN PENTING soal race condition (dua orang daftar hampir bersamaan):
 * Fungsi ini membaca usedRange untuk menentukan baris kosong berikutnya,
 * lalu langsung menuliskan ke baris tersebut. Untuk mengurangi risiko dua
 * pendaftar mendapat baris/ID yang sama, endpoint pendaftaran (routes/registration.js)
 * memakai antrian sederhana (mutex in-memory) sehingga proses baca ID
 * terakhir + tulis baris baru tidak akan tumpang tindih dalam satu proses server.
 */
export async function appendMemberRow(member) {
  const { rowCount } = await getUsedRange();
  const nextRowNumber = rowCount + 1; // baris Excel (1-indexed), rowCount sudah termasuk header
  const range = `A${nextRowNumber}:G${nextRowNumber}`;

  const values = [
    [
      member.namaLengkap,
      member.usernameRoblox,
      member.namaIC,
      member.umurIC,
      member.nomorWhatsApp,
      member.idAnggota,
      member.tanggalBergabung,
    ],
  ];

  const client = await graphClient();
  await client.patch(`${worksheetPath()}/range(address='${range}')`, { values });
  return member;
}

/**
 * Memperbarui data anggota tertentu berdasarkan ID Anggota.
 * Hanya field yang diberikan di `updates` yang akan diubah.
 */
export async function updateMemberById(idAnggota, updates) {
  const { rows } = await getUsedRange();
  const rowIndex = rows.findIndex((row) => row[COLUMNS.ID_ANGGOTA] === idAnggota);
  if (rowIndex === -1) {
    throw new Error(`Anggota dengan ID ${idAnggota} tidak ditemukan.`);
  }

  const currentRow = rows[rowIndex];
  const merged = [...currentRow];

  if (updates.namaLengkap !== undefined) merged[COLUMNS.NAMA_LENGKAP] = updates.namaLengkap;
  if (updates.usernameRoblox !== undefined) merged[COLUMNS.USERNAME_ROBLOX] = updates.usernameRoblox;
  if (updates.namaIC !== undefined) merged[COLUMNS.NAMA_IC] = updates.namaIC;
  if (updates.umurIC !== undefined) merged[COLUMNS.UMUR_IC] = updates.umurIC;
  if (updates.nomorWhatsApp !== undefined) merged[COLUMNS.NOMOR_WHATSAPP] = updates.nomorWhatsApp;
  // ID Anggota dan Tanggal Bergabung sengaja tidak diizinkan diubah dari sini
  // untuk menjaga integritas data historis.

  // rowIndex dihitung dari data (tanpa header), jadi baris Excel-nya = rowIndex + 2
  const excelRowNumber = rowIndex + 2;
  const range = `A${excelRowNumber}:G${excelRowNumber}`;

  const client = await graphClient();
  await client.patch(`${worksheetPath()}/range(address='${range}')`, { values: [merged] });
  return rowToMember(merged);
}
