"use client";

import Link from "next/link";
import { ShoppingBag, Phone, Mail, MapPin, Clock, Facebook, Send } from "lucide-react";
import { getSettings } from "@/actions/settings";
import { useEffect, useState } from "react";
import type { Settings } from "@/types";

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const businessName = settings?.business_name || "Ekram Sweet";
  const phone = settings?.phone;
  const email = settings?.support_email;
  const address = settings?.address;
  const hours = settings?.business_hours;
  const telegram = settings?.telegram;
  const facebook = settings?.facebook;

  return (
    <footer className="border-t bg-stone-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-[#c97d4a]" />
              <span className="text-base sm:text-lg font-bold">{businessName}</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Premium quality products made with love. Order online for delivery or pickup.
            </p>
            <div className="flex items-center gap-3">
              {telegram && (
                <a
                  href={telegram.startsWith("http") ? telegram : `https://t.me/${telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[#c97d4a]/10 text-[#c97d4a] hover:bg-[#c97d4a] hover:text-white transition-colors"
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[#c97d4a]/10 text-[#c97d4a] hover:bg-[#c97d4a] hover:text-white transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/contact", label: "Contact" },
                { href: "/track-order", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-[#c97d4a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              {phone && (
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-[#c97d4a] shrink-0" />
                  <span>{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-[#c97d4a] shrink-0" />
                  <span className="break-all">{email}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-[#c97d4a] shrink-0" />
                  <span>{address}</span>
                </li>
              )}
              {hours && (
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-[#c97d4a] shrink-0" />
                  <span>{hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
