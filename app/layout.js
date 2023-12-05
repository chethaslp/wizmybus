import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Comfortaa } from "next/font/google";

const f = Comfortaa({ subsets: ['latin'] })

export const metadata = {
  title: 'Wizmybus App',
  description: 'Where is my Bus?',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='bv'>
      <body>{children}</body>
    </html>
  )
}
