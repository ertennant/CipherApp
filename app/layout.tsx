import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cipher App",
  description: "Experiment with historic ciphers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-between h-screen`}
      >
        {children}
        <footer className='flex flex-row justify-between items-end w-full text-center'>
          <div className="w-[24px] h-[24px]"></div>
          <small className="p-2">
            Copyright &copy; 2025 Elizabeth Tennant 
          </small>
          <a href="https://github.com/ertennant" className="p-2">
            <Image
              src="./github-mark-white.svg"
              alt="Link to GitHub"
              height={24}
              width={24}
            >
            </Image>
          </a>
        </footer>
      </body>
    </html>
  );
}
