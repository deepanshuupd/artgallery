import Link from "next/link";
import { requireAdminUser } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { orderLabel } from "@/lib/checkout";
import { createWhatsAppLinkTo, formatOrderAmount } from "@/lib/whatsapp";
import { updateOrder } from "./actions";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string; number: number; created_at: string; status: string; customer_name: string; phone: string; email: string | null;
  address: string; city: string; state: string; pincode: string; occasion_date: string | null; notes: string | null;
  items: { productId: string; name: string; price: number; quantity: number; request: string }[];
  subtotal: number; delivery: number; total: number; upi_reference: string | null; payment_proof: string | null; payment_submitted_at: string | null; admin_note: string | null;
};

const statusLabels: Record<string, string> = {
  awaiting_payment: "Waiting for payment", payment_submitted: "Check payment", confirmed: "Confirmed",
  dispatched: "Dispatched", delivered: "Delivered", cancelled: "Cancelled",
};
const statusTone: Record<string, string> = {
  awaiting_payment: "bg-stone-100 text-stone-600", payment_submitted: "bg-amber-100 text-amber-800", confirmed: "bg-emerald-100 text-emerald-800",
  dispatched: "bg-sky-100 text-sky-800", delivered: "bg-stone-200 text-stone-700", cancelled: "bg-red-100 text-red-700",
};
const filters = [
  { key: "open", label: "To do", statuses: ["payment_submitted", "confirmed"] },
  { key: "awaiting_payment", label: "Waiting for payment", statuses: ["awaiting_payment"] },
  { key: "dispatched", label: "Dispatched", statuses: ["dispatched"] },
  { key: "all", label: "All", statuses: [] as string[] },
];
const when = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  await requireAdminUser();
  const { show: requested } = await searchParams;
  const show = filters.find(filter => filter.key === requested) ?? filters[0];
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (show.statuses.length) query = query.in("status", show.statuses);
  const { data, error } = await query;
  const orders = (data ?? []) as OrderRow[];
  // Screenshots live in a private bucket; signed links let the admin view them for an hour.
  const proofs = orders.map(order => order.payment_proof).filter((path): path is string => Boolean(path));
  const signed = new Map<string, string>();
  if (proofs.length) {
    const { data: links } = await supabase.storage.from("payment-proofs").createSignedUrls(proofs, 3600);
    links?.forEach(link => { if (link.path && link.signedUrl) signed.set(link.path, link.signedUrl); });
  }

  return <div>
    <div className="mb-6">
      <h1 className="font-serif text-3xl text-stone-900">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">Match each UPI reference with the payment in PhonePe, then confirm the order. Customers see the status on their order page.</p>
    </div>
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Filter orders">
      {filters.map(filter => <Link key={filter.key} href={`/admin/orders?show=${filter.key}`} className={`rounded-full px-4 py-2 text-sm ${filter.key === show.key ? "bg-stone-800 text-white" : "bg-white text-stone-600 border border-stone-200"}`}>{filter.label}</Link>)}
    </nav>
    {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Orders could not be loaded. Refresh the page to try again.</p>}
    {!error && !orders.length && <p className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500">No orders here yet.</p>}
    <div className="grid gap-4">{orders.map(order => {
      const label = orderLabel(order.number);
      const greeting = `Hi ${order.customer_name.split(" ")[0]}, this is Sneha from KumaonRang about your order ${label} (${formatOrderAmount(Number(order.total))}).`;
      return <article key={order.id} className="rounded-xl border border-stone-200 bg-white p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-stone-900">{label} · {formatOrderAmount(Number(order.total))}</h2>
            <p className="text-xs text-stone-500">{when(order.created_at)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[order.status] ?? ""}`}>{statusLabels[order.status] ?? order.status}</span>
        </header>
        <div className="mt-4 grid gap-4 text-sm text-stone-700 sm:grid-cols-2">
          <div>
            <p className="font-medium text-stone-900">{order.customer_name}</p>
            <p><a className="underline" href={`tel:+91${order.phone}`}>+91 {order.phone}</a> · <a className="underline" href={createWhatsAppLinkTo(`91${order.phone}`, greeting)} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
            {order.email && <p>{order.email}</p>}
            <p className="mt-2 whitespace-pre-line">{order.address}<br />{order.city}, {order.state} {order.pincode}</p>
            {order.occasion_date && <p className="mt-2">Needed for: {order.occasion_date}</p>}
            {order.notes && <p className="mt-2">Note: {order.notes}</p>}
          </div>
          <div>
            <ul className="grid gap-1">{order.items.map(item => <li key={item.productId}>{item.quantity} × {item.name.trim()} <span className="text-stone-500">({formatOrderAmount(Number(item.price))})</span>{item.request && <span className="block text-xs text-amber-800">Request: {item.request}</span>}</li>)}</ul>
            <p className="mt-2 text-stone-500">Products {formatOrderAmount(Number(order.subtotal))} · delivery {Number(order.delivery) ? formatOrderAmount(Number(order.delivery)) : "free"}</p>
            <p className="mt-2">{order.upi_reference ? <>UPI ref: <strong className="font-mono">{order.upi_reference}</strong></> : !order.payment_proof && <span className="text-stone-500">No payment details yet</span>}{order.payment_submitted_at && <span className="text-stone-500"> · sent {when(order.payment_submitted_at)}</span>}</p>
            {order.payment_proof && (signed.get(order.payment_proof)
              ? <a href={signed.get(order.payment_proof)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-3 rounded-lg border border-stone-200 p-2 text-sm underline hover:bg-stone-50">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a short-lived signed link to a private file */}
                  <img src={signed.get(order.payment_proof)} alt={`Payment screenshot for ${label}`} className="h-20 w-14 rounded object-cover" />
                  View payment screenshot
                </a>
              : <p className="mt-2 text-sm text-amber-800">A payment screenshot was uploaded but could not be loaded. Refresh to try again.</p>)}
          </div>
        </div>
        <form action={updateOrder} className="mt-4 flex flex-wrap items-end gap-3 border-t border-stone-100 pt-4">
          <input type="hidden" name="id" value={order.id} />
          <label className="text-xs text-stone-500">Status
            <select name="status" defaultValue={order.status} className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800">
              {Object.entries(statusLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
          <label className="min-w-[200px] flex-1 text-xs text-stone-500">Private note
            <input name="admin_note" defaultValue={order.admin_note ?? ""} maxLength={1000} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-800" placeholder="e.g. paid, courier AWB…" />
          </label>
          <button type="submit" className="rounded-md bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700">Save</button>
        </form>
      </article>;
    })}</div>
  </div>;
}
