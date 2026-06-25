"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  CheckCircle,
  Cake,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderStats } from "@/actions/orders";
import { getAllOrders } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, ordersData] = await Promise.all([
          getOrderStats(),
          getAllOrders({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.orders);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-100",
      href: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600 bg-amber-100",
      href: "/admin/orders",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
      href: "/admin/orders",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Cake,
      color: "text-purple-600 bg-purple-100",
      href: "/admin/products",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-1">
                      {loading ? "-" : card.value}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Order
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{order.order_number}</td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer_phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
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
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {formatPrice(Number(order.total_amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
