import { getProducts } from "@/lib/products";
import { CartValidationError } from "@/lib/cart-quote";
import { parseCheckoutRequest } from "@/lib/checkout";
import { placeOrder } from "@/lib/orders";

export async function POST(request: Request) {
  const headers = {"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
  try {
    const text = await request.text();
    if (text.length > 40000) return Response.json({error:"Your order is too large to send in one go."},{status:413,headers});
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return Response.json({error:"The checkout request is invalid."},{status:400,headers}); }
    // A hidden field people never see; bots that fill every field are turned away.
    if (raw && typeof raw === "object" && (raw as Record<string,unknown>).website) return Response.json({error:"The checkout request is invalid."},{status:400,headers});
    const order = await placeOrder(parseCheckoutRequest(raw),await getProducts());
    return Response.json(order,{headers});
  } catch (error) {
    const known = error instanceof CartValidationError;
    if (!known) console.error("Checkout failed", error);
    return Response.json({error:known ? error.message : "Your order could not be placed just now. Please try again, or message Sneha on WhatsApp."},{status:known ? 400 : 503,headers});
  }
}
