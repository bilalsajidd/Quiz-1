"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CueMasterLogo } from "@/components/icons";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("cue-master-auth") === "true";
    if (!isAuthenticated) {
      router.replace("/");
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <CueMasterLogo className="h-16 w-16 text-primary animate-pulse" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
