'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Toast from "@/components/Toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
        suppressHydrationWarning={true}
      >
        <AppProvider>
          <AuthProvider>
            <ProtectedRoute>
              {usePathname() === '/login' ? (
                <main className="w-full">
                  {children}
                </main>
              ) : (
                <div className="flex h-screen">
                  <Navigation />
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </div>
              )}
            </ProtectedRoute>
            <Toast />
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}