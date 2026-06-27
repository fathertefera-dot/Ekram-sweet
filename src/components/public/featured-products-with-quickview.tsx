"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";

export default function FeaturedProductsWithQuickView({ products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block"
          >
            <Card className="relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
              {/* Image Area */}
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
                {/* Badge */}
                {product.availability === "pre-order" && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    Pre-Order
                  </Badge>
                )}
                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                    }}
                  >
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Product Info */}
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
                <div className="flex items-end justify-between">
                  <div className="text-lg md:text-xl font-bold text-[#c97d4a]">
                    {product.variants && product.variants[0]
                      ? formatPrice(Number(product.variants[0].price))
                      : "ETB 0"}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#c97d4a] hover:bg-[#b56d3f] text-white rounded-full px-4"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick View Bottom Sheet */}
      {quickViewProduct && (
        <Sheet open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
          <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] overflow-y-auto p-0 bg-background border-0 rounded-t-3xl shadow-2xl">
            {/* Sheet Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur border-b">
              <h2 className="text-lg font-semibold">Quick View</h2>
              <Button variant="ghost" size="icon" onClick={() => setQuickViewProduct(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Sheet Content */}
            <div className="p-4 md:p-6 space-y-6">
              {/* Product Image */}
              <div className="relative aspect-square max-h-80 mx-auto w-full rounded-xl overflow-hidden bg-gray-100">
                {quickViewProduct.images && quickViewProduct.images[0] ? (
                  <Image src={quickViewProduct.images[0].image_url} alt={quickViewProduct.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><ShoppingBag className="h-12 w-12 text-muted" /></div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold">{quickViewProduct.name}</h3>
                  <span className="text-2xl font-bold text-[#c97d4a]">
                    {quickViewProduct.variants && quickViewProduct.variants[0] 
                      ? formatPrice(Number(quickViewProduct.variants[0].price)) 
                      : "ETB 0"}
                  </span>
                </div>
                
                {quickViewProduct.category && (
                  <Badge variant="secondary" className="text-xs font-normal">{quickViewProduct.category.name}</Badge>
                )}
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {quickViewProduct.description || "Premium quality product crafted with love."}
                </p>
                
                {/* Add to Cart Button */}
                <Button 
                  onClick={() => {
                    // Placeholder: Logic to add to cart goes here
                    setQuickViewProduct(null);
                  }} 
                  className="w-full h-12 text-lg bg-[#c97d4a] hover:bg-[#b56d3f] gap-2 mt-4"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
