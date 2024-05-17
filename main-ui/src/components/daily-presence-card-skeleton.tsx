import { FunctionComponent } from 'react';

interface DailyPresenceCardSkeletonProps {}

export const DailyPresenceCardSkeleton: FunctionComponent<DailyPresenceCardSkeletonProps> = () => {
    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <div className="dai-skeleton h-8 w-32"></div>
                <div className="dai-skeleton h-5 w-20"></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="dai-skeleton h-5 w-36"></div>
                <div className="dai-skeleton h-5 w-32"></div>
            </div>
        </div>
    );
};
