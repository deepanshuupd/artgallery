/**
 * Example Implementations for WhatsApp Ordering
 * These examples show how to integrate the WhatsApp ordering system
 * into different parts of your application.
 * 
 * Copy and adapt these examples to your needs.
 */

// ============================================================================
// EXAMPLE 1: Product Detail Page (Already Implemented)
// ============================================================================

/*
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import type { Product } from "@/types/product";
import { WhatsAppOrderButton } from "@/components/products/whatsapp-order-button";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image);

  return (
    <main className="px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        
        <div className="mt-6 space-y-6">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={400}
          />
          
          <div>
            <p className="text-2xl font-bold">₹{product.price}</p>
            <p>{product.description}</p>
            
            {/* The WhatsApp Order Button */}
            <WhatsAppOrderButton product={product} className="mt-6" />
          </div>
        </div>
      </div>
    </main>
  );
}
*/

// ============================================================================
// EXAMPLE 2: Product Card Component
// ============================================================================

/*
"use client";

import Image from "next/image";
import { SimpleWhatsAppButton } from "@/components/products/simple-whatsapp-button";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        
        <p className="text-sm text-gray-600">{product.category}</p>
        
        <p className="text-xl font-bold text-stone-900 mt-2">₹{product.price}</p>
        
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Simple WhatsApp Button */}
        <SimpleWhatsAppButton
          product={product}
          className="w-full mt-4"
          text="Order Now"
          showIcon={true}
        />
      </div>
    </div>
  );
}

// Usage in Collection Page:
function CollectionPage({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 3: Collection Page with Quick Order Modal
// ============================================================================

/*
"use client";

import { useState } from "react";
import Image from "next/image";
import { QuickOrderModal } from "@/components/products/quick-order-modal";
import type { Product } from "@/types/product";

type CollectionPageProps = {
  products: Product[];
};

export function CollectionPage({ products }: CollectionPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Collection</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-8 border rounded-lg"
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border overflow-hidden bg-white shadow hover:shadow-lg transition-shadow"
          >
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
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-xl font-bold mt-2">₹{product.price}</p>

              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-4 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20ba5a] transition-colors"
              >
                💬 Quick Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Order Modal */}
      {selectedProduct && (
        <QuickOrderModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
*/

// ============================================================================
// EXAMPLE 4: Using the Hook Directly
// ============================================================================

/*
"use client";

import { useState } from "react";
import { useWhatsAppOrder } from "@/hooks/useWhatsAppOrder";
import type { Product } from "@/types/product";

type CustomOrderComponentProps = {
  product: Product;
};

export function CustomOrderComponent({ product }: CustomOrderComponentProps) {
  const { handleOrder, getOrderMessage } = useWhatsAppOrder();
  const [customText, setCustomText] = useState("");

  const message = getOrderMessage({
    productName: product.name,
    category: product.category,
    price: product.price,
    customizationInterest: customText,
    quantity: 1,
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Add Custom Notes:
        </label>
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="e.g., Gift wrapping required, special date..."
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Message Preview:</p>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>

      <button
        onClick={() => handleOrder(product, customText)}
        className="w-full px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20ba5a]"
      >
        Send Order via WhatsApp
      </button>
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 5: Bulk Ordering
// ============================================================================

/*
"use client";

import { useState } from "react";
import { generateBulkOrderMessage, createWhatsAppLink } from "@/lib/whatsapp";
import type { BulkOrderItem } from "@/types/whatsapp";

export function BulkOrderPage() {
  const [items, setItems] = useState<BulkOrderItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<BulkOrderItem>>({});

  const addItem = () => {
    if (newItem.productName && newItem.category && newItem.quantity) {
      setItems([...items, newItem as BulkOrderItem]);
      setNewItem({});
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  };

  const handleBulkOrder = () => {
    if (items.length === 0) return;

    const message = generateBulkOrderMessage(items);
    const link = createWhatsAppLink(message);
    window.open(link, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bulk Order</h1>

      {/* Add Item Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newItem.productName || ""}
          onChange={(e) =>
            setNewItem({ ...newItem, productName: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          value={newItem.category || ""}
          onChange={(e) =>
            setNewItem({ ...newItem, category: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Keychains">Keychains</option>
          <option value="Frames">Frames</option>
          <option value="Fridge Magnets">Fridge Magnets</option>
          <option value="Personalized Gifts">Personalized Gifts</option>
          <option value="Curated Hampers">Curated Hampers</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity || 1}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              quantity: parseInt(e.target.value) || 1,
            })
          }
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={newItem.price || ""}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              price: parseInt(e.target.value) || 0,
            })
          }
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={addItem}
          className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
        >
          Add Item
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-600">
                {item.category} x {item.quantity}
              </p>
            </div>
            <p className="font-bold">₹{(item.price || 0) * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total and Send */}
      <div className="bg-stone-900 text-white p-6 rounded-lg">
        <p className="text-lg mb-4">Total: ₹{calculateTotal()}</p>
        <button
          onClick={handleBulkOrder}
          disabled={items.length === 0}
          className="w-full px-4 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#20ba5a] disabled:opacity-50"
        >
          Order All via WhatsApp
        </button>
      </div>
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 6: Featured Products Section (Home Page)
// ============================================================================

/*
"use client";

import Image from "next/image";
import { SimpleWhatsAppButton } from "@/components/products/simple-whatsapp-button";
import type { Product } from "@/types/product";

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer rounded-[2.2rem] overflow-hidden border border-white/70 bg-[rgba(255,253,252,0.86)] shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-stone-600">
                  {product.category}
                </p>

                <h3 className="mt-3 font-serif text-xl font-bold text-stone-900">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                  {product.description}
                </p>

                <p className="mt-4 text-lg font-bold text-stone-900">
                  ₹{product.price}
                </p>

                {/* Order Button */}
                <SimpleWhatsAppButton
                  product={product}
                  className="w-full mt-4"
                  text="Order Now"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
*/

// ============================================================================
// Export Examples for Documentation
// ============================================================================

export const examples = {
  productDetail: "Product detail page with WhatsAppOrderButton",
  productCard: "Reusable product card component with SimpleWhatsAppButton",
  collectionPage: "Collection page with QuickOrderModal",
  customHook: "Using useWhatsAppOrder hook directly",
  bulkOrdering: "Bulk order page for multiple products",
  featuredSection: "Featured products section for home page",
};
