import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MockDrilling | Free & Expert-Led Technical Mock Interviews | Frontend, Backend, DSA",
  description:
    "Sharpen your coding interview skills with unlimited free mock interviews or book a ₹499 expert-led session tailored to your target company. Frontend, Backend, and DSA prep with real feedback.",
  keywords:
    "mock interview, technical interview, frontend, backend, DSA, coding interview, interview preparation, expert feedback",
  openGraph: {
    title: "MockDrilling - Master Interviews Free or Expert-Led",
    description:
      "Practice unlimited technical interviews in frontend, backend, and DSA. Upgrade for company-specific, expert feedback.",
    type: "website",
    url: "https://mockdrilling.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "MockDrilling - Master Interviews Free or Expert-Led",
    description:
      "Practice unlimited technical interviews in frontend, backend, and DSA. Upgrade for company-specific, expert feedback.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MockDrilling",
              url: "https://mockdrilling.com",
              description:
                "Sharpen your coding interview skills with unlimited free mock interviews or book a ₹499 expert-led session tailored to target companies.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://mockdrilling.com/search?query={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
