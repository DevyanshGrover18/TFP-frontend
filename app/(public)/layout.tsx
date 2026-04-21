import { Manrope } from "next/font/google";
import { Newsreader } from "next/font/google";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
