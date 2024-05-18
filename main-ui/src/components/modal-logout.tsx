import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingButton } from './loading-button';

interface ModalLogoutProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalLogout: FunctionComponent<ModalLogoutProps> = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const logout = async () => {
        setLoading(true);
        const res = await sendHttp({
            url: `${ENV.AUTH_BASE_URL}/logout`,
            method: 'post'
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        localStorage.removeItem("jit");
        window.location.href = "/login";
    };


    return (
        <dialog open={open} className="dai-modal dai-modal-bottom sm:dai-modal-middle">
            <div className="dai-modal-box">
                <h3 className="font-bold text-lg">Logout</h3>
                <p className="py-4">Are you sure want to logout?</p>
                <div className="dai-modal-action">
                    <button onClick={() => setOpen(false)} className="dai-btn">Cancel</button>
                    <LoadingButton loading={loading} onClick={logout} className="dai-btn-error">Logout</LoadingButton>
                </div>
            </div>
        </dialog>
    );
};

export default ModalLogout;