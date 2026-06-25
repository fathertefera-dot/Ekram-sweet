"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Cake, Minus, Plus, ShoppingCart, ArrowLeft, Check, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "../../public-layout";
import { getProductBySlug } from "@/actions/products";
import { addToCart } from "@/actions/cart";
import { getFeaturedProducts } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductVariant } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  useEffect(() => {
    async function loadRelated() {
      const data = await getFeaturedProducts();
      setRelatedProducts(data.filter((p) => p.slug !== slug).slice(0, 4));
    }
    loadRelated();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(
        product.id,
        selectedVariant?.id || null,
        quantity,
        cakeMessage || undefined
      );
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Cake className="h-16 w-16 mx-auto text-muted mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The product you are looking for does not exist.
          </p>
          <Link href="/products">
            <Button className="bg-[#c97d4a] hover:bg-[#b56d3f]">
              <ArrowLeft className="h-4 w-4 mr-2" /> Browse Products
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const images = product.images || [];
  const variants = product.variants || [];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[#c97d4a]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#c97d4a]">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage].image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Cake className="h-24 w-24 text-muted" />
                </div>
              )}
              {product.availability === "pre-order" && (
                <Badge className="absolute top-4 left-4 bg-amber-500 text-white text-sm px-3 py-1">
                  Pre-Order
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? "border-[#c97d4a]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category?.name}</Badge>
                {product.featured && (
                  <Badge className="bg-[#c97d4a] text-white">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "A delicious handcrafted cake made with premium ingredients."}
              </p>
            </div>

            <Separator />

            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Size / Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-[#c97d4a] bg-[#c97d4a]/10 text-[#c97d4a]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {variant.name} - {formatPrice(Number(variant.price))}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#c97d4a]">
                {selectedVariant
                  ? formatPrice(Number(selectedVariant.price) * quantity)
                  : "ETB 0"}
              </span>
              {quantity > 1 && selectedVariant && (
                <span className="text-muted-foreground">
                  ({formatPrice(Number(selectedVariant.price))} each)
                </span>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cake Message */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MessageSquare className="h-4 w-4" />
                Cake Message (Optional)
              </label>
              <Textarea
                placeholder="Enter a custom message for your cake..."
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Availability Warning */}
            {product.availability === "pre-order" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>This item requires pre-ordering. Please allow extra time for preparation.</span>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-[#c97d4a] hover:bg-[#b56d3f] h-12 text-lg gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Link href="/cart">
                <Button variant="outline" className="h-12 px-6">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${rp.slug}`}>
                  <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all border-0 shadow-md">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {rp.images && rp.images[0] ? (
                        <Image
                          src={rp.images[0].image_url}
                          alt={rp.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Cake className="h-12 w-12 text-muted" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-[#c97d4a] transition-colors">
                        {rp.name}
                      </h3>
                      <p className="text-sm text-[#c97d4a] font-medium mt-1">
                        {rp.variants && rp.variants[0]
                          ? formatPrice(Number(rp.variants[0].price))
                          : "ETB 0"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
