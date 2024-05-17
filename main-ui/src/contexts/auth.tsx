"use client";

import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { User } from '@/types/user';
import { Dispatch, FunctionComponent, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useRootContext } from './root';
import { toast } from 'react-toastify';

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
    const { showLoading } = useRootContext();

    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(true);

    const getPersonalInfo = async () => {
        if (!localStorage.getItem("jit")?.length) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const res = await sendHttp<User>({
            url: `${ENV.AUTH_BASE_URL}/me`
        });
        setLoading(false);
        if (!res.success) {
            if (res.message === "invalid") {
                localStorage.removeItem("jit");
                return;
            }
            toast(res.message, { type: "error" });
            return;
        }
        setUser(res.data);
    };

    useEffect(() => {
        getPersonalInfo();
    }, []);

    useEffect(() => {
        showLoading(loading);
    }, [loading]);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;