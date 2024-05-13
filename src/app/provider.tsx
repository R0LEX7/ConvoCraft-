"use client";

import  { Toaster } from "react-hot-toast";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Toaster
      position="top-right"
      toastOptions={{

        style: {
          background: '#27272A',
          color: '#fff',
        }}}
       />
      {children}
    </NextUIProvider>
  );
}
