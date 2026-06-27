import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "../public-layout";
import { getCategories } from "@/actions/categories";

export const metadata = {
  title: "Categories - Ekram Sweet",
  description: "Browse all our delicious cake categories and find your perfect sweet treat.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PublicLayout>
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-stone-50/80 to-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#c97d4a]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c97d4a]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c97d4a] bg-[#c97d4a]/8 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c97d4a]" />
              Explore All Categories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Choose Your <span className="text-[#c97d4a]">Sweet Treat</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              From classic birthday cakes to elegant wedding masterpieces, find the perfect cake for your special moments.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group block"
              >
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
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6">
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
    </PublicLayout>
  );
}
