import { LoadingButton } from '@/components/loading-button';
import { useAuthContext } from '@/contexts/auth';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { Dispatch, FunctionComponent, SetStateAction, useDeferredValue, useState } from 'react';
import { toast } from 'react-toastify';

interface FormChangePasswordProps {
    setChangePassword: Dispatch<SetStateAction<boolean>>;
}

export const FormChangePassword: FunctionComponent<FormChangePasswordProps> = ({ setChangePassword }) => {
    const { user } = useAuthContext();

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const disableForm = useDeferredValue(!password.length || !newPassword.length || !confirmPassword.length || newPassword !== confirmPassword);

    const [loading, setLoading] = useState(false);

    const submit = async () => {
        type ChangePasswordRequest = {
            password: string;
            newPassword: string;
        };
        const payload: ChangePasswordRequest = {
            password,
            newPassword
        };
        setLoading(true);
        const res = await sendHttp({
            url: `${ENV.AUTH_BASE_URL}/user/${user?.id}/change-password`,
            method: 'put',
            payload
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        toast("Successfully change password", { type: "success" });
        setChangePassword(false);
    };

    return (
        <form onSubmit={e => { e.preventDefault(); submit(); }} className="grid grid-cols-1 gap-4">
            <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="Current password" className="dai-input dai-input-bordered" />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} required type="password" placeholder="New password" className="dai-input dai-input-bordered" />
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required type="password" placeholder="Confirm password" className="dai-input dai-input-bordered" />
            <div className="grid place-items-center">
                <LoadingButton disabled={disableForm} loading={loading} className='dai-btn-primary'>Submit</LoadingButton>
            </div>
        </form>
    );
};
