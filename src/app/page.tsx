import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicLayout from "./public-layout";
import { getBanners } from "@/actions/banners";
import { getFeaturedProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getSettings } from "@/actions/settings";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [banners, featuredProducts, categories, settings] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
    getCategories(),
    getSettings(),
  ]);

  const heroBanner = banners[0];

  return (
    <PublicLayout>
      {/* ── Hero Section ── */}
      <section className="relative h-[420px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {heroBanner ? (
          <>
            <Image
              src={heroBanner.image}
              alt={heroBanner.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xs sm:max-w-lg md:max-w-xl space-y-4 sm:space-y-6 animate-fade-in-up">
                  <Badge className="bg-[#c97d4a]/20 text-[#c97d4a] border-[#c97d4a]/30 backdrop-blur-sm text-xs sm:text-sm font-medium">
                    New Collection
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                    {heroBanner.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-md leading-relaxed">
                    Premium quality products, crafted with love and delivered to your doorstep.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/products">
                      <Button 
                        size="lg" 
                        className="bg-[#c97d4a] hover:bg-[#b56d3f] text-white gap-2 text-sm sm:text-base shadow-lg shadow-[#c97d4a]/25 transition-all hover:scale-105 active:scale-95"
                      >
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/categories">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 text-sm sm:text-base backdrop-blur-sm"
                      >
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c97d4a] via-[#a0653d] to-[#8b5e3c]">
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xs sm:max-w-lg md:max-w-xl space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Delicious Treats for Every Occasion
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90">
                    Premium quality products, crafted with love and delivered to your doorstep.
                  </p>
                  <Link href="/products">
                    <Button size="lg" className="bg-white text-[#c97d4a] hover:bg-white/90 gap-2 shadow-xl">
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Categories Section ── */}
      <section id="categories" className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-stone-50/80 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#c97d4a]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c97d4a]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c97d4a] bg-[#c97d4a]/8 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c97d4a]" />
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Shop by <span className="text-[#c97d4a] relative inline-block">
                Category
                <svg className="absolute -bottom-1 left-0 w-full h-2 sm:h-3 text-[#c97d4a]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Discover our wide range of carefully curated categories designed to make your shopping experience effortless.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group block"
              >
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl sm:rounded-3xl bg-white hover:-translate-y-2 active:scale-[0.98]">
                  <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image || "/images/placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Category name overlay on image for mobile-first impact */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-1 drop-shadow-lg group-hover:translate-y-0 transition-transform">
                        {category.name}
                      </h3>
                      <span className="inline-flex items-center text-xs text-white/90 font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Explore Collection
                        <ArrowRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Section ── */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c97d4a] bg-[#c97d4a]/8 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c97d4a] text-[#c97d4a]" />
              Best Sellers
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Featured <span className="text-[#c97d4a] relative inline-block">
                Products
                <svg className="absolute -bottom-1 left-0 w-full h-2 sm:h-3 text-[#c97d4a]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Handpicked favorites loved by our customers. Each item is crafted to perfection.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block h-full"
              >
                <Card className="overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl sm:rounded-3xl hover:-translate-y-2 active:scale-[0.98] h-full flex flex-col bg-white">
                  
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-gray-50">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                      </div>
                    )}

                    {/* Hover overlay with quick actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    
                    {/* Quick action buttons - appear on hover */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-[#c97d4a] hover:bg-white transition-colors active:scale-90">
                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-[#c97d4a] hover:bg-white transition-colors active:scale-90">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Badges - positioned top-left, stacked */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.availability === "pre-order" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20">
                          Pre-Order
                        </Badge>
                      )}
                      {product.discount && product.discount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Category badge at bottom */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-gray-700 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border-0">
                        {product.category?.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
                    <div className="space-y-1.5 sm:space-y-2 mb-3">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#c97d4a] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {product.description || "Premium quality product crafted with care"}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-[#c97d4a]">
                          {product.variants && product.variants[0]
                            ? formatPrice(Number(product.variants[0].price))
                            : "ETB 0"}
                        </span>
                        {product.variants && product.variants[0]?.compare_at_price && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                            {formatPrice(Number(product.variants[0].compare_at_price))}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gray-900 hover:bg-[#c97d4a] text-white rounded-full px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-10 sm:mt-14 md:mt-16 text-center">
            <Link href="/products">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-2 border-gray-200 hover:border-[#c97d4a] hover:text-[#c97d4a] hover:bg-[#c97d4a]/5 transition-all duration-300 gap-2 group"
              >
                View All Products 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
