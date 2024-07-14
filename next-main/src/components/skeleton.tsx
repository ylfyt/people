import { FC } from 'react';

interface SkeletonProps {
    children: React.ReactNode;
}

const Skeleton: FC<SkeletonProps> = ({ children }) => {
    return (
        <div className='dai-skeleton'>
            <div className='invisible'>
                {children}
            </div>
        </div>
    );
};

export default Skeleton;