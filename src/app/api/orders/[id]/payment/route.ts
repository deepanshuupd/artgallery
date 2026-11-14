import { CartValidationError } from "@/lib/cart-quote";
import { normaliseUpiReference } from "@/lib/checkout";
import { submitOrderPayment, validOrderId, validProofPath } from "@/lib/orders";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const headers = {"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
  const { id } = await params;
  if (!validOrderId(id)) return Response.json({error:"This order could not be found."},{status:404,headers});
  try {
    const body = await request.json().catch(() => ({})) as Record<string,unknown>;
    const typed = typeof body.reference === "string" && body.reference.trim() !== "";
    const reference = normaliseUpiReference(body.reference);
    if (typed && !reference) return Response.json({error:"Enter the UPI reference number exactly as your payment app shows it (usually 12 digits)."},{status:400,headers});
    const proof = body.proof === undefined || body.proof === "" ? "" : validProofPath(id,body.proof) ? body.proof : null;
    if (proof === null) return Response.json({error:"Your screenshot did not finish uploading. Please choose it again."},{status:400,headers});
    if (!reference && !proof) return Response.json({error:"Upload a payment screenshot or enter the UPI reference number."},{status:400,headers});
    return Response.json({status:await submitOrderPayment(id,{reference,proof})},{headers});
  } catch (error) {
    const known = error instanceof CartValidationError;
    if (!known) console.error("Payment reference failed", error);
    return Response.json({error:known ? error.message : "Your payment reference could not be saved just now. Please try again, or send it to Sneha on WhatsApp."},{status:known ? 400 : 503,headers});
  }
}
