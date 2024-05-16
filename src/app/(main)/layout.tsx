import MobileNavbar from '@/components/navbar/mobile-navbar';
import { FunctionComponent } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-dvh">
            <MobileNavbar />
            <div>{children}</div>
        </div>
    );
};

export default MainLayout;
