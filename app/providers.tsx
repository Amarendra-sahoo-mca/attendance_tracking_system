"use client";
import { ReactQueryClientProvider } from "@/lib/react-query-provider";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme") || 
                  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch: render nothing until mounted
    return null;
  }

  return <ReactQueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ReactQueryClientProvider>;
}
