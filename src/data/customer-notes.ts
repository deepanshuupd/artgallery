import assets from "./customer-note-assets.json";

export type CustomerNoteAsset = { src: string; width: number; height: number };
export type CustomerNote = {
  id: string;
  author: string;
  attribution: string;
  context: string;
  preview: string;
  excerpt: string;
  messages: string[];
  sourceLabel: string;
  date?: { iso: string; label: string };
  screenshot: CustomerNoteAsset;
  photo?: CustomerNoteAsset & { alt: string; caption: string };
  shop: { href: string; label: string };
};

// Public-display permission confirmed by the owner on 3 October 2026.
// Only privacy-reviewed crops are referenced. Unknown products/dates stay unknown.
// These are selected messages, not star ratings or verified-purchase claims.
export const customerNotes: readonly CustomerNote[] = [
  {
    id: "kanishak", author: "Kanishak", attribution: "Kanishak",
    context: "An unboxing, a little joy", preview: "Best quality and finishing",
    excerpt: "Best quality and finishing\nreally like thattt😭",
    messages: ["Recieved 💗\nBest quality and finishing\nreally like thattt😭"],
    sourceLabel: "Received-order feedback", date: { iso: "2026-08-02", label: "2 August 2026" },
    screenshot: assets["kanishak-message"],
    photo: { ...assets["kanishak-photo"], alt: "Pahadi couple keepsake in Kanishak’s opened gift parcel", caption: "Photo shared by Kanishak" },
    shop: { href: "/pahadi-keychains", label: "Explore Pahadi keychains" },
  },
  {
    id: "sargam", author: "Sargam", attribution: "Sargam",
    context: "A little joy on arrival", preview: "It’s absolutely beautiful! ✨",
    excerpt: "I truly loved it, and I really like your work. It’s absolutely beautiful! ✨",
    messages: ["Mujhe parcel receive hogya hai and i really like it ✨", "I'm so happy with your art. I truly loved it, and I really like your work. It’s absolutely beautiful! ✨"],
    sourceLabel: "Received-order feedback", date: { iso: "2026-08-14", label: "14 August 2026" },
    screenshot: assets["sargam-message"],
    shop: { href: "/collection", label: "Find your own keepsake" },
  },
  {
    id: "ankita", author: "Ankita", attribution: "Shared by Ankita",
    context: "Something made personal", preview: "Bhot acha lga unhe",
    excerpt: "Bhut accha hai\nBhot acha lga unhe\nThank u so much 😊🙏",
    messages: ["Bhut accha hai", "Bhot acha lga unhe", "Thank u so much 😊🙏"],
    sourceLabel: "Includes forwarded feedback", date: { iso: "2025-12-24", label: "24 December 2025" },
    screenshot: assets["ankita-message"],
    photo: { ...assets["ankita-photo"], alt: "Personalised Ankita and Vikash frame with Aipan-inspired detail and small bells", caption: "Photo forwarded by Ankita" },
    shop: { href: "/kumaoni-gifts", label: "Explore personal gifts" },
  },
  {
    id: "tamanna", author: "Tamanna", attribution: "Tamanna",
    context: "The little details matter", preview: "Bht pyare h...🫶❤️",
    excerpt: "Bht pyare h...🫶❤️", messages: ["Bht pyare h...🫶❤️"],
    sourceLabel: "Keychain design feedback", screenshot: assets["tamanna-message"],
    shop: { href: "/pahadi-keychains", label: "Find your Pahadi keychain" },
  },
  {
    id: "dinesh", author: "Dinesh", attribution: "Dinesh",
    context: "A note along the way", preview: "Looks good",
    excerpt: "Looks good", messages: ["Looks good"],
    sourceLabel: "Keychain design feedback", screenshot: assets["dinesh-message"],
    shop: { href: "/pahadi-keychains", label: "Explore Pahadi keychains" },
  },
  {
    id: "family-frame", author: "A customer", attribution: "An Aipan frame customer",
    context: "A frame for the family", preview: "Specially mummy aur didi ko frame bahut sundar laga...",
    excerpt: "Frame bhot achha bana hai ❤️\nSpecially mummy aur didi ko frame bahut sundar laga...",
    messages: ["Frame bhot achha bana hai ❤️\nSpecially mummy aur didi ko frame bahut sundar laga...\nThank you so much for making it so beautifully...❤️"],
    sourceLabel: "Frame feedback · name kept private", screenshot: assets["family-frame-message"],
    shop: { href: "/aipan-frames", label: "Explore Aipan frames" },
  },
  {
    id: "parcel", author: "A customer", attribution: "An Instagram customer",
    context: "A parcel, received with love", preview: "Parcel pahoch gy hn mere pass mst bnaya hh thankyou",
    excerpt: "Parcel pahoch gy hn mere pass mst bnaya hh thankyou ❤️❤️❤️❤️",
    messages: ["Parcel pahoch gy hn mere pass mst bnaya hh thankyou ❤️❤️❤️❤️"],
    sourceLabel: "Received-order feedback · name kept private", date: { iso: "2025-08-05", label: "5 August 2025" },
    screenshot: assets["parcel-message"], shop: { href: "/collection", label: "Find your keepsake" },
  },
  {
    id: "phone-cover", author: "A customer", attribution: "A personalised-cover customer",
    context: "Made just for them", preview: "beautiful,amazing lovely cover",
    excerpt: "Thankuuu diii for this\nbeautiful,amazing lovely cover",
    // Text excerpt; the original crop retains the customer's emojis too.
    messages: ["Thankuuu diii for this\nbeautiful,amazing lovely cover"],
    sourceLabel: "Personalised-cover feedback · name kept private", screenshot: assets["phone-cover-message"],
    photo: { ...assets["phone-cover-photo"], alt: "Customer-shared personalised phone cover with purple flowers and decorative keepsakes", caption: "A photo from a customer’s message" },
    shop: { href: "/kumaoni-gifts", label: "Explore personal gifts" },
  },
  {
    id: "nameplate", author: "A customer", attribution: "A nameplate customer",
    context: "For a little corner of home", preview: "Way better then expected",
    excerpt: "Amazing nameplate ✨\nWay better then expected\nThanku so muchh",
    messages: ["Amazing nameplate ✨\nWay better then expected\nThanku so muchh", "Just received"],
    sourceLabel: "Received-order feedback · name kept private", screenshot: assets["nameplate-message"],
    shop: { href: "/kumaoni-gifts", label: "Explore personal gifts" },
  },
];
