'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { FormChangePassword } from './components/form-change-password';
import { useRootContext } from '@/contexts/root';

interface StudentProps {}

const Profile: FunctionComponent<StudentProps> = () => {
    const { setNavbarTitle } = useRootContext();

    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        setNavbarTitle('Profile');
    }, []);

    const handleEditProfile = async () => {
        setEdit(false);
    };

    return (
        <div className=" relative flex min-h-[75dvh] flex-col items-center gap-8 px-4 pt-20">
            {!edit && !changePassword && (
                <button
                    onClick={() => setEdit(true)}
                    className="dai-btn dai-btn-circle dai-btn-primary dai-btn-sm absolute right-4 top-0"
                >
                    <Icon icon="fa:pencil" />
                </button>
            )}
            <div className="flex flex-col items-center gap-2">
                <img className="size-48 rounded-full" src="/profile.jpg" alt="" />
                {edit && <button className="dai-btn dai-btn-secondary dai-btn-sm">Change Profile</button>}

                <div className="flex flex-col items-center">
                    <span className="text-3xl font-semibold text-primary">Yudi Alfayat</span>
                    <span className="text-sm">yalfayat@gmail.com</span>
                </div>
            </div>
            <div className="w-full px-8">
                <div className="flex flex-col items-center gap-4 rounded-lg border p-2">
                    <div className="flex items-center gap-4 text-xl">
                        <Icon className="size-7" icon="ic:round-person-pin" />
                        <span>Developer</span>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                        <Icon className="size-7" icon="icon-park-twotone:phone" />
                        {edit ? (
                            <input
                                type="text"
                                required
                                placeholder="Type here"
                                className="dai-input dai-input-sm dai-input-bordered"
                            />
                        ) : (
                            <span>+6282260416039</span>
                        )}
                    </div>
                </div>
            </div>
            {edit && (
                <button onClick={handleEditProfile} className="dai-btn dai-btn-primary">
                    Submit
                </button>
            )}
            {changePassword && <FormChangePassword />}
            {!edit && !changePassword && (
                <button onClick={() => setChangePassword(true)} className="dai-btn dai-btn-primary mt-8">
                    Change Password
                </button>
            )}
        </div>
    );
};

export default Profile;
