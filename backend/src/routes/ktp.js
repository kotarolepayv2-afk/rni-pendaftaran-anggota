import { Router } from "express";
import { findById } from "../services/excelService.js";

const router = Router();

// GET /api/ktp/:id  -> data untuk menampilkan KTP Digital RNI.
// Sengaja TIDAK menyertakan Nomor WhatsApp (hanya untuk admin).
router.get("/:id", async (req, res) => {
  try {
    const member = await findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Anggota tidak ditemukan." });
    }
    return res.json({
      data: {
        idAnggota: member.idAnggota,
        namaLengkap: member.namaLengkap,
        namaIC: member.namaIC,
        umurIC: member.umurIC,
        tanggalBergabung: member.tanggalBergabung,
        status: "AKTIF",
      },
    });
  } catch (err) {
    console.error("KTP lookup error:", err.message);
    return res.status(502).json({ error: "Gagal mengambil data KTP. Coba lagi nanti." });
  }
});

export default router;
