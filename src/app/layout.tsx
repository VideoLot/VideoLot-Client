import './globals.css'
import Image from 'next/image'; 
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <header className='relative h-52'>
          <Image src={'/hat.png'} objectFit={'contain'} fill alt='videolee. your own video hosting'></Image>
        </header>
        {children}
      </body>
    </html>
  )
}
