"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercentage: number;
  imageUrl: string;
  slug: { current: string };
  description?: string;
}

const products: Product[] = [
  {
    _id: "1",
    name: "Modern Wireless Earbuds",
    price: 129.99,
    discountPercentage: 15,
    imageUrl: "/ear-buds.jpeg",
    slug: { current: "high-performance-gaming-modern-wireless-earbuds" },
    description: "Powerful modern wireless earbuds with the latest GPU and high refresh rate display.",
  },
  {
    _id: "2",
    name: "Wall Clock",
    price: 149.99,
    discountPercentage: 10,
    imageUrl: "/wall-clock.jpeg",
    slug: { current: "stylish-Wall Clock" },
    description: "Elevate your home decor with the Allah Hu Akbar Dial Wall Clock. Featuring a beautiful Islamic design and precise timekeeping, this clock combines elegance and spirituality.Perfect for adding a touch of faith and style to any room.",
  },
  {
    _id: "3",
    name: "Stylish Lamp",
    price: 799.99,
    discountPercentage: 20,
    imageUrl: "/lamp.jpeg",
    slug: { current: "Stylish-Lamp" },
    description: "Illuminate your space with this Adjustable Touch Switch DIY Artificial Xmas Tree Fairy Night Light. Perfect for holiday décor or as a cozy night light, it features a touch-sensitive switch for easy control and adds a warm, festive glow to any room. Ideal for creating a charming atmosphere this season!.",
  },
  {
    _id: "4",
    name: "Torch",
    price: 279.99,
    discountPercentage: 20,
    imageUrl: "/torch.jpg",
    slug: { current: "Heavy-Torch" },
    description: "SDGO Eye Power LED Rechargeable Headlight Illuminate your path with this powerful, energy-efficient LED headlamp. Featuring adjustable brightness and a rechargeable battery, it is perfect for outdoor adventures, camping, and emergency us",
  },
  {
    _id: "5",
    name: "Makeup Bundle",
    price: 270.99,
    discountPercentage: 20,
    imageUrl: "/makeup-bundle.jpeg",
    slug: { current: "Make-up Bundle" },
    description: "Elevate your beauty game with this 14-in-1 Huda Beauty makeup bundle! Featuring vibrant eyeshadows, foundation, waterproof mascara, long-lasting lipsticks, and essential tools like a makeup sponge and setting spray. Achieve a flawless, long-lasting look with this complete beauty package.",
  },
  {
    _id: "6",
    name: "Night Cream",
    price: 370.99,
    discountPercentage: 20,
    imageUrl: "/night cream.jpg",
    slug: { current: "Night Cream" },
    description: "Achieve radiant, even skin tone with She Beauty's Whitening Serum and Night Cream. This duo brightens and nourishes, enhancing skin repair and hydration for a youthful glow.",
  },
];

export default function PopularProducts() {
  useEffect(() => {
    if (typeof window !== "undefined" && "Snipcart" in window) {
      (window as unknown as { Snipcart: { refresh: () => void } }).Snipcart.refresh();
    }
  }, []);

  return (
    <div id="popular">
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white font-orbitron">
              Most Popular <span className="text-green-500">Products</span>
            </h2>
            <Link href="/products" className="text-green-500 hover:text-green-400 transition-colors">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#111] rounded-lg overflow-hidden relative group hover:transform hover:scale-[1.02] transition-transform duration-300"
              >
                <Link href={`/products/${product.slug.current}`} className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link
                    href={`/products/${product.slug.current}`}
                    className="block hover:text-green-500 transition-colors"
                  >
                    <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">${product.price.toFixed(2)}</span>
                    {product.discountPercentage > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="snipcart-add-item w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                    data-item-id={product._id}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug.current}`}
                    data-item-description={product.description}
                    data-item-image={product.imageUrl}
                    data-item-name={product.name}
                  >
                    Add To Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}