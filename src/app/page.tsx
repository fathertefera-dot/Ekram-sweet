import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative h-[420px] sm:h-[520px] md:h-[620px] lg:h-[720px] overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xs sm:max-w-lg md:max-w-xl space-y-4 sm:space-y-6">
                  <Badge className="bg-[#c97d4a]/20 text-[#c97d4a] border-[#c97d4a]/30 backdrop-blur-sm text-xs sm:text-sm font-medium px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1" /> New Arrivals
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                    {heroBanner.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-md leading-relaxed">
                    Premium quality products, crafted with love and delivered to your doorstep.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/products">
                      <Button
                        size="lg"
                        className="bg-[#c97d4a] hover:bg-[#b56d3f] text-white gap-2 text-sm sm:text-base shadow-lg shadow-[#c97d4a]/25 transition-all hover:scale-105 active:scale-95 rounded-full px-6"
                      >
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {/* ✅ እዚህ ላይ ወደ አዲሱ የ Categories ገጽ እንዲመራ ቀይሬያለሁ */}
                    <Link href="/categories">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 text-sm sm:text-base backdrop-blur-sm rounded-full px-6"
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
                    <Button size="lg" className="bg-white text-[#c97d4a] hover:bg-white/90 gap-2 shadow-xl rounded-full px-6">
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section (የቤት ገጹ ክፍል) */}
      <section id="categories" className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-stone-50/80 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#c97d4a]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c97d4a]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c97d4a] bg-[#c97d4a]/8 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c97d4a]" />
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Shop by <span className="text-[#c97d4a]">Category</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Discover our wide range of carefully curated categories designed to make your shopping experience effortless.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group block">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl sm:rounded-3xl bg-white hover:-translate-y-2 active:scale-[0.98]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image || "/images/placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-1 drop-shadow-lg">
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

      {/* Featured Products Section (ቀደም ብለን ያጠራነው) */}
      <section className="py-16 sm:py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c97d4a] bg-[#c97d4a]/8 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c97d4a] text-[#c97d4a]" />
              Best Sellers
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Featured <span className="text-[#c97d4a]">Products</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Handpicked favorites loved by our customers. Each item is crafted to perfection.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block h-full">
                <Card className="overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl sm:rounded-3xl hover:-translate-y-2 active:scale-[0.98] h-full flex flex-col bg-white">
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
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.availability === "pre-order" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20">
                          Pre-Order
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-gray-700 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border-0">
                        {product.category?.name}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
                    <div className="space-y-1.5 sm:space-y-2 mb-3">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#c97d4a] transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {product.description || "Premium quality product crafted with care"}
                      </p>
                    </div>
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-[#c97d4a]">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "ETB 0"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 md:mt-16 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-2 border-gray-200 hover:border-[#c97d4a] hover:text-[#c97d4a] hover:bg-[#c97d4a]/5 transition-all duration-300 gap-2 group">
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
