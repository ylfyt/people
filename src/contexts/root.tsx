'use client';

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { CustomColorScheme } from '@/constants/color-scheme';

interface IRootContext {
    darkMode: boolean;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const RootContext = createContext<IRootContext>({
    darkMode: false,
    setDarkMode() {},
});

interface RootProviderProps {
    children: ReactNode;
}
const RootProvider: FC<RootProviderProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useLocalStorage<boolean>('dark', false);
    useEffect(() => {
        type ThemeOptions = keyof typeof CustomColorScheme;
        const themeName: ThemeOptions = darkMode ? 'darkScheme' : 'lightRetro';
        document.documentElement.setAttribute('data-theme', themeName);
    }, [darkMode]);
    return <RootContext.Provider value={{ darkMode, setDarkMode }}>{children}</RootContext.Provider>;
};

export const useRootContext = () => {
    return useContext(RootContext);
};

export default RootProvider;
