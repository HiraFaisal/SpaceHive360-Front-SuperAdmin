"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="size-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse shadow-2xl shadow-primary/20">
           <div className="size-8 rounded-xl bg-primary" />
        </div>
        <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">SpaceHive360</h1>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Authenticating secure session...</p>
        </div>
      </div>
    </div>
  );
}
