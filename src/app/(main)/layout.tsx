import MobileNavbar from '@/components/navbar/mobile-navbar';
import { FunctionComponent } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
    return (
        <div>
            <MobileNavbar />
            <div>{children}</div>
        </div>
    );
};

export default MainLayout;
