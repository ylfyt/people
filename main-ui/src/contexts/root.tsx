'use client';

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { CustomColorScheme } from '@/constants/color-scheme';

interface IRootContext {
    darkMode: boolean;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
    navbarTitle: string;
    setNavbarTitle: Dispatch<SetStateAction<string>>;
    showLoading: (loading: boolean) => boolean;
    globalLoading: boolean;
}

const RootContext = createContext<IRootContext>({
    darkMode: false,
    navbarTitle: 'Home',
    setDarkMode() {},
    setNavbarTitle() {},
    showLoading: () => false,
    globalLoading: false
});

interface RootProviderProps {
    children: ReactNode;
}
const RootProvider: FC<RootProviderProps> = ({ children }) => {
    const [navbarTitle, setNavbarTitle] = useState('Home');
    const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark', false);
    const [globalLoading, setGlobalLoading] = useState(false);

    const showLoading = (loading: boolean): boolean => {
        setGlobalLoading(loading);
        return loading;
    };

    useEffect(() => {
        type ThemeOptions = keyof typeof CustomColorScheme;
        const themeName: ThemeOptions = darkMode ? 'darkScheme' : 'lightRetro';
        document.documentElement.setAttribute('data-theme', themeName);
    }, [darkMode]);
    return (
        <RootContext.Provider value={{ darkMode, setDarkMode, navbarTitle, setNavbarTitle, globalLoading, showLoading }}>
            {children}
        </RootContext.Provider>
    );
};

export const useRootContext = () => {
    return useContext(RootContext);
};

export default RootProvider;
