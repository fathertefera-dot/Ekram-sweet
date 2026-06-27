"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Smartphone, Building2, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PublicLayout from "../public-layout";
import { getCart } from "@/actions/cart";
import { createOrder } from "@/actions/orders";
import { getActivePaymentMethods } from "@/actions/settings";
import { clearCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import type { CartWithItems, PaymentMethod } from "@/types";

// 🔧 [Bug Fix #10] - Extract delivery fee to a constant
const DELIVERY_FEE_ETB = 150;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: "",
    order_note: "",
    payment_method: "cash_on_delivery" as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    try {
      const [cartData, methods] = await Promise.all([getCart(), getActivePaymentMethods()]);
      setCart(cartData);
      setPaymentMethods(methods);

      if (!cartData?.items || cartData.items.length === 0) {
        router.push("/cart");
        return;
      }
    } catch (error) {
      console.error("Failed to load checkout data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔧 [Bug Fix #9] - Use Zod schema for validation
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    // We need to check errors here instead of inline if
    setErrors({});

    if (!cart?.items) return;

    setSubmitting(true);
    try {
      const items = cart.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id || undefined,
        variant_name: item.variant?.name || item.product.variants?.[0]?.name,
        product_name: item.product.name,
        price: item.variant?.price
          ? Number(item.variant.price)
          : item.product.variants?.[0]?.price
          ? Number(item.product.variants[0].price)
          : 0,
        quantity: item.quantity,
        cake_message: item.cake_message || undefined,
      }));

      // 🔧 [Bug Fix #3] - Server will recalculate total_amount; we don't pass it here
      const order = await createOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || undefined,
        delivery_address: formData.delivery_address,
        order_note: formData.order_note || undefined,
        payment_method: formData.payment_method,
        items,
      });

      await clearCart();
      router.push(`/order-success?order=${order.order_number}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  const subtotal = cart?.items?.reduce((sum, item) => {
    const price = item.variant?.price
      ? Number(item.variant.price)
      : item.product.variants?.[0]
      ? Number(item.product.variants[0].price)
      : 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const deliveryFee = subtotal > 0 ? DELIVERY_FEE_ETB : 0; // Reuse constant
  const total = subtotal + deliveryFee;

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Cart
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        placeholder="Enter your full name"
                        className={errors.customer_name ? "border-red-500" : ""}
                      />
                      {errors.customer_name && <p className="text-xs text-red-500">{errors.customer_name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customer_phone"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        placeholder="+251 XXX XXX XXX"
                        className={errors.customer_phone ? "border-red-500" : ""}
                      />
                      {errors.customer_phone && <p className="text-xs text-red-500">{errors.customer_phone}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customer_email">Email (Optional)</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery_address">
                        Delivery Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="delivery_address"
                        value={formData.delivery_address}
                        onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                        placeholder="Enter your full delivery address"
                        rows={3}
                        className={errors.delivery_address ? "border-red-500" : ""}
                      />
                      {errors.delivery_address && <p className="text-xs text-red-500">{errors.delivery_address}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order_note">Order Note (Optional)</Label>
                      <Textarea
                        id="order_note"
                        value={formData.order_note}
                        onChange={(e) => setFormData({ ...formData, order_note: e.target.value })}
                        placeholder="Any special instructions..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <RadioGroup
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value as PaymentMethod })}
                    className="space-y-3"
                  >
                    {paymentMethods.includes("cash_on_delivery") && (
                      <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="cash_on_delivery" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Truck className="h-5 w-5 text-[#c97d4a]" />
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive</div>
                          </div>
                        </Label>
                      </div>
                    )}
                    {paymentMethods.includes("telebirr") && (
                      <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="telebirr" id="telebirr" />
                        <Label htmlFor="telebirr" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Smartphone className="h-5 w-5 text-[#c97d4a]" />
                          <div>
                            <div className="font-medium">Telebirr</div>
                            <div className="text-sm text-muted-foreground">Pay with Telebirr mobile money</div>
                          </div>
                        </Label>
                      </div>
                    )}
                    {paymentMethods.includes("bank_transfer") && (
                      <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="bank_transfer" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5 text-[#c97d4a]" />
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-muted-foreground">Direct bank transfer</div>
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-0 shadow-md sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cart?.items?.map((item) => {
                      const price = item.variant?.price
                        ? Number(item.variant.price)
                        : item.product.variants?.[0]
                        ? Number(item.product.variants[0].price)
                        : 0;

                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{item.product.name}</p>
                            {item.variant && <p className="text-xs text-muted-foreground">{item.variant.name}</p>}
                            <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                          </div>
                          <span className="font-medium ml-2">{formatPrice(price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-[#c97d4a]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 bg-[#c97d4a] hover:bg-[#b56d3f] h-12 text-lg gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
