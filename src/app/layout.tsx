import './globals.css';
import Header from '@/components/header';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Status App',
  description: 'System health monitoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
