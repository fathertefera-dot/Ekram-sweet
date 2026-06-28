"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Cake,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/actions/products";
import { getAllCategories } from "@/actions/categories";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  availability: string;
  featured: boolean;
  status: string;
  meta_title: string;
  meta_description: string;
  images: string[];
  variants: { name: string; price: number }[];
};

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  category_id: "",
  availability: "available",
  featured: false,
  status: "draft",
  meta_title: "",
  meta_description: "",
  images: [],
  variants: [{ name: "", price: 0 }],
};

export default function AdminProductsPage() {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllProducts({
        page: currentPage,
        limit: 10,
        search: search || undefined,
      });
      setProducts(result.products);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please refresh.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, toast]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts]);

  async function loadCategories() {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      // Non-critical — form will have an empty category list
    }
  }

  const openForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        category_id: product.category_id,
        availability: product.availability,
        featured: product.featured,
        status: product.status,
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        images: product.images?.map((i) => i.image_url) || [],
        variants:
          product.variants?.map((v) => ({
            name: v.name,
            price: Number(v.price),
          })) || [{ name: "", price: 0 }],
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyForm);
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append(
        "slug",
        formData.slug ||
          formData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
      );
      form.append("description", formData.description);
      form.append("category_id", formData.category_id);
      form.append("availability", formData.availability);
      form.append("featured", formData.featured.toString());
      form.append("status", formData.status);
      form.append("meta_title", formData.meta_title);
      form.append("meta_description", formData.meta_description);
      form.append("images", JSON.stringify(formData.images));
      form.append(
        "variants",
        JSON.stringify(formData.variants.filter((v) => v.name.trim()))
      );

      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
        toast({ title: "Product updated successfully" });
      } else {
        await createProduct(form);
        toast({ title: "Product created successfully" });
      }

      setFormOpen(false);
      setFormData(emptyForm);
      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      toast({ title: "Product deleted successfully" });
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageUrl.trim()] });
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", price: 0 }],
    });
  };

  const updateVariant = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your cake products</p>
        </div>
        <Button
          onClick={() => openForm()}
          className="bg-[#c97d4a] hover:bg-[#b56d3f] gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Cake className="h-5 w-5 text-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              /{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.category?.name}</td>
                      <td className="py-3 px-4">
                        {product.variants && product.variants[0]
                          ? formatPrice(Number(product.variants[0].price))
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            product.status === "active"
                              ? "delivered"
                              : product.status === "draft"
                              ? "pending"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openForm(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(product.id)}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {total}
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="auto-generated-if-empty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category_id: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(v) =>
                    setFormData({ ...formData, availability: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pre-order">Pre-Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured on homepage
              </Label>
            </div>

            <Separator />

            {/* Images */}
            <div>
              <Label className="mb-2 block">Images</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addImage())
                  }
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-16 w-16 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white rounded-bl flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Variants */}
            <div>
              <Label className="mb-2 block">Variants *</Label>
              <div className="space-y-2">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Name (e.g., Small, 1KG)"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={variant.price || ""}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      disabled={formData.variants.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="mt-2"
              >
                Add Variant
              </Button>
            </div>

            <Separator />

            {/* SEO */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Input
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#c97d4a] hover:bg-[#b56d3f]"
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                )}
                {editingProduct ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
