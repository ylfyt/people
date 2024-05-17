'use client';

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { CustomColorScheme } from '@/constants/color-scheme';

interface IRootContext {
    darkMode: boolean;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
    navbarTitle: string;
    setNavbarTitle: Dispatch<SetStateAction<string>>;
}

const RootContext = createContext<IRootContext>({
    darkMode: false,
    navbarTitle: 'Home',
    setDarkMode() {},
    setNavbarTitle() {},
});

interface RootProviderProps {
    children: ReactNode;
}
const RootProvider: FC<RootProviderProps> = ({ children }) => {
    const [navbarTitle, setNavbarTitle] = useState('Home');
    const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark', false);
    useEffect(() => {
        type ThemeOptions = keyof typeof CustomColorScheme;
        const themeName: ThemeOptions = darkMode ? 'darkScheme' : 'lightRetro';
        document.documentElement.setAttribute('data-theme', themeName);
    }, [darkMode]);
    return (
        <RootContext.Provider value={{ darkMode, setDarkMode, navbarTitle, setNavbarTitle }}>
            {children}
        </RootContext.Provider>
    );
};

export const useRootContext = () => {
    return useContext(RootContext);
};

export default RootProvider;
