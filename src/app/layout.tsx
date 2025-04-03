import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "./components/DataContext";
import { ThemeProvider } from "./components/ThemeContext";
import { SensorProvider } from "./components/SensorDataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voetbal Coach",
  description: "Volg je voetbaltraining vooruitgang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <head>
        {/* Google Cast SDK */}
        <script
          src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
          async
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar overflow-hidden`}
      >
        <ThemeProvider>
          <DataProvider>
            <SensorProvider>
              <div className="flex justify-center items-center min-h-screen no-scrollbar overflow-hidden">
                <div className="w-full overflow-hidden">{children}</div>
              </div>
            </SensorProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
