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
      <section id="categories" className="py-12 md:py-20 bg-stone-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-[#c97d4a] bg-[#c97d4a]/10 px-3 py-1 rounded-full mb-3">
              Browse Categories
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
              Shop by <span className="text-[#c97d4a]">Category</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group block"
              >
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <Image
                      src={category.image || "/images/placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center text-xs text-[#c97d4a] font-medium">
                      Shop Now
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-[#c97d4a] bg-[#c97d4a]/10 px-3 py-1 rounded-full mb-3">
              Best Sellers
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
              Featured <span className="text-[#c97d4a]">Products</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl hover:-translate-y-1">
                  
                  {/* የምርት ምስል እና ባጆች ክፍል */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 text-gray-300" />
                      </div>
                    )}

                    {/* ✅ ቀይ ቀለም ያከበብኩት ቦታ፦ ሁሉም ባጆች በምስሉ ታች መሃል እዚህ ተቀምጠዋል */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-wrap gap-2">
                      {product.availability === "pre-order" && (
                        <Badge className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                          Pre-Order
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5 shadow-sm">
                        {product.category?.name}
                      </Badge>
                    </div>
                  </div>

                  {/* የምርት መረጃ ክፍል (አሁን ከላይ ባጆች የሉም፣ ንጹህ ነው) */}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm md:text-base line-clamp-1 group-hover:text-[#c97d4a] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description || "Premium quality"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-base md:text-lg font-bold text-[#c97d4a]">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "ETB 0"}
                      </span>
                      <Button size="sm" variant="ghost" className="text-[#c97d4a] hover:bg-[#c97d4a]/10 px-2 h-8 text-xs">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
