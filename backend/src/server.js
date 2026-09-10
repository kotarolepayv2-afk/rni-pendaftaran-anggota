import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import registrationRoutes from "./routes/registration.js";
import adminRoutes from "./routes/admin.js";
import ktpRoutes from "./routes/ktp.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", nama: "Republik Nusa Indah API" });
});

app.use("/api/pendaftaran", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ktp", ktpRoutes);

// Penanganan error umum: jangan pernah bocorkan detail teknis Microsoft Graph ke pengguna.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi nanti." });
});

app.listen(PORT, () => {
  console.log(`Republik Nusa Indah API berjalan di http://localhost:${PORT}`);
});
