import './globals.css'
import { Lexend } from 'next/font/google'
import RegisterSW from './register-sw'

export const metadata = {
  title: 'SpellBuddy',
  description: 'Dyslexia-smart spelling & vocab practice that runs great on iPad.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpellBuddy',
  },
  manifest: '/manifest.webmanifest',
}

// ✅ NEW: move viewport + themeColor here
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0c10',
}

const lexend = Lexend({ subsets: ['latin'], variable: '--lexend' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.variable}>
        <RegisterSW />
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  )
}