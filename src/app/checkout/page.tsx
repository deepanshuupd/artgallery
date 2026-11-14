import { getProducts } from "@/lib/products";
import { cartProduct, type CartProduct } from "@/lib/cart-quote";
import { CheckoutPage } from "@/components/checkout/checkout-page";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { checkoutEnabled } from "@/data/shop-ordering";
export const dynamic = "force-dynamic";
export const metadata = {...pageMetadata({title:"Checkout",path:"/checkout",description:"Add your delivery details and pay for your KumaonRang order by UPI."}),robots:{index:false,follow:true}};
export default async function CheckoutRoute() {
  if (!checkoutEnabled) notFound();
  let catalog: CartProduct[] = [];
  let catalogFailed = false;
  try { catalog = (await getProducts()).map(cartProduct); }
  catch { catalogFailed = true; }
  return <CheckoutPage catalog={catalog} catalogFailed={catalogFailed} />;
}
