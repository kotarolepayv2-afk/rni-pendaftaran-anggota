import { verifyAdminToken } from "../services/authService.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Tidak ada token. Silakan login terlebih dahulu." });
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesi tidak valid atau sudah kedaluwarsa. Silakan login ulang." });
  }
}
