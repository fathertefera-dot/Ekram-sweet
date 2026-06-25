"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Cake, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "../public-layout";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-[#c97d4a]/10 flex items-center justify-center">
                <Cake className="h-7 w-7 text-[#c97d4a]" />
              </div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your account
              </p>
            </div>

            {registered && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                Registration successful! Please sign in.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c97d4a] hover:bg-[#b56d3f] h-11 gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Do not have an account? </span>
              <Link href="/register" className="text-[#c97d4a] hover:underline font-medium">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
