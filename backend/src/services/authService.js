import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

/**
 * Memvalidasi kredensial admin. Password dibandingkan dengan hash bcrypt
 * yang disimpan di .env (ADMIN_PASSWORD_HASH), bukan password polos.
 */
export async function verifyAdminCredentials(username, password) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    throw new Error(
      "ADMIN_USERNAME / ADMIN_PASSWORD_HASH belum diatur di .env. Lihat README.md."
    );
  }
  if (username !== ADMIN_USERNAME) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function issueAdminToken(username) {
  return jwt.sign({ sub: username, role: "admin" }, JWT_SECRET, {
    expiresIn: "8h",
  });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
