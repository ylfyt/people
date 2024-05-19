'use client';

import UserCad from '@/components/user-card';
import UserCardSkeleton from '@/components/user-card-skeleton';
import { useRootContext } from '@/contexts/root';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { User } from '@/types/user';
import { FunctionComponent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
    const { setNavbarTitle } = useRootContext();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNavbarTitle('Home');

        getUsers();
    }, []);

    const getUsers = async () => {
        setLoading(true);
        const res = await sendHttp<User[]>({
            url: `${ENV.API_BASE_URL}/user`
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        setUsers(res.data);
    };

    return (
        <div className="min-h-[75dvh]">
            <div className='grid sm:hidden grid-cols-1 gap-2 px-4'>
                {
                    loading ?
                        Array.from({ length: 5 }).map((_, idx) => {
                            return (
                                <UserCardSkeleton key={idx} />
                            );
                        })
                        :
                        users.length === 0 ?
                            <span className='text-center mt-4'>No data</span> :
                            users.map((el, idx) => {
                                return (
                                    <UserCad user={el} key={idx} />
                                );
                            })
                }
            </div>
        </div>
    );
};

export default Home;
