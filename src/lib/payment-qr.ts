import QRCode from "qrcode";
import { getUpiLink, getUpiPayee } from "@/lib/payment";

// Server-only, so pages ship the finished SVG and no QR library.
export async function getUpiQrSvg(amount?: number) {
  const payee = getUpiPayee();
  if (!payee) return "";
  return QRCode.toString(getUpiLink(payee, amount), { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#2f241d", light: "#fffaf1" } });
}
