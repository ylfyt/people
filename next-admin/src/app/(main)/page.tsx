'use client';

import UserCad from '@/components/user-card';
import UserCardSkeleton from '@/components/user-card-skeleton';
import { useRootContext } from '@/contexts/root';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { User } from '@/types/user';
import { FunctionComponent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import ModalCreateUser from '@/components/modal-create-user';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
    const { setNavbarTitle } = useRootContext();

    const [openModal, setOpenModal] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [showedUsers, setShowedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");

    useEffect(() => {
        setNavbarTitle('Home');

        getUsers();
    }, []);

    useEffect(() => {
        search();
    }, [query, users]);

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

    const search = () => {
        if (query.length < 2) {
            setShowedUsers(users);
            return;
        }
        setShowedUsers(users.filter(el => `${el.name} ${el.email} ${el.position}`.toLowerCase().includes(query.toLowerCase())));
    };

    return (
        <div className="min-h-[75dvh] space-y-4">
            <div className='mx-4 flex items-center gap-2'>
                <label className="dai-input dai-input-bordered dai-input-sm w-full flex items-center gap-2">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" className="grow" placeholder="Search" />
                    <Icon icon="fa:search" />
                </label>
                <button onClick={() => setOpenModal(true)} className='dai-btn dai-btn-sm dai-btn-primary'>New</button>
            </div>
            <div className='grid sm:hidden grid-cols-1 gap-2 px-4'>
                {
                    loading ?
                        Array.from({ length: 5 }).map((_, idx) => {
                            return (
                                <UserCardSkeleton key={idx} />
                            );
                        })
                        :
                        showedUsers.length === 0 ?
                            <span className='text-center mt-4'>No data</span> :
                            showedUsers.map((el, idx) => {
                                return (
                                    <UserCad user={el} key={idx} />
                                );
                            })
                }
            </div>
            {openModal && <ModalCreateUser onSuccess={getUsers} open={openModal} setOpen={setOpenModal} />}
        </div>
    );
};

export default Home;
