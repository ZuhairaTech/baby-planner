import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A to Z Baby Planner",
  description: "Baby and maternity shopping dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}