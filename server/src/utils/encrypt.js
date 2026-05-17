import crypto from "crypto";
import { Buffer } from "buffer";
import { AppError } from "./AppError.js";

const ALGO = "aes-256-gcm";

const getKey = () => {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new AppError(
      "Server encryption is not configured. Set ENCRYPTION_KEY in .env (64-char hex).",
      500,
    );
  }
  return Buffer.from(hex, "hex");
};

export const encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (payload) => {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
};
