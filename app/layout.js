import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider';
import prisma from '@/lib/prisma';
import Navbar from './components/Navbar';
import Background from './components/Background';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Soru Çözüm Kulübü',
  description: 'Öğrenciler için soru çözüm platformu',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Background>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </Background>
        </SessionProvider>
      </body>
    </html>
  );
} 