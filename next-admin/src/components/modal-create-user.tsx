import { FunctionComponent, useDeferredValue, useEffect, useState } from 'react';
import { LoadingButton } from './loading-button';
import { sendHttp } from '@/helper/send-http';
import { ENV } from '@/helper/env';
import { toast } from 'react-toastify';
import { User } from '@/types/user';

interface ModalCreateUserProps {
    open: boolean,
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
    updateUser?: User;
}

const ModalCreateUser: FunctionComponent<ModalCreateUserProps> = ({ open, setOpen, onSuccess, updateUser }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [position, setPosition] = useState("");
    const [phone, setPhone] = useState("");
    const [picture, setPicture] = useState<File>();

    const [changePicture, setChangePicture] = useState(true);

    const disableForm = useDeferredValue(!name || !email || (!password && !!!updateUser) || !role || !position || !phone || (changePicture && !picture));

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!updateUser) return;
        setName(updateUser.name);
        setEmail(updateUser.email);
        setRole(updateUser.role);
        setPosition(updateUser.position);
        setPhone(updateUser.phone);
        setChangePicture(false);

    }, [updateUser]);

    const submit = async () => {
        type CreateUserRequest = {
            name: string;
            email: string;
            password: string;
            role: string;
            position: string;
            phone: string;
        };
        const payload: CreateUserRequest = {
            name,
            email,
            password,
            role,
            position,
            phone
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));
        changePicture && picture && formData.append("picture", picture);

        setLoading(true);
        const res = await sendHttp({
            url: updateUser ? `${ENV.API_BASE_URL}/user/${updateUser.id}/admin` : `${ENV.API_BASE_URL}/user`,
            method: updateUser ? "put" : "post",
            payload: formData
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        toast(`Successfully ${updateUser ? "update" : "create"} user`, { type: "success" });
        onSuccess();
        setOpen(false);
    };

    return (
        <dialog
            open={open} onClose={() => setOpen(false)} className="dai-modal dai-modal-bottom sm:dai-modal-middle">
            <div className="dai-modal-box">
                <h3 className="font-bold text-lg">{updateUser ? "Update" : "Create"} User</h3>
                <form onSubmit={(e) => { e.preventDefault(); submit(); }} className='grid grid-cols-1 gap-2'>
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Name</span>
                        </div>
                        <input value={name} onChange={(e) => setName(e.target.value)} required type="text" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Email</span>
                        </div>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>
                    {!updateUser && <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Password</span>
                        </div>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>}
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text">Role</span>
                        </div>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="dai-select dai-select-bordered">
                            <option value="" disabled selected>Select role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                    </label>
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Position</span>
                        </div>
                        <input value={position} onChange={(e) => setPosition(e.target.value)} required type="text" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Phone</span>
                        </div>
                        <input value={phone} onChange={e => setPhone(e.target.value)} required type="text" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>
                    {
                        (!updateUser || changePicture) &&
                        <label className="dai-form-control">
                            <div className="dai-label">
                                <span className="dai-label-text req">Profile Picture</span>
                            </div>
                            <input onChange={e => setPicture(e.target.files?.[0])} accept='.jpg,.png,.jpeg' type="file" className="dai-file-input dai-file-input-bordered" />
                        </label>
                    }
                    {
                        updateUser && !changePicture &&
                        <div className='col-span-full flex items-center gap-2 justify-center'>
                            <img className='size-12 rounded-full' src={`${ENV.API_BASE_URL}/${updateUser.profil_pic_url}`} alt="" />
                            <button onClick={() => setChangePicture(true)} type='button' className='dai-btn dai-btn-accent dai-btn-sm'>Change profile picture</button>
                        </div>
                    }
                    <div className="dai-modal-action">
                        <button type='button' onClick={() => setOpen(false)} className="dai-btn">Cancel</button>
                        <LoadingButton loading={loading} disabled={disableForm} type='submit' className="dai-btn-primary">Submit</LoadingButton>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalCreateUser;