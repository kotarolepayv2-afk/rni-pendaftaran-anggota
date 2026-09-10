import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  findByUsernameRoblox,
  generateNextId,
  appendMemberRow,
} from "../services/excelService.js";
import { todayFormatted } from "../utils/date.js";
import { withLock } from "../utils/mutex.js";

const router = Router();

// Rate limit sederhana: maksimal 5 percobaan pendaftaran per IP per 10 menit.
const registrationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Terlalu banyak percobaan pendaftaran. Coba lagi beberapa menit lagi." },
  standardHeaders: true,
  legacyHeaders: false,
});

function validateInput(body) {
  const errors = [];
  const { namaLengkap, usernameRoblox, namaIC, umurIC, nomorWhatsApp } = body;

  if (!namaLengkap || String(namaLengkap).trim().length < 3) {
    errors.push("Nama Lengkap wajib diisi (minimal 3 karakter).");
  }
  if (!usernameRoblox || String(usernameRoblox).trim().length < 3) {
    errors.push("Username Roblox wajib diisi (minimal 3 karakter).");
  }
  if (!namaIC || String(namaIC).trim().length < 3) {
    errors.push("Nama IC wajib diisi (minimal 3 karakter).");
  }
  const umur = Number(umurIC);
  if (!umurIC || Number.isNaN(umur) || umur < 1 || umur > 120) {
    errors.push("Umur IC wajib diisi dengan angka yang wajar.");
  }
  if (!nomorWhatsApp || !/^[0-9+ ]{8,20}$/.test(String(nomorWhatsApp).trim())) {
    errors.push("Nomor WhatsApp tidak valid.");
  }
  return errors;
}

router.post("/", registrationLimiter, async (req, res) => {
  const errors = validateInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Data tidak valid.", details: errors });
  }

  const namaLengkap = String(req.body.namaLengkap).trim();
  const usernameRoblox = String(req.body.usernameRoblox).trim();
  const namaIC = String(req.body.namaIC).trim();
  const umurIC = String(req.body.umurIC).trim();
  const nomorWhatsApp = String(req.body.nomorWhatsApp).trim();

  try {
    const newMember = await withLock(async () => {
      const existing = await findByUsernameRoblox(usernameRoblox);
      if (existing) {
        const conflict = new Error("DUPLICATE_USERNAME");
        conflict.code = "DUPLICATE_USERNAME";
        throw conflict;
      }

      const idAnggota = await generateNextId();
      const tanggalBergabung = todayFormatted();

      const member = {
        namaLengkap,
        usernameRoblox,
        namaIC,
        umurIC,
        nomorWhatsApp,
        idAnggota,
        tanggalBergabung,
      };

      await appendMemberRow(member);
      return member;
    });

    return res.status(201).json({
      message: "Pendaftaran berhasil.",
      data: {
        idAnggota: newMember.idAnggota,
        namaLengkap: newMember.namaLengkap,
        namaIC: newMember.namaIC,
        umurIC: newMember.umurIC,
        tanggalBergabung: newMember.tanggalBergabung,
      },
    });
  } catch (err) {
    if (err.code === "DUPLICATE_USERNAME") {
      return res.status(409).json({ error: "Username Roblox tersebut sudah terdaftar." });
    }
    console.error("Registration error:", err.message);
    return res.status(502).json({
      error: "Terjadi kendala saat memproses pendaftaran. Silakan coba lagi nanti.",
    });
  }
});

export default router;
