"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Clock, CheckCircle, ChefHat, Truck, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PublicLayout from "../public-layout";
import { trackOrder } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const statusSteps = [
  { status: "pending", label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-100" },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle, color: "text-blue-600 bg-blue-100" },
  { status: "preparing", label: "Preparing", icon: ChefHat, color: "text-purple-600 bg-purple-100" },
  { status: "delivered", label: "Delivered", icon: Truck, color: "text-emerald-600 bg-emerald-100" },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await trackOrder(orderNumber, phoneNumber);
      if (result) {
        setOrder(result);
      } else {
        setError("Order not found. Please check your order number and phone number.");
      }
    } catch {
      setError("An error occurred while tracking your order.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    if (order.status === "cancelled") return -1;
    return statusSteps.findIndex((s) => s.status === order.status);
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order number and phone number to track your order status
          </p>
        </div>

        <Card className="border-0 shadow-md mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_number">Order Number</Label>
                  <Input
                    id="order_number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., IKU-1001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+251 XXX XXX XXX"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c97d4a] hover:bg-[#b56d3f] gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {loading ? "Tracking..." : "Track Order"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {order && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="text-xl font-bold">{order.order_number}</p>
                  </div>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "delivered"
                        : order.status === "cancelled"
                        ? "cancelled"
                        : order.status === "pending"
                        ? "pending"
                        : order.status === "confirmed"
                        ? "confirmed"
                        : "preparing"
                    }
                    className="text-sm px-3 py-1"
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                {order.status === "cancelled" ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-700 font-medium">This order has been cancelled</p>
                    {order.cancel_reason && (
                      <p className="text-red-600 text-sm mt-1">
                        Reason: {order.cancel_reason}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
                      <div
                        className="h-full bg-[#c97d4a] rounded transition-all"
                        style={{
                          width: `${Math.max(
                            0,
                            (getCurrentStepIndex() / (statusSteps.length - 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= getCurrentStepIndex();
                        const isCurrent = index === getCurrentStepIndex();

                        return (
                          <div key={step.status} className="flex flex-col items-center">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                isActive ? step.color : "bg-gray-100 text-gray-400"
                              } ${isCurrent ? "ring-2 ring-offset-2 ring-[#c97d4a]" : ""}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <span
                              className={`text-xs mt-2 font-medium ${
                                isActive ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{order.customer_phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right">{order.delivery_address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium capitalize">
                      {order.payment_method.replace(/_/g, " ")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-[#c97d4a]">
                      {formatPrice(Number(order.total_amount))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        {item.variant_name && (
                          <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                        )}
                        {item.cake_message && (
                          <p className="text-sm text-[#c97d4a]">"{item.cake_message}"</p>
                        )}
                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
