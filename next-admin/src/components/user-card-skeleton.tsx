import { FunctionComponent } from 'react';

interface UserCardSkeletonProps {

}

const UserCardSkeleton: FunctionComponent<UserCardSkeletonProps> = () => {
    return (
        <div className="flex flex-col gap-2 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className='size-10 rounded-full dai-skeleton'></div>
                    <span className="dai-skeleton h-6 w-32"></span>
                </div>
                <div className='flex items-center gap-1'>
                    <span className='dai-skeleton h-4 w-20'></span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="dai-skeleton h-4 w-32"></span>
                <span className="dai-skeleton h-4 w-32"></span>
            </div>
            <div className="flex items-center justify-between">
                <span className="dai-skeleton h-4 w-44"></span>
            </div>
        </div>
    );
};

export default UserCardSkeleton;