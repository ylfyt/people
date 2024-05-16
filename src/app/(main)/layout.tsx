import { FunctionComponent } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
    return (
        <div>
            <div>Navbar</div>
            <div>{children}</div>
        </div>
    );
};

export default MainLayout;
