"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { useCart } from "../app/context/CartContext";
import { useWishlist } from "../app/context/WishlistContext";
import { urlFor } from "@/sanity/lib/image";

interface Review {
  id: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface ProductImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  image: ProductImage[]; // Use array for multiple images
  description?: string;
  rating?: number;
  ratingCount?: number;
  keyFeatures?: string[];
}

interface Props {
  product: Product;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: urlFor(product.image[0]).url(), // Use the first image URL
      discountPercentage: product.discountPercentage,
      quantity: 1,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${product._id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [product._id]);

  useEffect(() => {
    localStorage.setItem(`reviews-${product._id}`, JSON.stringify(reviews));
  }, [reviews, product._id]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingReview) {
        const updatedReviews = reviews.map((review) =>
          review.id === editingReview
            ? { ...review, name, email, comment, rating }
            : review
        );
        setReviews(updatedReviews);
      } else {
        const newReview: Review = {
          id: Date.now().toString(),
          name,
          email,
          comment,
          rating,
          createdAt: new Date().toISOString(),
        };
        setReviews((prev) => [newReview, ...prev]);
      }

      setName("");
      setEmail("");
      setComment("");
      setRating(5);
      setEditingReview(null);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err instanceof Error ? err.message : "Error submitting review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (review: Review) => {
    setName(review.name);
    setEmail(review.email);
    setComment(review.comment);
    setRating(review.rating);
    setEditingReview(review.id);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half-star" className="text-yellow-500" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-400" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Image
            src={urlFor(product.image[0]).url()} // Use the first image
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </motion.div>

        <div>
          <h1 className="text-4xl font-bold text-green-500">{product.name}</h1>
          <div className="text-gray-300 mt-4">{product.description}</div>
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-2xl mt-8">Reviews</h2>
        {reviews.map((review) => (
          <div key={review.id} className="mt-4">
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;

