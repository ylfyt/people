'use client';

import { LoadingButton } from '@/components/loading-button';
import { useAuthContext } from '@/contexts/auth';
import { useRootContext } from '@/contexts/root';
import { UserLoginResponse } from '@/dtos/user-login';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useDeferredValue, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ProfileProps {}

const Profile: FunctionComponent<ProfileProps> = () => {
    const { setUser, user } = useAuthContext();

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const disableForm = useDeferredValue(email.length === 0 || password.length === 0);

    useEffect(() => {
        if (user) {
            router.replace("/");
            return;
        }
    }, [user]);

    const login = async () => {
        type UserLoginRequest = {
            email: string;
            password: string;
        };
        const payload: UserLoginRequest = {
            email, password
        };
        setLoading(true);
        const res = await sendHttp<UserLoginResponse>({
            url: `${ENV.API_BASE_URL}/user/login`,
            method: "post",
            payload
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        localStorage.setItem("jit", res.data.token);
        setUser(res.data.user);
    };

    return (
        <div className="grid min-h-dvh w-full place-items-center">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
                className="grid grid-cols-3 gap-8 rounded-lg border px-8 py-4"
            >
                <span className="col-span-full text-center text-2xl font-semibold text-primary">Login</span>
                <label className="dai-form-control col-span-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Email</span>
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Type here"
                        className="dai-input dai-input-bordered w-full max-w-xs"
                    />
                </label>

                <label className="dai-form-control col-span-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Password</span>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Type here"
                        className="dai-input dai-input-bordered w-full max-w-xs"
                    />
                </label>
                <div className="col-span-full flex items-center justify-center">
                    <LoadingButton disabled={disableForm} className='dai-btn-primary'>Submit</LoadingButton>
                </div>
            </form>
        </div>
    );
};

export default Profile;
