import { Fira_Code, Work_Sans } from "next/font/google";
import "../globals.css";
import { Provider, Topbar, TanstackProvider } from "../../components/index";

const font = Work_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "ConvoCraft",
  description: "Next Gen Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        <Provider>
          <TanstackProvider>
            <Topbar />
            {children}
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
