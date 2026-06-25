"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Eye, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getAllOrders, updateOrderStatus, cancelOrder } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const statusOptions: OrderStatus[] = ["pending", "confirmed", "preparing", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllOrders({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        status: (statusFilter as OrderStatus) || undefined,
      });
      setOrders(result.orders);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder || !cancelReason.trim()) return;
    setActionLoading(true);
    try {
      await cancelOrder(selectedOrder.id, cancelReason);
      await loadOrders();
      setCancelOpen(false);
      setCancelReason("");
      setSelectedOrder(null);
      setDetailOpen(false);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => { setStatusFilter(value as OrderStatus); setCurrentPage(1); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Payment</th>
                    <th className="text-right py-3 px-4 font-medium">Total</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{order.order_number}</td>
                      <td className="py-3 px-4">{order.customer_name}</td>
                      <td className="py-3 px-4">{order.customer_phone}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 capitalize">
                        {order.payment_method.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatPrice(Number(order.total_amount))}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {orders.length} of {total} orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    selectedOrder.status === "delivered"
                      ? "delivered"
                      : selectedOrder.status === "cancelled"
                      ? "cancelled"
                      : selectedOrder.status === "pending"
                      ? "pending"
                      : selectedOrder.status === "confirmed"
                      ? "confirmed"
                      : "preparing"
                  }
                  className="capitalize text-sm"
                >
                  {selectedOrder.status}
                </Badge>
                <span className="font-bold text-lg text-[#c97d4a]">
                  {formatPrice(Number(selectedOrder.total_amount))}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{selectedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-right max-w-[200px]">{selectedOrder.delivery_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="capitalize">{selectedOrder.payment_method.replace(/_/g, " ")}</span>
                </div>
                {selectedOrder.order_note && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Note</span>
                    <span className="text-right max-w-[200px]">{selectedOrder.order_note}</span>
                  </div>
                )}
                {selectedOrder.cancel_reason && (
                  <div className="p-2 bg-red-50 rounded text-red-700 text-xs">
                    Cancel reason: {selectedOrder.cancel_reason}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.product_name}</span>
                        {item.variant_name && (
                          <span className="text-muted-foreground"> ({item.variant_name})</span>
                        )}
                        <span className="text-muted-foreground"> x{item.quantity}</span>
                        {item.cake_message && (
                          <p className="text-xs text-[#c97d4a]">"{item.cake_message}"</p>
                        )}
                      </div>
                      <span>{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Status Update */}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                <div>
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions
                      .filter((s) => s !== selectedOrder.status && s !== "cancelled")
                      .map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant="outline"
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                          className="capitalize"
                        >
                          {actionLoading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                          Mark {status}
                        </Button>
                      ))}
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading}
                      onClick={() => { setCancelOpen(true); setDetailOpen(false); }}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for cancelling this order.
            </p>
            <Input
              placeholder="Enter cancel reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || actionLoading}
              onClick={handleCancel}
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
