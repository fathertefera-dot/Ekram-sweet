import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PublicLayout from "../public-layout";
import { getSettings } from "@/actions/settings";

export const metadata = {
  title: "Contact Us - Iku Sweet Cake",
  description: "Get in touch with Iku Sweet Cake. We would love to hear from you.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#c97d4a]/10 to-[#c97d4a]/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or special request? We are here to help!
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md text-center">
              <CardContent className="p-6">
                <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                  <Phone className="h-7 w-7 text-[#c97d4a]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Call us for orders and inquiries
                </p>
                <a
                  href={`tel:${settings?.phone}`}
                  className="text-[#c97d4a] font-medium hover:underline"
                >
                  {settings?.phone || "+251 XXX XXX XXX"}
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md text-center">
              <CardContent className="p-6">
                <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-[#c97d4a]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Come see our bakery
                </p>
                <span className="text-[#c97d4a] font-medium">
                  {settings?.address || "Addis Ababa, Ethiopia"}
                </span>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md text-center">
              <CardContent className="p-6">
                <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-[#c97d4a]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  We are open
                </p>
                <span className="text-[#c97d4a] font-medium">
                  {settings?.business_hours || "Mon-Sat: 8AM - 8PM"}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social & Quick Contact */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Connect With Us</h2>
            <p className="text-muted-foreground">
              Follow us on social media for updates and special offers
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {settings?.telegram && (
              <a
                href={settings.telegram.startsWith("http") ? settings.telegram : `https://t.me/${settings.telegram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-[#0088cc] hover:bg-[#0077b3] gap-2"
                >
                  <Send className="h-5 w-5" />
                  Telegram
                </Button>
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook.startsWith("http") ? settings.facebook : `https://facebook.com/${settings.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-[#1877F2] hover:bg-[#166fe5] gap-2"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Button>
              </a>
            )}
            {settings?.support_email && (
              <a href={`mailto:${settings.support_email}`}>
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Email Us
                </Button>
              </a>
            )}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              For custom cake orders and special requests, please call us directly or reach out via Telegram.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
