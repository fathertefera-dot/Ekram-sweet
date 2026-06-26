"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
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
          {navLinks.map((link) => (
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full width dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-[#c97d4a] bg-[#c97d4a]/10"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 pb-2 border-t mt-2 space-y-1">
              {user ? (
                <>
                  {admin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-3 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#c97d4a] hover:bg-[#b56d3f]" size="sm">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
