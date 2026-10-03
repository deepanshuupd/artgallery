import type { ProductCategory } from "@/types/product";

export const collections = [
  {
    category: "Keychains", slug: "pahadi-keychains", label: "Pahadi keychains",
    title: "Pahadi Keychains & Kumaoni Keepsakes",
    heading: "Pahadi keychains",
    description: "Explore Pahadi girl, boy and couple keychains at KumaonRang. Choose a keepsake from Uttarakhand for your keys, bag or a gift.",
    intro: "A little home, wherever you go. Explore Pahadi girl, boy and couple keychains, alongside other keepsakes for keys and bags.",
    note: "Choosing your keychain",
    detail: "Start with the figure or phrase that feels familiar: a Pahadi girl, a ladka in traditional dress, or a couple celebrating Uttarakhand. Compare the photos, material and included pieces on each listing.",
  },
  {
    category: "Frames", slug: "aipan-frames", label: "Aipan & frames",
    title: "Aipan Art Frames & Kumaoni Wall Decor",
    heading: "Aipan art frames",
    description: "Explore Aipan art frames and Kumaoni wall decor, including Om, Ganesh, Golu Devta and Pichora-inspired designs, alongside personal photo frames.",
    intro: "The colours of Kumaon, at home. Explore Aipan art frames, Pichora-inspired decor and photo frames for your favourite corner.",
    note: "Find the right piece for your wall",
    detail: "Explore Om, Ganesh and Golu Devta designs, Pichora-inspired backgrounds and traditional jewellery display frames. A personal photo frame offers another way to make a corner feel like home.",
  },
  {
    category: "Fridge Magnets", slug: "uttarakhand-souvenirs", label: "Fridge magnets",
    title: "Uttarakhand Fridge Magnets & Pahadi Souvenirs",
    heading: "Uttarakhand fridge magnets",
    description: "Find Uttarakhand fridge magnets, Pahadi couple designs and personalised acrylic photo magnets at KumaonRang. Explore keepsakes from Pithoragarh.",
    intro: "Small reminders of the hills. Find Uttarakhand fridge magnets and personalised photo magnets for a home that holds your memories.",
    note: "A keepsake to live with",
    detail: "Choose a Pahadi fridge magnet for its regional artwork, or a personalised acrylic magnet for a favourite photograph. Compare the design and display options before picking a keepsake for your own home or someone else’s.",
  },
  {
    category: "Personalized Gifts", slug: "kumaoni-gifts", label: "Gifts & keepsakes",
    title: "Kumaoni Keepsakes & Gift Accessories",
    heading: "Gifts & Kumaoni keepsakes",
    description: "Explore Aipan nameplates, canvas bags, wedding brooches and devotional gift accessories at KumaonRang. Personalisation is available on selected pieces.",
    intro: "A gift with a connection. Explore Aipan nameplates and canvas bags alongside wedding brooches and devotional accessories. Selected pieces can be personalised.",
    note: "Make it personal, together",
    detail: "A customised Aipan nameplate can make an entrance feel personal; an Aipan canvas bag brings the artwork into everyday life. This collection also includes other gift items, so check each listing for its origin, details and custom options.",
  },
] satisfies Array<{
  category: ProductCategory; slug: string; label: string; title: string;
  heading: string; description: string; intro: string; note: string; detail: string;
}>;

// Keep the longer editorial copy outside the navigation array used by clients.
const collectionGuides: Record<string, {
  questions: Array<{ question: string; answer: string }>;
  guide: { lead: string; href: string; label: string };
}> = {
  "pahadi-keychains": {
    questions: [
      {
        question: "Which Pahadi keychain should I choose?",
        answer: "Choose a Pahadi girl or boy design for someone who connects with its dress and character, or explore the Uttarakhand couple designs for a shared memory. Other styles, including the Guardian Bell keychain, sit alongside these regional keepsakes.",
      },
      {
        question: "Does a couple keychain come as a pair?",
        answer: "Check the specific listing: a couple may be shown together in the artwork, while a set can contain separate pieces. Confirm the design and number of keychains with Sneha before ordering.",
      },
      {
        question: "Can I add a name or order for a group?",
        answer: "Custom details depend on the design. Share the product link, your idea, quantity and occasion date on WhatsApp so Sneha can confirm the options, price and timing.",
      },
    ],
    guide: { lead: "Choosing a little reminder of home?", href: "/uttarakhand-gifts", label: "Explore our Uttarakhand gift guide" },
  },
  "aipan-frames": {
    questions: [
      {
        question: "Is every frame an Aipan design?",
        answer: "The collection brings together Aipan-inspired artwork, Kumaoni wall decor and personal photo frames. Check the artwork and description of each piece; a photograph or jewellery display frame has a different purpose from an Aipan art frame.",
      },
      {
        question: "What should I check before choosing wall decor?",
        answer: "Check the dimensions, material and whether the piece hangs on a wall or stands on a surface. Compare its colours with your space. If a detail is not listed, ask Sneha to confirm it before ordering.",
      },
      {
        question: "Can I personalise a frame for a gift?",
        answer: "Photo frames and art frames can have different customisation options. Share the specific product and any names, photograph or occasion you have in mind; Sneha will confirm what is possible for that piece.",
      },
    ],
    guide: { lead: "Curious about the art behind these pieces?", href: "/aipan-art", label: "Read our guide to Aipan art" },
  },
  "uttarakhand-souvenirs": {
    questions: [
      {
        question: "Which magnets feature Uttarakhand?",
        answer: "Look for the I Love Uttarakhand, Pahadi couple and regional souvenir designs in the collection. The product photos and description show the particular place, character or artwork, so you can choose the connection that matters to you.",
      },
      {
        question: "What is the difference between magnets with and without a stand?",
        answer: "The personalised acrylic photo magnet is listed in versions with and without a stand. Choose the listing that matches how you want to display it, and confirm its dimensions and included parts before ordering.",
      },
      {
        question: "Can I use my own photograph?",
        answer: "Choose a listing described as a personalised photo magnet. Send the product link and your photograph to Sneha to discuss the crop and layout. Regional souvenir designs do not necessarily offer the same custom options.",
      },
    ],
    guide: { lead: "Putting together a gift with a Pahadi connection?", href: "/uttarakhand-gifts", label: "Find more Uttarakhand gift ideas" },
  },
  "kumaoni-gifts": {
    questions: [
      {
        question: "Can every gift be personalised?",
        answer: "Personalisation is available on selected products. This collection also includes ready-made gifts and regional keepsakes. Check the individual listing, then ask about names, photographs or other changes for the piece you choose.",
      },
      {
        question: "What should I share for a customised Aipan nameplate?",
        answer: "Send the product link, the exact name or wording, your preferred script and any space or size requirements. Sneha can confirm the available design, dimensions, price and preparation time before you decide.",
      },
      {
        question: "How do I choose a gift for a particular occasion?",
        answer: "Start with how the person will use it: a nameplate for their home, a canvas bag for everyday use, or a keepsake that connects them to Kumaon. Share your budget and occasion date when enquiring so the options can be checked.",
      },
    ],
    guide: { lead: "Still deciding what feels right for them?", href: "/uttarakhand-gifts", label: "Browse our Uttarakhand gift guide" },
  },
};

export function findCollection(slug: string) {
  const collection = collections.find(collection => collection.slug === slug);
  return collection ? { ...collection, ...collectionGuides[collection.slug] } : undefined;
}
