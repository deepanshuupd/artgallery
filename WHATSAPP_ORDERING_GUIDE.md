# WhatsApp Ordering Implementation Guide

This guide explains how to use the WhatsApp ordering utilities and components in your Next.js application.

## Overview

The WhatsApp ordering system includes:
- **Utility Functions** (`src/lib/whatsapp.ts`) - Core logic for generating WhatsApp messages and links
- **Custom Hook** (`src/hooks/useWhatsAppOrder.ts`) - React hook for easy integration
- **Components**:
  - `WhatsAppOrderButton` - Full-featured button with customization modal
  - `SimpleWhatsAppButton` - Quick, minimal button for product cards
  - `QuickOrderModal` - Reusable modal component

## Quick Start Examples

### 1. Full Order Button with Customization (Product Detail Page)

```tsx
import { WhatsAppOrderButton } from "@/components/products/whatsapp-order-button";
import type { Product } from "@/types/product";

export function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <WhatsAppOrderButton product={product} />
    </div>
  );
}
```

### 2. Simple Button for Product Cards

```tsx
import { SimpleWhatsAppButton } from "@/components/products/simple-whatsapp-button";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <SimpleWhatsAppButton product={product} text="Buy Now" showIcon={true} />
    </div>
  );
}
```

### 3. Using the Hook with Custom UI

```tsx
"use client";

import { useWhatsAppOrder } from "@/hooks/useWhatsAppOrder";
import type { Product } from "@/types/product";

export function CustomOrderButton({ product }: { product: Product }) {
  const { handleOrder } = useWhatsAppOrder();

  return (
    <button onClick={() => handleOrder(product, "Custom text")}>
      Order via WhatsApp
    </button>
  );
}
```

### 4. Using the Modal Component

```tsx
"use client";

import { useState } from "react";
import { QuickOrderModal } from "@/components/products/quick-order-modal";
import type { Product } from "@/types/product";

export function ProductWithQuickOrder({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Quick Order</button>
      <QuickOrderModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

## Utility Functions Reference

### Core Functions

#### `generateOrderMessage(details: OrderDetails)`
Generates a formatted WhatsApp message string.

```tsx
import { generateOrderMessage } from "@/lib/whatsapp";

const message = generateOrderMessage({
  productName: "Floral Resin Keychain",
  category: "Keychains",
  price: 349,
  customizationInterest: "Personalized with my name",
  quantity: 2,
});

console.log(message);
// Output:
// Hi Sneha! 👋
// 
// I'm interested in placing an order:
// 
// 📦 Product Name: Floral Resin Keychain
// 📂 Category: Keychains
// 💰 Price: ₹349
// 📊 Quantity: 2
// ✨ Customization Interest: Personalized with my name
// ...
```

#### `createWhatsAppLink(message: string)`
Creates a WhatsApp direct message link.

```tsx
import { createWhatsAppLink } from "@/lib/whatsapp";

const link = createWhatsAppLink("Hi Sneha!");
// Returns: https://wa.me/?text=Hi%20Sneha!
```

#### `generateWhatsAppOrderLink(product, customization?, quantity?)`
Combines product info into a ready-to-use WhatsApp link.

```tsx
import { generateWhatsAppOrderLink } from "@/lib/whatsapp";

const link = generateWhatsAppOrderLink(
  product,
  "Personalized with my name",
  2
);
// Can be used directly in href or window.open()
```

#### `openWhatsAppOrder(product, customization?, quantity?)`
Opens WhatsApp in a new window with pre-filled message.

```tsx
import { openWhatsAppOrder } from "@/lib/whatsapp";

openWhatsAppOrder(product, "Custom text", 1);
```

#### `generateWhatsAppInquiryLink(product)`
Creates an inquiry link (without specific customization).

```tsx
import { generateWhatsAppInquiryLink } from "@/lib/whatsapp";

const inquiryLink = generateWhatsAppInquiryLink(product);
```

#### `generateBulkOrderMessage(items)`
For multiple products in one order.

```tsx
import { generateBulkOrderMessage } from "@/lib/whatsapp";

const message = generateBulkOrderMessage([
  {
    productName: "Keychain",
    category: "Keychains",
    quantity: 2,
    price: 349,
  },
  {
    productName: "Frame",
    category: "Frames",
    quantity: 1,
    price: 1299,
  },
]);
```

### Validation Function

#### `isValidWhatsAppMessage(message: string)`
Checks if message length is within WhatsApp limits.

```tsx
import { isValidWhatsAppMessage } from "@/lib/whatsapp";

if (isValidWhatsAppMessage(message)) {
  // Safe to send
}
```

## Component Props Reference

### WhatsAppOrderButton
Props:
- `product: Product` - The product to order
- `className?: string` - Additional CSS classes (default: "")

### SimpleWhatsAppButton
Props:
- `product: Product` - The product to order
- `className?: string` - Additional CSS classes (default: "")
- `showIcon?: boolean` - Show WhatsApp icon (default: true)
- `text?: string` - Button text (default: "Order")

### QuickOrderModal
Props:
- `product: Product` - The product to order
- `isOpen: boolean` - Control modal visibility
- `onClose: () => void` - Callback when modal should close

## Integration Examples

### Integration with Product Card Component

```tsx
"use client";

import Image from "next/image";
import { SimpleWhatsAppButton } from "@/components/products/simple-whatsapp-button";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.category}</p>
        <p className="text-xl font-bold mt-2">₹{product.price}</p>
        <SimpleWhatsAppButton
          product={product}
          className="w-full mt-4"
          text="Order Now"
        />
      </div>
    </div>
  );
}
```

### Integration with Collection Page

```tsx
"use client";

import { useState } from "react";
import { QuickOrderModal } from "@/components/products/quick-order-modal";
import type { Product } from "@/types/product";

export function CollectionGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <button onClick={() => setSelectedProduct(product)}>
              Order via WhatsApp
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <QuickOrderModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
```

## Message Format

The WhatsApp message automatically formats as:

```
Hi Sneha! 👋

I'm interested in placing an order:

📦 Product Name: [Product Name]
📂 Category: [Category]
💰 Price: ₹[Price]
📊 Quantity: [Quantity]
✨ Customization Interest: [Optional Customization]

Please let me know about:
• Available customization options
• Timeline for delivery
• Exact pricing with any customizations

Thank you! 🙏
```

## Best Practices

1. **Always provide Product type** - All components require a valid Product object
2. **Use SimpleWhatsAppButton for cards** - Lighter weight, no modal overhead
3. **Use WhatsAppOrderButton for detail pages** - Allows customization input
4. **Validate messages** - Use `isValidWhatsAppMessage()` for bulk orders
5. **Handle errors gracefully** - WhatsApp links open in new windows
6. **Mobile optimization** - Components are fully responsive

## Troubleshooting

### Link not opening WhatsApp
- Ensure WhatsApp is installed on the device
- Check browser popup blocker settings
- Verify message is properly URL encoded

### Message too long
- Use `isValidWhatsAppMessage()` to validate
- Consider reducing customization details
- Use inquiry link for more details

### Styling conflicts
- Pass `className` prop to override default styles
- Check Tailwind CSS configuration
- Verify shadow classes are available
