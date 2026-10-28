import type { Metadata } from "next";
import { Inter, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
});

export const metadata: Metadata = {
  title: "భూ రికార్డుల అధికారి పోర్టల్ | Revenue Officer Portal",
  description:
    "AI-assisted land record application processing for government officers",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="te">
      <body
        className={`${inter.variable} ${telugu.variable} font-sans antialiased bg-neutral-50 text-neutral-800`}
      >
        {children}
      </body>
    </html>
  );
}
