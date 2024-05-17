'use client';

import { useRootContext } from '@/contexts/root';
import { Icon } from '@iconify/react';
import { FunctionComponent, useEffect, useState } from 'react';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
    const { setNavbarTitle } = useRootContext();

    const [loading, setLoading] = useState(true);
    const [enterTime, setEnterTime] = useState('');
    const [exitTime, setExitTime] = useState('');

    useEffect(() => {
        setNavbarTitle('Home');
        getStatus();
    }, []);

    const getStatus = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="grid min-h-[75dvh] place-items-center">
            {loading ? (
                <div className="flex flex-col gap-4">
                    <button className="dai-btn dai-skeleton h-28 w-40"></button>
                    <button className="dai-btn dai-skeleton h-28 w-40"></button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <button
                        disabled={enterTime.length > 0}
                        className="dai-btn dai-btn-success flex h-28 w-40 flex-col gap-2"
                    >
                        <span className="flex items-center gap-2 text-2xl">
                            <Icon icon="icomoon-free:enter" />
                            Enter
                        </span>
                        {enterTime.length > 0 && <span className="text-sm">Time: {enterTime}</span>}
                    </button>
                    <button
                        disabled={exitTime.length > 0}
                        className="dai-btn dai-btn-error flex h-28 w-40 flex-col gap-2"
                    >
                        <span className="flex items-center gap-2 text-2xl">
                            <Icon icon="mingcute:exit-fill" />
                            Exit
                        </span>
                        {exitTime.length > 0 && <span className="text-sm">Time: {exitTime}</span>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
