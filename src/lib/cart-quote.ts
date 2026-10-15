import type { Product } from "@/types/product";
import type { CartLine } from "./cart-state";
import { validCartId } from "./cart-state";
import { getMinimumPieceQuantity } from "./product-highlights";
import { getProductPath } from "./catalog";
import { getProductImage } from "./product-image";
import { getSiteUrl } from "./site";
import { createWhatsAppLink, formatOrderAmount, orderEnquiryHeading, orderItemLines, productOrderFacts, orderDeliveryLines, quoteOrderRequest, orderEstimateNote, orderConfirmationNote } from "./whatsapp";

export type CartProduct = { id: string; name: string; category: Product["category"]; path: string; price: number; image: string; alt: string; minimum: number; inStock?: boolean };
export type CartDetails = { deliveryPincode: string; occasionDate: string; request: string };
export type CartRequest = CartDetails & { items: CartLine[] };
export type CartQuote = { message: string; url: string; subtotal: number; lines: (CartLine & CartProduct)[] };
export class CartValidationError extends Error {}
export const cartProduct = (product: Product): CartProduct => {
  const image = getProductImage(product);
  return { id:product.id, name:product.name.trim(), category:product.category, path:getProductPath(product), price:product.price, image:image.cardSrc, alt:image.alt, minimum:getMinimumPieceQuantity(product), inStock:product.inStock };
};
const inputText = (value: unknown, maximum: number) => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maximum) throw new CartValidationError("Please shorten your request and try again.");
  return value.trim();
};
export function parseCartRequest(raw: unknown): CartRequest {
  if (!raw || typeof raw !== "object") throw new CartValidationError("The cart request is invalid.");
  const body = raw as Record<string,unknown>;
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 50) throw new CartValidationError("Add products to your cart before reviewing your order.");
  const seen = new Set<string>();
  const items = body.items.map((item): CartLine => {
    if (!item || !validCartId(item.productId) || seen.has(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw new CartValidationError("An item quantity is invalid. Update your cart and try again.");
    seen.add(item.productId);
    return {productId:item.productId,quantity:item.quantity,request:inputText(item.request,250)};
  });
  const deliveryPincode = inputText(body.deliveryPincode,6), occasionDate = inputText(body.occasionDate,10), request = inputText(body.request,600);
  if (deliveryPincode && !/^\d{6}$/.test(deliveryPincode)) throw new CartValidationError("Enter a 6-digit delivery PIN code, or leave it empty.");
  if (occasionDate) {
    const date = new Date(`${occasionDate}T00:00:00Z`);
    const today = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(occasionDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0,10)!==occasionDate || occasionDate < today) throw new CartValidationError("Choose today or a future occasion date, or leave it empty.");
  }
  return {items,deliveryPincode,occasionDate,request};
}
export function prepareCartQuote(request: CartRequest, products: Product[]): CartQuote {
  const catalog = new Map(products.filter(product => product.published !== false).map(product => [product.id,product]));
  const lines = request.items.map(item => {
    const product = catalog.get(item.productId);
    if (!product) throw new CartValidationError("A product is no longer available. Refresh product details or remove it from your cart.");
    const current = cartProduct(product);
    if (!Number.isFinite(current.price) || current.price < 0) throw new CartValidationError(`Please contact Sneha to confirm the price of ${current.name}.`);
    if (item.quantity < current.minimum) throw new CartValidationError(`${current.name}: minimum order is ${current.minimum}. Update the quantity before continuing.`);
    return {...item,...current};
  });
  const subtotalPaise = lines.reduce((sum,line) => sum+Math.round(line.price*100)*line.quantity,0);
  const text = [orderEnquiryHeading("Cart"), `${lines.length} ${lines.length === 1 ? "product" : "products"} from my cart`, ""];
  lines.forEach((line,index) => {
    const product = catalog.get(line.id)!;
    text.push(...orderItemLines({ productName:line.name, category:product.category, quantity:line.quantity, price:line.price,
      inStock:line.inStock, customizationInterest:line.request, facts:productOrderFacts(product), productUrl:`${getSiteUrl()}${line.path}` }, index+1), "");
  });
  text.push(`*Product subtotal: ${formatOrderAmount(subtotalPaise/100)}*`, orderEstimateNote,
    ...orderDeliveryLines(request.deliveryPincode, request.occasionDate));
  if (request.request) text.push("", "*Notes for the whole order*", quoteOrderRequest(request.request));
  text.push("", orderConfirmationNote);
  const message = text.join("\n");
  return {message,url:createWhatsAppLink(message),subtotal:subtotalPaise/100,lines};
}
