import { FunctionComponent } from 'react';
import Skeleton from './skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';

interface DailyPresenceCardSkeletonProps {}

export const DailyPresenceCardSkeleton: FunctionComponent<DailyPresenceCardSkeletonProps> = () => {
    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <Skeleton>
                    <span className="text-xl font-semibold">12/12/2024</span>
                </Skeleton>
                <Skeleton>
                    <span className="italic">10 hrs</span>
                </Skeleton>
            </div>
            <div className="flex items-center justify-between">
                <Skeleton>
                    <span className="dai-badge dai-badge-success dai-badge-lg gap-1">
                        <Icon icon="icomoon-free:enter" />
                        Enter: 12:35
                    </span>
                </Skeleton>
                <Skeleton>
                    <span className={`dai-badge dai-badge-lg gap-1 dai-badge-error`}>
                        <Icon icon="mingcute:exit-fill" />
                        Exit: 23:45
                    </span>
                </Skeleton>
            </div>
        </div>
    );
};
