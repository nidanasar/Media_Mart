"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSearch } from "../app/context/SearchContext"
import { useCart } from "../app/context/CartContext"
import type React from "react"

interface Product {
  _id: string
  name: string
  price: number
  discountPercentage: number
  imageUrl: string
  slug: { current: string }
  description?: string
  rating?: number
  ratingCount?: number
  keyFeatures?: string[]
}

interface ProductsProps {
  products: Product[]
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const { searchQuery } = useSearch()
  const { addToCart } = useCart()
  const [sortBy, setSortBy] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [hasDiscount, setHasDiscount] = useState<boolean | null>(null)

  // Extract all unique features from products
  const allFeatures = Array.from(new Set(products.flatMap((p) => p.keyFeatures || [])))

  // Get min and max prices from products
  const maxPrice = Math.max(...products.map((p) => p.price))
  const minPrice = Math.min(...products.map((p) => p.price))

  // Initialize Snipcart
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
    // Safe check for Snipcart existence
    if (typeof window !== "undefined" && window.Snipcart) {
      window.Snipcart.refresh()
    }
  }, [minPrice, maxPrice])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesFeatures =
        selectedFeatures.length === 0 || selectedFeatures.every((feature) => product.keyFeatures?.includes(feature))
      const matchesRating = (product.rating || 0) >= minRating
      const matchesDiscount =
        hasDiscount === null || (hasDiscount ? product.discountPercentage > 0 : product.discountPercentage === 0)

      return matchesSearch && matchesPrice && matchesFeatures && matchesRating && matchesDiscount
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "popularity":
          return (b.ratingCount || 0) - (a.ratingCount || 0)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{filteredProducts.length} products found</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-gray-900 p-6 rounded-lg h-fit">
            <div>
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Minimum Rating</h4>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Star</option>
                </select>
              </div>

              {/* Discount Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Discount</h4>
                <select
                  value={hasDiscount === null ? "" : hasDiscount.toString()}
                  onChange={(e) => {
                    const value = e.target.value
                    setHasDiscount(value === "" ? null : value === "true")
                  }}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Products</option>
                  <option value="true">On Sale</option>
                  <option value="false">Regular Price</option>
                </select>
              </div>

              {/* Features Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="space-y-2">
                  {allFeatures.slice(0, 5).map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, feature])
                          } else {
                            setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
                          }
                        }}
                        className="form-checkbox text-green-500 rounded"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#111] rounded-lg overflow-hidden relative group"
                >
                  <Link href={`/products/${product.slug.current}`} className="block">
                    <div className="aspect-square relative">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
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
                      <span className="text-green-500 font-bold">${product.price}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-gray-400 line-through text-sm">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <span className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </span>
                        <span className="ml-1">({product.ratingCount || 0})</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="snipcart-add-item w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                      data-item-id={product._id}
                      data-item-name={product.name}
                      data-item-price={product.price}
                      data-item-url={`/products/${product.slug.current}`}
                      data-item-image={product.imageUrl}
                      data-item-description={product.description || product.name}
                      onClick={() =>
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          imageUrl: product.imageUrl,
                          discountPercentage: product.discountPercentage,
                        })
                      }
                    >
                      Add To Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products