import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบติดตามเครือข่ายยาเสพติด — กองบัญชาการตำรวจปราบปรามยาเสพติด",
  description:
    "ระบบสาธิตการติดตามและแผนที่อาชญากรรมยาเสพติดของตำรวจไทย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full`}>
      <body className="min-h-full flex flex-col font-(--font-noto-thai) bg-[#0d1117] text-gray-100">
        {children}
      </body>
    </html>
  );
}
