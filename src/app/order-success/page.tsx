"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "../public-layout";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "N/A";

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We will start preparing your delicious cake right away.
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Your Order Number</p>
              <p className="text-2xl font-bold text-[#c97d4a] tracking-wider">{orderNumber}</p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                We will contact you to confirm your order
              </p>
              <p>
                You can track your order status using your order number and phone number
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/track-order?order=${orderNumber}`}>
                <Button className="w-full bg-[#c97d4a] hover:bg-[#b56d3f] gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Track Your Order
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
