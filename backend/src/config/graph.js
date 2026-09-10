import * as msal from "@azure/msal-node";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  MICROSOFT_TENANT_ID,
  EXCEL_FILE_ID,
  ONEDRIVE_USER_ID,
  EXCEL_WORKSHEET_NAME,
} = process.env;

// Validasi konfigurasi dasar saat server start (tidak menampilkan secret di log)
function checkConfig() {
  const missing = [];
  if (!MICROSOFT_CLIENT_ID) missing.push("MICROSOFT_CLIENT_ID");
  if (!MICROSOFT_CLIENT_SECRET) missing.push("MICROSOFT_CLIENT_SECRET");
  if (!MICROSOFT_TENANT_ID) missing.push("MICROSOFT_TENANT_ID");
  if (!EXCEL_FILE_ID) missing.push("EXCEL_FILE_ID");
  if (!ONEDRIVE_USER_ID) missing.push("ONEDRIVE_USER_ID");
  if (missing.length) {
    console.warn(
      `[PERINGATAN] Variabel .env berikut belum diisi: ${missing.join(", ")}. ` +
        `Fitur Excel Online belum akan berfungsi sampai ini diisi.`
    );
  }
}
checkConfig();

const msalConfig = {
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}`,
    clientSecret: MICROSOFT_CLIENT_SECRET,
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

let cachedToken = null;
let cachedTokenExpiry = 0;

/**
 * Mendapatkan access token untuk Microsoft Graph API menggunakan
 * client credentials flow (app-only, tanpa login interaktif pengguna).
 * Token di-cache di memori sampai mendekati kedaluwarsa.
 */
export async function getGraphToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry - 60_000) {
    return cachedToken;
  }

  const result = await cca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  if (!result || !result.accessToken) {
    throw new Error("Gagal mendapatkan access token dari Microsoft Graph API.");
  }

  cachedToken = result.accessToken;
  cachedTokenExpiry = result.expiresOn ? result.expiresOn.getTime() : now + 55 * 60_000;
  return cachedToken;
}

/**
 * Membuat instance axios yang sudah terpasang header Authorization
 * ke Microsoft Graph API, siap dipakai untuk request Excel.
 */
export async function graphClient() {
  const token = await getGraphToken();
  return axios.create({
    baseURL: "https://graph.microsoft.com/v1.0",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export const GRAPH_CONFIG = {
  fileId: EXCEL_FILE_ID,
  userId: ONEDRIVE_USER_ID,
  worksheetName: EXCEL_WORKSHEET_NAME || "DATA ANGGOTA",
};
