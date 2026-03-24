import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'], 
});

export const metadata: Metadata = {
  title: "snapHire",
  description: "Platform pencarian kerja masa depan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakartaSans.className}>
        {children}
      </body>
    </html>
  );
}