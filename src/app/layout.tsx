import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "AI Legal Cases & Policy Hub",
  description: "Focused updates on AI enforcement, policy guidance, privacy oversight, and legal practice tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
