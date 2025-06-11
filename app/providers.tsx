// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { ReactQueryClientProvider } from "@/lib/react-query-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ReactQueryClientProvider>
  );
}
