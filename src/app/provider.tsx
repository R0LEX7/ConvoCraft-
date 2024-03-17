"use client";

import toast, { Toaster } from "react-hot-toast";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Toaster
      position="top-right"
       />
      {children}
    </NextUIProvider>
  );
}
