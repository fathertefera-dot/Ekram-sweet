import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cake, Phone, MapPin, Clock, Star } from "lucide-react";
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
  const businessName = settings?.business_name || "Iku Sweet Cake";

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroBanner ? (
          <>
            <Image
              src={heroBanner.image}
              alt={heroBanner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {heroBanner.title}
                  </h1>
                  <p className="text-lg text-white/90">
                    Freshly baked with love, delivered to your doorstep. Perfect for birthdays, weddings, and every celebration.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products">
                      <Button size="lg" className="bg-[#c97d4a] hover:bg-[#b56d3f] text-white gap-2">
                        Order Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Learn More
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
                <div className="max-w-xl space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Delicious Cakes for Every Occasion
                  </h1>
                  <p className="text-lg text-white/90">
                    Freshly baked with love, delivered to your doorstep. Perfect for birthdays, weddings, and every celebration.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/products">
                      <Button size="lg" className="bg-white text-[#c97d4a] hover:bg-white/90 gap-2">
                        Order Now <ArrowRight className="h-4 w-4" />
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Our Categories</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Explore our wide range of cake categories, each crafted with premium ingredients
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <Image
                      src={category.image || "/images/placeholder-cake.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Cakes</h2>
              <p className="text-muted-foreground">Our most popular creations</p>
            </div>
            <Link href="/products" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Cake className="h-16 w-16 text-muted" />
                      </div>
                    )}
                    {product.availability === "pre-order" && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                        Pre-Order
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-[#c97d4a] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description || "Delicious handcrafted cake"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#c97d4a]">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "From ETB 0"}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {product.category?.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={settings?.about_image || "/images/about-cake.jpg"}
                alt={settings?.about_title || "About Iku Sweet Cake"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5">
              <h2 className="text-3xl font-bold">
                {settings?.about_title || "Crafting Sweet Memories"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {settings?.about_content ||
                  "At Iku Sweet Cake, we believe every celebration deserves a perfect cake. Our skilled bakers use only the finest ingredients to create delicious masterpieces that not only look stunning but taste incredible too. From birthdays to weddings, we are here to make your special moments even sweeter."}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c97d4a]">50+</div>
                  <div className="text-sm text-muted-foreground">Cake Varieties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c97d4a]">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c97d4a]">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
              <Link href="/about">
                <Button className="bg-[#c97d4a] hover:bg-[#b56d3f] mt-4">
                  Read Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Get In Touch</h2>
            <p className="text-muted-foreground">We would love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6 border-0 shadow-md">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-[#c97d4a]" />
              </div>
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">{settings?.phone || "+251 XXX XXX XXX"}</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-md">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-[#c97d4a]" />
              </div>
              <h3 className="font-semibold mb-1">Address</h3>
              <p className="text-sm text-muted-foreground">{settings?.address || "Addis Ababa, Ethiopia"}</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-md">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#c97d4a]" />
              </div>
              <h3 className="font-semibold mb-1">Business Hours</h3>
              <p className="text-sm text-muted-foreground">{settings?.business_hours || "Mon-Sat: 8AM - 8PM"}</p>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
