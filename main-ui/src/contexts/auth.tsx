"use client"

import { User } from '@/types/user';
import { Dispatch, FunctionComponent, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

export type AuthContextData = {
    user?: User;
    setUser: Dispatch<SetStateAction<User | undefined>>;
};

const AuthContext = createContext<AuthContextData>({
    setUser() {}
});

interface AuthContextProviderProps {
    children?: ReactNode;
}

const AuthContextProvider: FunctionComponent<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>();
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;