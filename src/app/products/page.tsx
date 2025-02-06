// import { client } from "@/sanity/lib/client"
// import { groq } from "next-sanity"
// import Products from "../../components/Products"

// async function getAllProducts() {
//   const query = groq`
//     *[_type == "product"]{
//       _id,
//       name,
//       slug,
//       description,
//       price,
//       discountPercentage,
//       priceWithoutDiscount,
//       rating,
//       ratingCount,
//       tags,
//       sizes,
//       "imageUrl": image.asset->url,
//       keyFeatures
//     }
//   `

//   const products = await client.fetch(query)
//   return products
// }

// export const revalidate = 10 // Revalidate every 10 seconds

// export default async function ProductsPage() {
//   const products = await getAllProducts()

//   return (
//     <div>
//       <div className="min-h-screen bg-black">
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">All Products</h1>
//           <Products products={products} />
//         </div>
//       </div>
//     </div>
//   )
// }

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Products from "../../components/Products";
import Link from "next/link";

const ITEMS_PER_PAGE = 5; // Show 5 products per page

async function getAllProducts(page: number) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const query = groq`
    *[_type == "product"] | order(_createdAt desc) [${start}...${start + ITEMS_PER_PAGE}] {
      _id,
      name,
      slug,
      description,
      price,
      discountPercentage,
      priceWithoutDiscount,
      rating,
      ratingCount,
      tags,
      sizes,
      "imageUrl": image.asset->url,
      keyFeatures
    }
  `;

  const products = await client.fetch(query);
  return products;
}

// Get total products count for pagination
async function getTotalProducts() {
  const query = groq`count(*[_type == "product"])`;
  return await client.fetch(query);
}

export const revalidate = 10; // Revalidate every 10 seconds

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page) || 1; // Default to page 1
  const products = await getAllProducts(page);
  const totalProducts = await getTotalProducts();
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">All Products</h1>
          <Products products={products} />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            {page > 1 && (
              <Link href={`?page=${page - 1}`} className="bg-gray-700 text-white px-4 py-2 rounded">
                Previous
              </Link>
            )}
            <span className="text-white px-4 py-2">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={`?page=${page + 1}`} className="bg-gray-700 text-white px-4 py-2 rounded">
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
