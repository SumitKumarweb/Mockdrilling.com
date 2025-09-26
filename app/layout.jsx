import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/useAuth"
import DebugAuth from "@/components/debug-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MockDrilling - Practice Technical Interviews",
  description:
    "Practice unlimited technical interviews in frontend, backend, and DSA. Upgrade for company-specific, expert feedback.",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "MockDrilling",
              description: "Practice technical interviews with AI and expert feedback",
              url: "https://mockdrilling.com",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            {/* <DebugAuth /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
