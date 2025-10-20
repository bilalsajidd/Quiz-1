"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/app/login-form";
import { CueMasterLogo } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = sessionStorage.getItem("cue-master-auth") === "true";
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!isClient) {
    return null; 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center space-y-4">
        <CueMasterLogo className="h-24 w-24 text-primary" />
        <h1 className="font-headline text-4xl font-bold tracking-tight text-center">
          Cue Master
        </h1>
        <p className="text-muted-foreground">
          Admin access required.
        </p>
      </div>
      <div className="mt-8 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
