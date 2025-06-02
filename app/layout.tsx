import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeContextProvider } from "@/hooks/use-theme"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { ServerFunctionsProvider } from "@/hooks/use-server"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Verdant - Community Messaging App",
  description: "A Discord-inspired community messaging platform with a Matrix-inspired green UI theme",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ServerFunctionsProvider>
            <ThemeProvider attribute="class" defaultTheme="neon" enableSystem={false} disableTransitionOnChange={false}>
              <ThemeContextProvider>
                {children}
                <Toaster />
              </ThemeContextProvider>
            </ThemeProvider>
          </ServerFunctionsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
