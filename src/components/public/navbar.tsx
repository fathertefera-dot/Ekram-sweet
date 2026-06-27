"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LogIn
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
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [admin, setAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // የሞባይል ሳይድ ባር ዝርዝር (Menu items)
  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Categories", icon: Layers },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/track-order", label: "Track Order", icon: Truck },
    { href: "/products", label: "Products", icon: Cake },
    { href: "/about", label: "About", icon: Info },
  ];

  const desktopNavLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/track-order", label: "Track Order" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-[#c97d4a]" />
          <span className="text-base sm:text-xl font-bold tracking-tight">Ekram Sweet</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {desktopNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
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
          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#c97d4a] text-[9px] sm:text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Desktop User Actions */}
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
                <Button variant="ghost" size="sm" type="submit" className="gap-1 text-muted-foreground">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#c97d4a] hover:bg-[#b56d3f]">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger (Hamburger) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-md hover:bg-muted touch-manipulation" aria-label="Toggle menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 border-r-0 bg-white">
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="px-6 py-5 border-b">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingBag className="h-6 w-6 text-[#c97d4a]" />
                    <span className="text-lg font-bold">Ekram Sweet</span>
                  </Link>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#c97d4a]/10 text-[#c97d4a]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Sidebar Footer (Settings & Auth) */}
                <div className="p-4 border-t space-y-1">
                  {user ? (
                    <div className="space-y-1">
                      <Link
                        href="/admin/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        Settings
                      </Link>
                      <form action={logout}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <LogIn className="h-5 w-5" />
                        Login / Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
