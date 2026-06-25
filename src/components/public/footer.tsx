"use client";

import Link from "next/link";
import { Cake, Phone, Mail, MapPin, Clock, Facebook, Send } from "lucide-react";
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

  const businessName = settings?.business_name || "Iku Sweet Cake";
  const phone = settings?.phone;
  const email = settings?.support_email;
  const address = settings?.address;
  const hours = settings?.business_hours;
  const telegram = settings?.telegram;
  const facebook = settings?.facebook;

  return (
    <footer className="border-t bg-stone-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Cake className="h-6 w-6 text-[#c97d4a]" />
              <span className="text-lg font-bold">{businessName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Freshly baked cakes made with love and the finest ingredients. Order online for delivery or pickup.
            </p>
            <div className="flex items-center gap-3">
              {telegram && (
                <a
                  href={telegram.startsWith("http") ? telegram : `https://t.me/${telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-[#c97d4a]/10 text-[#c97d4a] hover:bg-[#c97d4a] hover:text-white transition-colors"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-[#c97d4a]/10 text-[#c97d4a] hover:bg-[#c97d4a] hover:text-white transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/track-order", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#c97d4a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              {phone && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mt-0.5 text-[#c97d4a]" />
                  <span>{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mt-0.5 text-[#c97d4a]" />
                  <span>{email}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 text-[#c97d4a]" />
                  <span>{address}</span>
                </li>
              )}
              {hours && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mt-0.5 text-[#c97d4a]" />
                  <span>{hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
