import { MetadataRoute } from "next";
import { getProducts } from "@/actions/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ikusweetcake.com";

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, changefreq: "daily", priority: 1 },
    { url: `${baseUrl}/products`, changefreq: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/track-order`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/cart`, changefreq: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, changefreq: "yearly", priority: 0.3 },
    { url: `${baseUrl}/register`, changefreq: "yearly", priority: 0.3 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { products } = await getProducts({ limit: 100 });
    productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changefreq: "weekly" as const,
      priority: 0.8,
      lastModified: new Date(product.updated_at),
    }));
  } catch {
    // If products fail to load, return static pages only
  }

  return [...staticPages, ...productPages];
}
