"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Cake, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PublicLayout from "../public-layout";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { CartWithItems } from "@/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
      await loadCart();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      await loadCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => {
    const price = item.variant?.price
      ? Number(item.variant.price)
      : item.product.variants?.[0]
      ? Number(item.product.variants[0].price)
      : 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const deliveryFee = subtotal > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-20 w-20 mx-auto text-muted mb-6" />
          <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Looks like you have not added any cakes to your cart yet. Browse our delicious collection and find your perfect cake.
          </p>
          <Link href="/products">
            <Button className="bg-[#c97d4a] hover:bg-[#b56d3f] gap-2">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {cart.items.length} item(s)
              </span>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Clear Cart
              </button>
            </div>

            {cart.items.map((item) => {
              const price = item.variant?.price
                ? Number(item.variant.price)
                : item.product.variants?.[0]
                ? Number(item.product.variants[0].price)
                : 0;

              return (
                <Card key={item.id} className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                      >
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Cake className="h-8 w-8 text-muted" />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-semibold hover:text-[#c97d4a] transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <p className="text-sm text-muted-foreground">
                                Variant: {item.variant.name}
                              </p>
                            )}
                            {item.cake_message && (
                              <p className="text-sm text-[#c97d4a] mt-1">
                                Message: "{item.cake_message}"
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8 rounded border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8 rounded border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-semibold text-[#c97d4a]">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Cart Summary */}
          <div>
            <Card className="border-0 shadow-md sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-[#c97d4a]">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mt-6 bg-[#c97d4a] hover:bg-[#b56d3f] h-12 gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
