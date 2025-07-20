import './globals.css';
import '@/styles/global.css';
import Header from '@/components/header';
import LoadingWrapper from '@/components/loadingWrapper';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Roboto } from 'next/font/google';
import RouteGuardWrapper from './routeGuardWrapper';

const roboto = Roboto({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Status App',
  description: 'System health monitoring',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-[#131a26] text-white`}>
        <Providers>
          <Header />
          <LoadingWrapper>
            <RouteGuardWrapper>
              <div className="pt-20">{children}</div>
            </RouteGuardWrapper>
          </LoadingWrapper>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
