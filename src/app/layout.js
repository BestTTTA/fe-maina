import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noto_Sans_Thai } from "next/font/google";


export const metadata = {
  title: "หมายน้า",
  description: "หมายน้า เว็บสำหรับน้าๆที่ต้องการแบ่งปันแหล่งตกปา หรือ หมายเด็ดๆ พร้อมทั้งเหยื่อที่ใช้ในการตกปลา ",
};

const noto_san_thai = Noto_Sans_Thai({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body
        className={noto_san_thai.className}
      >
        {children}
      </body>
    </html>
  );
}
