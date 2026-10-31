import { getProducts } from "@/lib/products";
import { cartProduct, type CartProduct } from "@/lib/cart-quote";
import { CartPage } from "@/components/cart/cart-page";
import { pageMetadata } from "@/lib/seo";
import { getUpiQrSvg } from "@/lib/payment-qr";
export const dynamic = "force-dynamic";
export const metadata = {...pageMetadata({title:"Your cart",path:"/cart",description:"Review your KumaonRang products, quantities and requests, then share one order enquiry with Sneha on WhatsApp."}),robots:{index:false,follow:true}};
export default async function CartRoute() {
  let catalog: CartProduct[] = [];
  let catalogFailed = false;
  try { catalog = (await getProducts()).map(cartProduct); }
  catch { catalogFailed = true; }
  return <CartPage catalog={catalog} catalogFailed={catalogFailed} upiQr={await getUpiQrSvg()} />;
}
