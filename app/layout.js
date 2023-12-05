import './globals.css'
// import 'bootstrap/dist/css/bootstrap.css'
import { Comfortaa } from "next/font/google";

const f = Comfortaa({ subsets: ['latin'] })

export const metadata = {
  title: 'Wizmybus App',
  description: 'Where is my Bus?',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='bv'>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
