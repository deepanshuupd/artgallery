import QRCode from "qrcode";
import { getUpiLink, getUpiPayee } from "@/lib/payment";

// Server-only, so pages ship the finished SVG and no QR library.
export async function getUpiQrSvg(amount?: number, note?: string) {
  const payee = getUpiPayee();
  if (!payee) return "";
  return QRCode.toString(getUpiLink(payee, amount, note), { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#2f241d", light: "#fffaf1" } });
}
