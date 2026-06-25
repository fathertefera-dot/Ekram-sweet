import Image from "next/image";
import { Cake, Heart, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "../public-layout";
import { getSettings } from "@/actions/settings";

export const metadata = {
  title: "About Us - Iku Sweet Cake",
  description: "Learn about Iku Sweet Cake - our story, mission, and commitment to quality.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#c97d4a]/10 to-[#c97d4a]/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {settings?.about_title || "Our Story"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Crafting delicious memories one cake at a time
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={settings?.about_image || "/images/about-cake.jpg"}
                alt="About Iku Sweet Cake"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5">
              <h2 className="text-3xl font-bold">
                {settings?.about_title || "Crafting Sweet Memories"}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  {settings?.about_content ||
                    "At Iku Sweet Cake, we believe every celebration deserves a perfect cake. Our skilled bakers use only the finest ingredients to create delicious masterpieces that not only look stunning but taste incredible too."}
                </p>
                <p>
                  Founded with a passion for baking and a commitment to quality, we have grown to become a trusted name in custom cakes. From intimate gatherings to grand celebrations, we pour our heart into every creation.
                </p>
                <p>
                  Our team of talented cake artists brings years of experience and creativity to every order. We use only the freshest, highest-quality ingredients to ensure that every bite is as delicious as it looks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We are committed to delivering the best cake experience
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Cake,
                title: "Fresh Ingredients",
                description: "We use only the freshest, highest-quality ingredients in all our cakes.",
              },
              {
                icon: Heart,
                title: "Made with Love",
                description: "Every cake is handcrafted with care and attention to detail.",
              },
              {
                icon: Award,
                title: "Premium Quality",
                description: "We never compromise on quality. Expect nothing but the best.",
              },
              {
                icon: Clock,
                title: "On-Time Delivery",
                description: "We understand the importance of timing for your special events.",
              },
            ].map((value) => (
              <Card key={value.title} className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-[#c97d4a]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
