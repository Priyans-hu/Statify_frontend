import './globals.css';
import Header from '@/components/header';
import LoadingWrapper from '@/components/loadingWrapper';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer/>
      </body>
    </html>
  );
}
