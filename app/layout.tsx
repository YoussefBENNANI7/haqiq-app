import type { Metadata } from 'next'
import { Playfair_Display, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const ibmPlex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-ibm', display: 'swap' })

export const metadata: Metadata = {
  title: 'HaqiQ — Conseiller juridique marocain IA',
  description: 'Des réponses juridiques fondées sur les textes officiels du droit marocain, disponibles 24h/24.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${ibmPlex.variable}`}>
      <body style={{ fontFamily: 'var(--font-ibm)', backgroundColor: '#F8F6F1', minHeight: '100vh' }}>{children}</body>
    </html>
  )
}
