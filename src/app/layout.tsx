import './globals.css';
import Header from '@/components/header';
import LoadingWrapper from '@/components/loadingWrapper';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

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
        <Providers>
          <Header />
          <LoadingWrapper>{children}</LoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
