import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign in | Aetheria",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
