import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootProvider from '@/contexts/root';
import AuthContextProvider from '@/contexts/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Management',
    description: 'Management',
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
                </RootProvider>
            </body>
        </html>
    );
}
