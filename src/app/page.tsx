import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Phone, MapPin, Clock, Star } from "lucide-react";
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
  const businessName = settings?.business_name || "Ekram Sweet";

  return (
    <PublicLayout>
      {/* Hero Section - Mobile First */}
      <section className="relative h-[380px] sm:h-[460px] md:h-[560px] overflow-hidden">
        {heroBanner ? (
          <>
            <Image
              src={heroBanner.image}
              alt={heroBanner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-sm sm:max-w-lg space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {heroBanner.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90">
                    Premium quality products, crafted with love and delivered to your doorstep.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products">
                      <Button size="default" className="bg-[#c97d4a] hover:bg-[#b56d3f] text-white gap-2 text-sm sm:text-base">
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c97d4a] to-[#8b5e3c]">
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-sm sm:max-w-xl space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Delicious Treats for Every Occasion
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90">
                    Premium quality products, crafted with love and delivered to your doorstep.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products">
                      <Button size="default" className="bg-white text-[#c97d4a] hover:bg-white/90 gap-2">
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section - Mobile First (id="categories" ተጨምሯል) */}
      <section id="categories" className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-7 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Our Categories</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Explore our wide range of products, each crafted with premium ingredients
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <Image
                      src={category.image || "/images/placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Mobile First */}
      <section className="py-10 sm:py-14 md:py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-7 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Featured Products</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Our most popular items</p>
            </div>
            <Link href="/products" className="hidden sm:block">
              <Button variant="outline" className="gap-2 text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                  <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-muted" />
                      </div>
                    )}
                    {product.availability === "pre-order" && (
                      <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-500 text-white text-xs">
                        Pre-Order
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 group-hover:text-[#c97d4a] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                      {product.description || "Premium quality product"}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-[#c97d4a]">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "ETB 0"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs hidden sm:inline-flex">
                        {product.category?.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
