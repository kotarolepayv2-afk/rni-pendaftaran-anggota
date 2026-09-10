import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyAdminCredentials, issueAdminToken } from "../services/authService.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  getAllMembers,
  searchMembers,
  findById,
  updateMemberById,
} from "../services/excelService.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
});

// POST /api/admin/login
router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi." });
  }
  try {
    const ok = await verifyAdminCredentials(username, password);
    if (!ok) {
      return res.status(401).json({ error: "Username atau password salah." });
    }
    const token = issueAdminToken(username);
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Konfigurasi admin belum lengkap di server." });
  }
});

// Semua route di bawah ini butuh login admin (jabatan OWNER s.d. ADMINISTRATOR)
router.use(requireAdmin);

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const members = await getAllMembers();
    const total = members.length;
    const latest = members.length > 0 ? members[members.length - 1] : null;
    return res.json({
      totalAnggota: total,
      anggotaTerbaru: latest
        ? { idAnggota: latest.idAnggota, namaLengkap: latest.namaLengkap }
        : null,
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(502).json({ error: "Gagal memuat data dashboard." });
  }
});

// GET /api/admin/members?query=...
router.get("/members", async (req, res) => {
  try {
    const query = req.query.query || "";
    const members = query ? await searchMembers(query) : await getAllMembers();
    return res.json({ data: members });
  } catch (err) {
    console.error("Members list error:", err.message);
    return res.status(502).json({ error: "Gagal memuat daftar anggota." });
  }
});

// GET /api/admin/members/:id
router.get("/members/:id", async (req, res) => {
  try {
    const member = await findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Anggota tidak ditemukan." });
    return res.json({ data: member });
  } catch (err) {
    console.error("Member detail error:", err.message);
    return res.status(502).json({ error: "Gagal memuat detail anggota." });
  }
});

// PUT /api/admin/members/:id
router.put("/members/:id", async (req, res) => {
  try {
    const { namaLengkap, usernameRoblox, namaIC, umurIC, nomorWhatsApp } = req.body;
    const updated = await updateMemberById(req.params.id, {
      namaLengkap,
      usernameRoblox,
      namaIC,
      umurIC,
      nomorWhatsApp,
    });
    return res.json({ message: "Data anggota berhasil diperbarui.", data: updated });
  } catch (err) {
    console.error("Member update error:", err.message);
    if (err.message.includes("tidak ditemukan")) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(502).json({ error: "Gagal memperbarui data anggota." });
  }
});

export default router;
