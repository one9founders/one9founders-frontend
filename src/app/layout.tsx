import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "One9Founders - AI Tool Directory",
  description: "Discover AI tools for founders and startups through intelligent semantic search",
  icons: [
    {
      url: "/logo-light.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/logo-dark.svg",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://t.contentsquare.net/uxa/d11fb4e793d48.js"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-455BX3CJP8"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-455BX3CJP8');
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
