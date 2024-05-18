'use client';

import { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { FormChangePassword } from './components/form-change-password';
import { useRootContext } from '@/contexts/root';
import { useAuthContext } from '@/contexts/auth';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { LoadingButton } from '@/components/loading-button';
import { toast } from 'react-toastify';
import { User } from '@/types/user';

interface StudentProps {}

const Profile: FunctionComponent<StudentProps> = () => {
    const { setNavbarTitle } = useRootContext();
    const { user, setUser } = useAuthContext();

    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pictureUrl, setImageUrl] = useState(`${ENV.AUTH_BASE_URL}/${user?.profil_pic_url}`);
    const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

    const [phone, setPhone] = useState(user?.phone ?? "");
    const [picture, setPicture] = useState<File | null>(null);

    useEffect(() => {
        setNavbarTitle('Profile');
    }, []);

    useEffect(() => {
        if (!picture) {
            setImageUrl(`${ENV.AUTH_BASE_URL}/${user?.profil_pic_url}`);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(picture);
    }, [picture]);

    const handleEditProfile = async () => {
        type UpdateProfileRequest = {
            phone: string;
        };
        const payload: UpdateProfileRequest = {
            phone
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));
        picture && formData.append("picture", picture);

        setLoadingUpdateProfile(true);
        const res = await sendHttp<User>({
            url: `${ENV.AUTH_BASE_URL}/user/${user?.id}`,
            method: "put",
            payload: formData
        });
        setLoadingUpdateProfile(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        toast("Successfully update profile", { type: "success" });
        setUser(res.data);
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
                <img className="size-48 rounded-full" src={pictureUrl} alt="" />
                {edit && <>
                    {
                        picture ?
                            <button onClick={() => setPicture(null)} className="dai-btn dai-btn-error dai-btn-sm">Delete</button>
                            :
                            <button onClick={() => fileInputRef.current?.click()} className="dai-btn dai-btn-secondary dai-btn-sm">Change Profile</button>
                    }
                    <input onChange={(e) => setPicture(e.target.files?.[0] ?? null)} accept='.jpg,.png,.jpeg' ref={fileInputRef} type="file" className='hidden' />
                </>}

                <div className="flex flex-col items-center">
                    <span className="text-3xl font-semibold text-primary">{user?.name}</span>
                    <span className="text-sm">{user?.email}</span>
                </div>
            </div>
            <div className="w-full px-8">
                <div className="flex flex-col items-center gap-4 rounded-lg border p-2">
                    <div className="flex items-center gap-4 text-xl">
                        <Icon className="size-7" icon="ic:round-person-pin" />
                        <span>{user?.position}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xl">
                        <Icon className="size-7" icon="icon-park-twotone:phone" />
                        {edit ? (
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="Type here"
                                className="dai-input dai-input-sm dai-input-bordered"
                            />
                        ) : (
                            <span>{user?.phone}</span>
                        )}
                    </div>
                </div>
            </div>
            {edit && (
                <LoadingButton disabled={!phone.length} loading={loadingUpdateProfile} onClick={handleEditProfile} className="dai-btn dai-btn-primary">
                    Submit
                </LoadingButton>
            )}
            {changePassword && <FormChangePassword setChangePassword={setChangePassword} />}
            {!edit && !changePassword && (
                <button onClick={() => setChangePassword(true)} className="dai-btn dai-btn-primary mt-8">
                    Change Password
                </button>
            )}
        </div>
    );
};

export default Profile;
