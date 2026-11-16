import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/glossary/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "5秒でわかるビジネスAI用語集",
  description: "実務に直結するAIの「肝」を最短で理解する",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="dark h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col leading-relaxed antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("ai_glossary_theme")==="light"){document.documentElement.classList.remove("dark")}}catch(e){}`}
        </Script>
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
