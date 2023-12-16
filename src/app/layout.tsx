import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { NextAuthProvider } from "~/components";
import { cn } from "~/lib";
import { type Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Selam",
  description: "Official Selam Application",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["selam", "selam-app"],
  authors: [
    { name: "Talha Bayansar" },
    {
      name: "Talha Bayansar",
      url: "https://www.linkedin.com/in/talha-bayansar-17039a19a/",
    },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    startupImage: "/apple-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  shrinkToFit: "no",
  viewPortFit: "cover",
  userScalable: "no",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <NextAuthProvider>
            <div className="flex min-h-screen w-screen flex-col">
              {children}
            </div>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
