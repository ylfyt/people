"use client";

import ModalLogout from '@/components/modal-logout';
import MobileNavbar from '@/components/navbar/mobile-navbar';
import { useAuthContext } from '@/contexts/auth';
import { FunctionComponent } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
    const { openModalLogout, setOpenModalLogout } = useAuthContext();

    return (
        <div className="min-h-dvh">
            <MobileNavbar />
            <div>{children}</div>
            <ModalLogout open={openModalLogout} setOpen={setOpenModalLogout} />
        </div>
    );
};

export default MainLayout;
