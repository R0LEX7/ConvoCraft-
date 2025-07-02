

import "../globals.css";
import { Providers } from "../provider";
import { Fira_Code, Work_Sans } from "next/font/google";


const font = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "ConvoCraft - Auth",
  description: "Convocraft is a Nextjs full-stack chatting application ",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
     <body className={font.className}>
      <Providers>
      {children}
    </Providers>
      </body>
    </html>
  );
}
