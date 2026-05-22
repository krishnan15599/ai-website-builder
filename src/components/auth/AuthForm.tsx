"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-soft-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-foreground">Aetheria</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Sign in to manage your AI-built websites"
              : "Start building websites with AI in minutes"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-soft-lg space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
