'use client';

import { FunctionComponent, useState } from 'react';
import { Icon } from '@iconify/react';
import { FormChangePassword } from './components/form-change-password';

interface StudentProps {}

const Profile: FunctionComponent<StudentProps> = () => {
    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

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
            </div>
            <div className="flex w-full flex-col gap-4 px-8">
                <div className="flex w-full items-center">
                    <span className="w-32">Name</span>
                    <span className="w-4">:</span>
                    <span>Yudi Alfayat</span>
                </div>
                <div className="flex w-full items-center">
                    <span className="w-32">Email</span>
                    <span className="w-4">:</span>
                    <span>yalfayat@gmail.com</span>
                </div>
                <div className="flex w-full items-center">
                    <span className="w-32">Position</span>
                    <span className="w-4">:</span>
                    <span>Developer</span>
                </div>
                <div className="flex w-full items-center">
                    <span className="w-32">Phone</span>
                    <span className="w-4">:</span>
                    {edit ? (
                        <input
                            type="text"
                            placeholder="Type here"
                            className="dai-input dai-input-sm dai-input-bordered w-44"
                        />
                    ) : (
                        <span>+6282260416039</span>
                    )}
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
