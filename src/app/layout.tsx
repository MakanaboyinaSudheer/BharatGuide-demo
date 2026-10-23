import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BharatGuide — Find your kind of India",
  description:
    "Meet the local guides who make India feel like your own. Discover thoughtful, locally led experiences across India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
