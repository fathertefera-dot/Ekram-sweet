"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "@/actions/banners";
import type { Banner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to load banners:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const openForm = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setTitle(banner.title);
      setImage(banner.image);
      setLink(banner.link || "");
      setSortOrder(banner.sort_order);
      setIsActive(banner.is_active);
    } else {
      setEditingBanner(null);
      setTitle("");
      setImage("");
      setLink("");
      setSortOrder(0);
      setIsActive(true);
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("image", image);
      form.append("link", link);
      form.append("sort_order", sortOrder.toString());
      form.append("is_active", isActive.toString());

      if (editingBanner) {
        await updateBanner(editingBanner.id, form);
      } else {
        await createBanner(form);
      }

      setFormOpen(false);
      await loadBanners();
    } catch (error) {
      console.error("Failed to save banner:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      setDeleteConfirm(null);
      await loadBanners();
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage homepage banners</p>
        </div>
        <Button onClick={() => openForm()} className="bg-[#c97d4a] hover:bg-[#b56d3f] gap-2">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No banners found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Banner</th>
                    <th className="text-left py-3 px-4 font-medium">Link</th>
                    <th className="text-left py-3 px-4 font-medium">Sort</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="h-12 w-20 rounded-lg object-cover"
                          />
                          <span className="font-medium">{banner.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">
                        {banner.link || "-"}
                      </td>
                      <td className="py-3 px-4">{banner.sort_order}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          banner.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {banner.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openForm(banner)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(banner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." required />
              {image && (
                <img src={image} alt="Preview" className="h-32 w-full rounded-lg object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/products or https://..." />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} id="active" />
              <Label htmlFor="active" className="cursor-pointer">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#c97d4a] hover:bg-[#b56d3f]">
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                {editingBanner ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this banner?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
