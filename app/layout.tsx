import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "MBL (MapleBuildLab)",
  description: "메이플랜드 템셋팅 시뮬레이터 - MBL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/build" className="font-semibold">
              MBL <span className="text-gray-500 text-sm">(MapleBuildLab)</span>
            </Link>

            <TopNav />
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
