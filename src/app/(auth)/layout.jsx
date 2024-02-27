

import "../globals.css";
import { Providers } from "../provider";



export const metadata = {
  title: "Auth Halo Chat",
  description: "Build a Next 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Providers>
      {children}
    </Providers>
      </body>
    </html>
  );
}
