import './globals.css'
import { Lexend } from 'next/font/google'

export const metadata = {
  title: 'SpellBuddy',
  description: 'Dyslexia-smart spelling & vocab practice that runs great on iPad.',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpellBuddy'
  },
  themeColor: '#0b0c10'
  manifest: '/manifest.webmanifest',
}

const lexend = Lexend({ subsets: ['latin'], variable: '--lexend' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.variable}>
        <div className="container">
          {children}
        </div>
     <RegisterSW />
      </body>
    </html>
  )
}
