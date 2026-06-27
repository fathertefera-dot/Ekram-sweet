import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
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

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24 bg-gradient-to-b from-background to-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#c97d4a] bg-[#c97d4a]/10 px-4 py-1.5 rounded-full mb-4">
              Browse Categories
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Find Your Favorite <span className="text-[#c97d4a]">Sweet Treats</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Handcrafted cakes, desserts, and bakery products prepared with premium ingredients.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group block">
                <Card className="relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted/20">
                    <Image src={category.image || "/images/placeholder.jpg"} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>
                  <CardContent className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">{category.name}</h3>
                    <span className="flex items-center text-sm text-white/80 transition-colors group-hover:text-white">
                      Explore Collection <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Clean Version */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-stone-50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#c97d4a] bg-[#c97d4a]/10 px-4 py-1.5 rounded-full mb-4">
              Best Sellers
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Featured <span className="text-[#c97d4a]">Products</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Most loved products by our customers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <Card className="relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-16 w-16 text-muted" />
                      </div>
                    )}
                    {product.availability === "pre-order" && (
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Pre-Order
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5 md:p-6">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {product.category?.name}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base md:text-lg mb-1 group-hover:text-[#c97d4a] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {product.description || "Premium quality product"}
                    </p>
                    <div className="flex items-center justify-end pt-2">
                      <div className="text-lg md:text-xl font-bold text-[#c97d4a]">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "ETB 0"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full gap-2">View All Products <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
