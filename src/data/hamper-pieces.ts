// Item types drawn from the shop's published hamper contents.
// This is a quote request palette, not a promise of stock or a priced catalogue.
export const hamperPieces = [
  { id: "pendant", name: "Pendant", note: "A little necklace keepsake", group: "Accessories" },
  { id: "earrings", name: "Pair of earrings", note: "A pair picked for their style", group: "Accessories" },
  { id: "clutcher", name: "Hair clutcher", note: "A useful everyday favourite", group: "Accessories" },
  { id: "scrunchie", name: "Scrunchie", note: "A soft touch of colour", group: "Accessories" },
  { id: "keychain", name: "Soft toy keychain", note: "Something sweet to carry", group: "Accessories" },
  { id: "bracelet", name: "Bracelet", note: "A small finishing touch", group: "Accessories" },
  { id: "bangles", name: "Set of bangles", note: "A little festive colour", group: "Accessories" },
  { id: "lipstick", name: "Lipstick", note: "Ask for their favourite shade", group: "Accessories" },
  { id: "ittar", name: "Ittar", note: "Choose the fragrance with Sneha", group: "Little comforts" },
  { id: "candle", name: "Scented candle", note: "A little warmth for their corner", group: "Little comforts" },
  { id: "chocolate", name: "Chocolate", note: "Something sweet to unwrap", group: "Little comforts" },
  { id: "jar", name: "Pichwai jar", note: "A decorative keepsake", group: "Little comforts" },
  { id: "rakhi", name: "Rakhi", note: "For your Raksha Bandhan gift", group: "Celebrations" },
  { id: "roli", name: "Roli & chawal pair", note: "For the little rituals", group: "Celebrations" },
  { id: "note", name: "Personal note", note: "Your words, tucked inside", group: "Finishing touches" },
  { id: "lights", name: "Cork lights", note: "A warm finishing glow", group: "Finishing touches" },
] as const;

export type HamperPieceId = typeof hamperPieces[number]["id"];
export const hamperGroups = ["All pieces", "Accessories", "Little comforts", "Celebrations", "Finishing touches"] as const;
export const hamperOccasions = ["Birthday", "Anniversary", "Wedding / return gifts", "Raksha Bandhan", "Festive celebration", "Thank you", "Just because", "Other"] as const;
