import './globals.css';
import Image from 'next/image'; 
import { Inter } from 'next/font/google';
import AuthControls from './components/auth';
import Providers from './components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Videolee',
  description: 'Videolee your own video hosting',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Providers>
        <body className={inter.className}>
            <header >
              <AuthControls></AuthControls>
              <div className='relative md:h-52'>
                <Image src={'/hat.png'} fill className='object-contain' alt='videolee. your own video hosting'></Image>
              </div> 
            </header>
            {children}
        </body>
      </Providers>
      
    </html>
  )
}
