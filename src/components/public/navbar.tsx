"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Home,
  Layers,
  Truck,
  Cake,
  Info,
  Settings,
  LogIn,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCartCount } from "@/actions/cart";
import { getCurrentUser, logout, isAdmin } from "@/actions/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [admin, setAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoriesActive, setIsCategoriesActive] = useState(false);

  useEffect(() => {
    async function loadData() {
      const count = await getCartCount();
      setCartCount(count);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await isAdmin();
        setAdmin(adminStatus);
      }
    }
    loadData();
  }, [pathname]);

  // Categories scroll & active state
  useEffect(() => {
    if (pathname === "/") {
      const navigateToCategories = sessionStorage.getItem("navigateToCategories");
      if (navigateToCategories === "true") {
        setIsCategoriesActive(true);
        sessionStorage.removeItem("navigateToCategories");
        setTimeout(() => {
          document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        setIsCategoriesActive(window.location.hash === "#categories");
      }
    } else {
      setIsCategoriesActive(false);
    }
  }, [pathname]);

  const handleCategoriesClick = () => {
    setMobileMenuOpen(false);
    sessionStorage.setItem("navigateToCategories", "true");
    router.push("/");
  };

  // Menu items grouped
  const shopItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/#categories", label: "Categories", icon: Layers, onClick: handleCategoriesClick },
    { href: "/products", label: "Products", icon: Cake },
    { href: "/about", label: "About", icon: Info },
  ];

  const orderItems = [
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/track-order", label: "Track Order", icon: Truck },
  ];

  const accountItems = user
    ? [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "#", label: "Logout", icon: LogOut, onClick: logout },
      ]
    : [{ href: "/login", label: "Login / Register", icon: LogIn }];

  const desktopNavLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/track-order", label: "Track Order" },
    { href: "/contact", label: "Contact" },
  ];

  const renderNavItem = (item: any, isActive: boolean, isButton = false) => {
    const commonClasses = `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#c97d4a]/10 text-[#c97d4a] border-l-4 border-[#c97d4a]"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;
    if (isButton) {
      return (
        <button
          key={item.label}
          onClick={item.onClick}
          className={commonClasses}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </button>
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileMenuOpen(false)}
        className={commonClasses}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Left section: Mobile menu + logo */}
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 -ml-2 rounded-md hover:bg-muted touch-manipulation"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[300px] sm:w-[340px] shadow-2xl border-0 bg-background p-0"
            >
              {/* Sidebar Header with Gradient Background */}
              <div className="bg-gradient-to-r from-[#c97d4a] to-[#e8a06b] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Ekram Sweet</h2>
                    <p className="text-sm text-white/80">Fresh Cakes & Desserts</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Cards */}
              <div className="grid grid-cols-2 gap-3 p-4">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 hover:bg-muted/50 transition-all duration-200"
                >
                  <Cake className="h-6 w-6 text-[#c97d4a]" />
                  <span className="mt-1 text-sm font-medium">Products</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex flex-col items-center justify-center rounded-xl border bg-card p-4 hover:bg-muted/50 transition-all duration-200"
                >
                  <ShoppingCart className="h-6 w-6 text-[#c97d4a]" />
                  <span className="mt-1 text-sm font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c97d4a] text-[10px] font-medium text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Navigation Groups */}
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                {/* SHOP */}
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Shop
                  </h3>
                  <div className="space-y-1">
                    {shopItems.map((item) => {
                      const isActive =
                        item.label === "Categories"
                          ? isCategoriesActive
                          : pathname === item.href;
                      if (item.onClick) {
                        return renderNavItem(item, isActive, true);
                      }
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>

                {/* ORDERS */}
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Orders
                  </h3>
                  <div className="space-y-1">
                    {orderItems.map((item) => {
                      const isActive = pathname === item.href;
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>

                {/* ACCOUNT */}
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account
                  </h3>
                  <div className="space-y-1">
                    {accountItems.map((item) => {
                      const isActive = pathname === item.href;
                      if (item.onClick) {
                        return renderNavItem(item, isActive, true);
                      }
                      return renderNavItem(item, isActive);
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-3">
                <Button
                  className="w-full bg-[#c97d4a] hover:bg-[#b56d3f]"
                  onClick={() => {
                    // Placeholder for phone order action
                    window.location.href = "tel:+251911234567";
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Order via Phone
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Ekram Sweet v1.0
                </p>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-[#c97d4a]" />
            <span className="text-base sm:text-xl font-bold tracking-tight">Ekram Sweet</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {desktopNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                pathname === link.href
                  ? "text-[#c97d4a] bg-[#c97d4a]/10"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 sm:h-10 sm:w-10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#c97d4a] text-[9px] sm:text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {admin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <form action={logout}>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="gap-1 text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#c97d4a] hover:bg-[#b56d3f]">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
