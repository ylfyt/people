import { FunctionComponent, useDeferredValue, useState } from 'react';
import { LoadingButton } from './loading-button';
import { sendHttp } from '@/helper/send-http';
import { ENV } from '@/helper/env';
import { toast } from 'react-toastify';

interface ModalCreateUserProps {
    open: boolean,
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
}

const ModalCreateUser: FunctionComponent<ModalCreateUserProps> = ({ open, setOpen, onSuccess }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [position, setPosition] = useState("");
    const [phone, setPhone] = useState("");
    const [picture, setPicture] = useState<File>();

    const disableForm = useDeferredValue(!name || !email || !password || !role || !position || !phone || !picture);

    const [loading, setLoading] = useState(false);

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
        picture && formData.append("picture", picture);

        setLoading(true);
        const res = await sendHttp({
            url: `${ENV.API_BASE_URL}/user`,
            method: "post",
            payload: formData
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        toast("Successfully create user", { type: "success" });
        onSuccess();
        setOpen(false);
    };

    return (
        <dialog
            open={open} onClose={() => setOpen(false)} className="dai-modal dai-modal-bottom sm:dai-modal-middle">
            <div className="dai-modal-box">
                <h3 className="font-bold text-lg">Create User</h3>
                <form onSubmit={(e) => { e.preventDefault(); submit(); }} className='grid grid-cols-1'>
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
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Password</span>
                        </div>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Type here" className="dai-input dai-input-bordered" />
                    </label>
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
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="dai-label-text req">Profile Picture</span>
                        </div>
                        <input onChange={e => setPicture(e.target.files?.[0])} accept='.jpg,.png,.jpeg' type="file" className="dai-file-input dai-file-input-bordered" />
                    </label>
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