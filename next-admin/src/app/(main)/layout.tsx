"use client";

import ModalLogout from '@/components/modal-logout';
import MobileNavbar from '@/components/navbar/mobile-navbar';
import { useAuthContext } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {
    const { openModalLogout, setOpenModalLogout, user } = useAuthContext();
    const [valid, setValid] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
            return;
        }
        setValid(true);
    }, [user]);

    return (
        <div className="min-h-dvh">
            {
                valid && (<>
                    <MobileNavbar />
                    <div>{children}</div>
                </>)
            }
            <ModalLogout open={openModalLogout} setOpen={setOpenModalLogout} />
        </div>
    );
};

export default MainLayout;
