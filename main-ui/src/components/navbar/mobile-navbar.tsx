'use client';

import { FunctionComponent, MouseEventHandler, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useRootContext } from '@/contexts/root';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth';

type Route = {
    icon: string;
    url: string;
    text: string;
};

const routes: Route[] = [
    {
        icon: 'fa:home',
        url: '/',
        text: 'Home',
    },
    {
        icon: 'fa:user',
        url: '/profile',
        text: 'Profile',
    },
    {
        icon: 'fa:file-text',
        url: '/report',
        text: 'Report',
    },
];

interface MobileNavbarProps {}

const MobileNavbar: FunctionComponent<MobileNavbarProps> = () => {
    const { darkMode, setDarkMode, navbarTitle } = useRootContext();
    const { setOpenModalLogout } = useAuthContext();
    const pathname = usePathname();

    const [expand, setExpand] = useState(false);
    const container = useRef<HTMLDivElement>(null);

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target !== container.current) {
            return;
        }
        setExpand(false);
    };

    return (
        <div className="relative z-10">
            <nav className="dai-navbar bg-base-100">
                <div className="flex-1">
                    <a className="dai-btn dai-btn-ghost text-xl">{navbarTitle}</a>
                </div>
                <div className="flex-none">
                    <button onClick={() => setExpand(true)} className="dai-btn dai-btn-square dai-btn-ghost">
                        <Icon className="size-7" icon="material-symbols:menu" />
                    </button>
                </div>
            </nav>
            {expand && (
                <div
                    ref={container}
                    onClick={handleClick}
                    className="absolute left-0 top-0 h-dvh w-full bg-black bg-opacity-50"
                >
                    <div className="ml-auto flex h-dvh w-3/4 flex-col justify-between bg-base-100">
                        <div className="flex items-center justify-between px-4 py-2">
                            <h2 className="text-2xl font-semibold italic text-primary">Peoples</h2>
                            <button
                                onClick={() => setDarkMode((prev) => !prev)}
                                className="dai-btn dai-btn-circle dai-btn-warning dai-btn-sm"
                            >
                                {darkMode ? <Icon icon="fa:moon-o" /> : <Icon icon="fa:sun-o" />}
                            </button>
                        </div>
                        <hr className="border" />
                        <ul className="flex h-full flex-col gap-2 p-4">
                            {routes.map((el, idx) => {
                                return (
                                    <li key={idx}>
                                        <Link onClick={() => pathname !== el.url && setExpand(false)} href={el.url}>
                                            <div
                                                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${pathname === el.url ? 'bg-accent text-accent-content' : 'bg-base-200 hover:bg-base-300'}`}
                                            >
                                                <Icon className="size-8" icon={el.icon} />
                                                <span className="text-lg font-semibold">{el.text}</span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <hr className="border" />
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="flex items-center gap-2">
                                <img className="size-12 rounded-full" src="/profile.jpg" alt="" />
                                <span className="font-medium">Yudi Alfayat</span>
                            </span>
                            <button onClick={() => {
                                setOpenModalLogout(true);
                                setExpand(false);
                            }} className="dai-btn dai-btn-error dai-btn-sm text-xl">
                                <Icon icon="mingcute:exit-fill" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileNavbar;
