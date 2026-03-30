import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saas-note-six.vercel.app'),
  title: "CloudNote - AI 메모 서비스",
  description: "어디서든 메모하고, AI가 정리해드립니다. 30일 무료 Pro 체험.",
  openGraph: {
    title: "CloudNote - AI 메모 서비스",
    description: "어디서든 메모하고, AI가 정리해드립니다. 30일 무료 Pro 체험.",
    url: "https://saas-note-six.vercel.app",
    siteName: "CloudNote",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudNote OG Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudNote - AI 메모 서비스",
    description: "어디서든 메모하고, AI가 정리해드립니다. 30일 무료 Pro 체험.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${notoSansKr.variable} light antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-sans bg-background-light text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
