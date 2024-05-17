import { FunctionComponent } from 'react';
import { Icon } from '@iconify/react';

interface DailyPresenceCardProps {}

export const DailyPresenceCard: FunctionComponent<DailyPresenceCardProps> = () => {
    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">03/11/2024</span>
                <span className="italic">8 hrs</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="dai-badge dai-badge-success dai-badge-lg gap-1">
                    <Icon icon="icomoon-free:enter" />
                    Enter: 07:45
                </span>
                <span className="dai-badge dai-badge-error dai-badge-lg gap-1">
                    <Icon icon="mingcute:exit-fill" />
                    Exit: 18:00
                </span>
            </div>
        </div>
    );
};
