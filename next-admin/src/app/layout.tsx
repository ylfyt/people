import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import RootProvider from '@/contexts/root';
import AuthContextProvider from '@/contexts/auth';
import GlobalLoading from '@/components/global-loading';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'People (Admin)',
    description: 'People (Admin)',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <RootProvider>
                    <AuthContextProvider>
                        {children}
                    </AuthContextProvider>
                    <GlobalLoading />
                    <ToastContainer />
                </RootProvider>
            </body>
        </html>
    );
}
