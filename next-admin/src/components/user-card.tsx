import { ENV } from '@/helper/env';
import { formatDate } from '@/helper/format-date';
import { User } from '@/types/user';
import { FunctionComponent } from 'react';

interface UserCadProps {
    user: User;
}

const UserCad: FunctionComponent<UserCadProps> = ({ user }) => {
    return (
        <div className="flex flex-col gap-2 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <img className='size-10 rounded-full' src={`${ENV.API_BASE_URL}/${user.profil_pic_url}`} alt="" />
                    <span className="font-semibold">{user.name}</span>
                </div>
                <div className='flex items-center gap-1'>
                    {user.role === "ADMIN" && <span className='dai-badge dai-badge-accent'>ADMIN</span>}
                    <span className='dai-badge dai-badge-primary'>{user.position}</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span>{user.email}</span>
                <span>{user.phone}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className='text-sm'>Modified At: {formatDate(user.updatedAt ?? user.createdAt, {})}</span>
            </div>
        </div>
    );
};

export default UserCad;