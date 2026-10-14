import { getProducts } from "@/lib/products";
import { parseCartRequest, prepareCartQuote, CartValidationError } from "@/lib/cart-quote";
export async function POST(request: Request) {
  const headers = {"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
  try {
    const text = await request.text();
    if (text.length > 40000) return Response.json({error:"Your cart request is too large."},{status:413,headers});
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return Response.json({error:"The cart request is invalid."},{status:400,headers}); }
    const input = parseCartRequest(raw);
    const products = await getProducts();
    return Response.json(prepareCartQuote(input,products),{headers});
  } catch (error) {
    return Response.json({error:error instanceof CartValidationError ? error.message : "Current product details could not be checked. Please try again."},{status:error instanceof CartValidationError ? 400 : 503,headers});
  }
}
