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
import { formatDate } from '@/helper/format-date';
import { useAuthContext } from '@/contexts/auth';
import { LoadingButton } from '@/components/loading-button';

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
    const { user } = useAuthContext();

    const { setNavbarTitle, showLoading } = useRootContext();

    const [openModal, setOpenModal] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [showedUsers, setShowedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [updateUser, setUpdateUser] = useState<User>();

    useEffect(() => {
        setNavbarTitle('Admin Panel');

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

    const deleteUser = async (id: number) => {
        const confirmed = confirm("Are you sure to delete this user, all data will be deleted?");
        if (!confirmed) return;

        showLoading(true);
        const res = await sendHttp({
            url: `${ENV.API_BASE_URL}/user/${id}`,
            method: "delete"
        });
        showLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        toast("Successfully delete user", { type: "success" });
        getUsers();
    };

    return (
        <div className="min-h-[75dvh] space-y-4">
            <div className='mx-4 py-2 flex items-center gap-2'>
                <label className="dai-input dai-input-bordered dai-input-sm w-full md:w-80 flex items-center gap-2">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" className="grow" placeholder="Search" />
                    <Icon icon="fa:search" />
                </label>
                <button onClick={() => { setUpdateUser(undefined); setOpenModal(true); }} className='dai-btn dai-btn-sm dai-btn-primary'>New</button>
            </div>
            <div className='mx-4 hidden md:block border rounded-lg'>
                <div className="overflow-x-auto">
                    <table className="dai-table">
                        <thead>
                            <tr>
                                <th className='w-12'></th>
                                <th className='w-24'>Picture</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Modified At</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    Array.from({ length: 10 }).map((_, idx) => {
                                        return (
                                            <tr>
                                                <td><p className='dai-skeleton w-8 h-6'></p></td>
                                                <td><p className='dai-skeleton size-12 rounded-full'></p></td>
                                                <td><p className='dai-skeleton w-36 h-6'></p></td>
                                                <td><p className='dai-skeleton w-24 h-6'></p></td>
                                                <td><p className='dai-skeleton w-24 h-6'></p></td>
                                                <td><p className='dai-skeleton w-8 h-6'></p></td>
                                                <td><p className='dai-skeleton w-24 h-6'></p></td>
                                                <td><p className='dai-skeleton w-8 h-6'></p></td>
                                                <td><p className='dai-skeleton w-8 h-6'></p></td>
                                            </tr>
                                        );
                                    })
                                )
                                    : showedUsers.length === 0 ?
                                        <tr><td colSpan={5} className='text-center'>No data</td></tr>
                                        :
                                        showedUsers.map((el, idx) => {
                                            return (
                                                <tr key={idx} className="dai-hover">
                                                    <th>{idx + 1}</th>
                                                    <td>
                                                        <img className='size-12 rounded-full' src={`${ENV.API_BASE_URL}/${el.profil_pic_url}`} alt="" />
                                                    </td>
                                                    <td>{el.name}</td>
                                                    <td>{el.email}</td>
                                                    <td>{el.position}</td>
                                                    <td>
                                                        <span className={`dai-badge ${el.role === "ADMIN" ? 'dai-badge-error' : "dai-badge-success"}`}>{el.role}</span>
                                                    </td>
                                                    <td>{el.phone}</td>
                                                    <td>{formatDate(el.createdAt, {})}</td>
                                                    <td>
                                                        <div className='flex items-center gap-2 flex-wrap'>
                                                            <button onClick={() => { setUpdateUser(el); setOpenModal(true); }} className='dai-btn dai-btn-sm dai-btn-warning'>
                                                                <Icon icon="fa:pencil" />
                                                            </button>
                                                            <LoadingButton onClick={() => deleteUser(el.id)} disabled={el.id === user?.id} size='sm' className='dai-btn-error'>
                                                                <Icon icon="fa:trash" />
                                                            </LoadingButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='grid md:hidden grid-cols-1 gap-2 px-4'>
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
                                    <UserCad onEdit={() => { setUpdateUser(el); setOpenModal(true); }} user={el} key={idx} />
                                );
                            })
                }
            </div>
            {openModal && <ModalCreateUser updateUser={updateUser} onSuccess={getUsers} open={openModal} setOpen={setOpenModal} />}
        </div>
    );
};

export default Home;
