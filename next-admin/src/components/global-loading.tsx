"use client"

import { useRootContext } from '@/contexts/root';
import { FunctionComponent } from 'react';

interface GlobalLoadingProps {

}

const GlobalLoading: FunctionComponent<GlobalLoadingProps> = () => {
    const { globalLoading } = useRootContext();
    return globalLoading ? <div className='fixed top-0 left-0 w-full bg-black bg-opacity-40 h-dvh z-50 grid place-items-center'>
        <span className="dai-loading dai-loading-dots dai-loading-lg text-primary"></span>
    </div> : null;

};

export default GlobalLoading;