import type { Metadata, Viewport } from "next"
import { Inter, Amiri } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/components/providers/redux-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  })

export const metadata: Metadata = {
  title: {
    default: "Salat Time - Prayer Times & Ramadan Countdown",
    template: "%s | Salat Time",
  },
  description:
    "Location-based Sehri, Iftar, and 5 Waqt Salah times with countdown and Azan notifications. A beautiful, premium Islamic prayer time PWA.",
  keywords: ["prayer times", "salah", "namaz", "ramadan", "sehri", "iftar", "islamic", "pwa", "muslim"],
  manifest: "/manifest.json",
  authors: [{ name: "CloudGen" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prayer-time-pwa.vercel.app",
    title: "Salat Time - Prayer Times & Ramadan Countdown",
    description: "Premium Islamic Prayer Times with beautiful glassmorphism design.",
    siteName: "Salat Time",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salat Time - Prayer Times & Ramadan Countdown",
    description: "Premium Islamic Prayer Times with beautiful glassmorphism design.",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Salat Time",
  },
}

export const viewport: Viewport = {
  themeColor: "#0f1524",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${amiri.variable} font-sans antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="salat_theme"
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
