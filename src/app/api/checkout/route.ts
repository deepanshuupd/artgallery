import { getProducts } from "@/lib/products";
import { CartValidationError } from "@/lib/cart-quote";
import { parseCheckoutRequest } from "@/lib/checkout";
import { placeOrder } from "@/lib/orders";
import { after } from "next/server";
import { checkoutEnabled } from "@/data/shop-ordering";
import { newOrderAlert, sendShopAlert } from "@/lib/order-alerts";

export async function POST(request: Request) {
  const headers = {"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
  if (!checkoutEnabled) return Response.json({error:"Checkout is not available yet. Please send your order to Sneha on WhatsApp."},{status:404,headers});
  try {
    const text = await request.text();
    if (text.length > 40000) return Response.json({error:"Your order is too large to send in one go."},{status:413,headers});
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return Response.json({error:"The checkout request is invalid."},{status:400,headers}); }
    // A hidden field people never see; bots that fill every field are turned away.
    if (raw && typeof raw === "object" && (raw as Record<string,unknown>).website) return Response.json({error:"The checkout request is invalid."},{status:400,headers});
    const checkout = parseCheckoutRequest(raw);
    const order = await placeOrder(checkout,await getProducts());
    // Tell Sneha on WhatsApp once the customer has their answer; a slow alert never delays the order.
    after(() => sendShopAlert(newOrderAlert({number:order.number,total:order.total,customerName:checkout.customer.name,city:checkout.customer.city,items:order.items})));
    return Response.json({id:order.id,number:order.number,total:order.total},{headers});
  } catch (error) {
    const known = error instanceof CartValidationError;
    if (!known) console.error("Checkout failed", error);
    return Response.json({error:known ? error.message : "Your order could not be placed just now. Please try again, or message Sneha on WhatsApp."},{status:known ? 400 : 503,headers});
  }
}
