import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign up | Aetheria",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
