import { Fira_Code, Work_Sans } from "next/font/google";
import "../globals.css";
import { Provider, Topbar, TanstackProvider } from "../../components/index";
import { Providers } from "../provider";

const font = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "ConvoCraft",
  description: "Next Gen Chat App",
  icons :{
    icon : "./Designer.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        <Provider>
          <TanstackProvider>
            <Topbar />
            <Providers>{children}</Providers>
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
