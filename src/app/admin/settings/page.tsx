"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getSettings, updateSettings } from "@/actions/settings";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    business_name: "",
    phone: "",
    support_email: "",
    telegram: "",
    facebook: "",
    address: "",
    business_hours: "",
    about_title: "",
    about_content: "",
    about_image: "",
    logo: "",
    favicon: "",
    meta_title: "",
    meta_description: "",
    enable_cash_on_delivery: true,
    enable_telebirr: false,
    enable_bank_transfer: false,
    telegram_bot_token: "",
    telegram_chat_id: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        if (data) {
          setFormData({
            business_name: data.business_name || "",
            phone: data.phone || "",
            support_email: data.support_email || "",
            telegram: data.telegram || "",
            facebook: data.facebook || "",
            address: data.address || "",
            business_hours: data.business_hours || "",
            about_title: data.about_title || "",
            about_content: data.about_content || "",
            about_image: data.about_image || "",
            logo: data.logo || "",
            favicon: data.favicon || "",
            meta_title: data.meta_title || "",
            meta_description: data.meta_description || "",
            enable_cash_on_delivery: data.enable_cash_on_delivery ?? true,
            enable_telebirr: data.enable_telebirr ?? false,
            enable_bank_transfer: data.enable_bank_transfer ?? false,
            telegram_bot_token: data.telegram_bot_token || "",
            telegram_chat_id: data.telegram_chat_id || "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });

      await updateSettings(form);
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="branding">Branding & SEO</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name *</Label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) => updateField("business_name", e.target.value)}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+251 XXX XXX XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={formData.support_email}
                      onChange={(e) => updateField("support_email", e.target.value)}
                      placeholder="support@example.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telegram</Label>
                    <Input
                      value={formData.telegram}
                      onChange={(e) => updateField("telegram", e.target.value)}
                      placeholder="@username or link"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={formData.facebook}
                      onChange={(e) => updateField("facebook", e.target.value)}
                      placeholder="username or link"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Your business address"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <Input
                    value={formData.business_hours}
                    onChange={(e) => updateField("business_hours", e.target.value)}
                    placeholder="Mon-Sat: 8AM - 8PM"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>About Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>About Title</Label>
                  <Input
                    value={formData.about_title}
                    onChange={(e) => updateField("about_title", e.target.value)}
                    placeholder="Our Story"
                  />
                </div>
                <div className="space-y-2">
                  <Label>About Content</Label>
                  <Textarea
                    value={formData.about_content}
                    onChange={(e) => updateField("about_content", e.target.value)}
                    placeholder="Write about your business..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>About Image URL</Label>
                  <Input
                    value={formData.about_image}
                    onChange={(e) => updateField("about_image", e.target.value)}
                    placeholder="https://..."
                  />
                  {formData.about_image && (
                    <img
                      src={formData.about_image}
                      alt="About"
                      className="h-40 rounded-lg object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Branding & SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={formData.logo}
                      onChange={(e) => updateField("logo", e.target.value)}
                      placeholder="https://..."
                    />
                    {formData.logo && (
                      <img src={formData.logo} alt="Logo" className="h-16 rounded" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input
                      value={formData.favicon}
                      onChange={(e) => updateField("favicon", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => updateField("meta_title", e.target.value)}
                    placeholder="Page title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={(e) => updateField("meta_description", e.target.value)}
                    placeholder="Page description for search engines"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                  </div>
                  <Switch
                    checked={formData.enable_cash_on_delivery}
                    onCheckedChange={(v) => updateField("enable_cash_on_delivery", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Telebirr</p>
                    <p className="text-sm text-muted-foreground">Mobile money payment</p>
                  </div>
                  <Switch
                    checked={formData.enable_telebirr}
                    onCheckedChange={(v) => updateField("enable_telebirr", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                  </div>
                  <Switch
                    checked={formData.enable_bank_transfer}
                    onCheckedChange={(v) => updateField("enable_bank_transfer", v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Telegram Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bot Token</Label>
                  <Input
                    type="password"
                    value={formData.telegram_bot_token}
                    onChange={(e) => updateField("telegram_bot_token", e.target.value)}
                    placeholder="Your Telegram bot token"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get this from @BotFather on Telegram
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Chat ID</Label>
                  <Input
                    value={formData.telegram_chat_id}
                    onChange={(e) => updateField("telegram_chat_id", e.target.value)}
                    placeholder="Your Telegram chat ID"
                  />
                  <p className="text-xs text-muted-foreground">
                    The chat ID where notifications will be sent
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#c97d4a] hover:bg-[#b56d3f] gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
