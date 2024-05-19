import { FunctionComponent, useDeferredValue } from 'react';
import { Icon } from '@iconify/react';
import { Presence } from '@/types/presence';
import { formatDate } from '@/helper/format-date';
import { dateDiffHour } from '@/helper/date-diff-hour';

interface DailyPresenceCardProps {
    presence: Presence;
}

export const DailyPresenceCard: FunctionComponent<DailyPresenceCardProps> = ({ presence }) => {
    const startDate = useDeferredValue(formatDate(presence.enterDate, { onlyDate: true }));
    const endDate = useDeferredValue(formatDate(presence.exitDate, { onlyDate: true }));
    const date = useDeferredValue(startDate === endDate || endDate === "-" ? startDate : `${startDate}-${endDate}`);

    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-base-200 p-4 shadow">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{presence.user?.name ?? "-"}</span>
                <div className='flex items-center gap-1'>
                    <span className="text-sm font-semibold">{date}</span>
                    {
                        presence.exitDate &&
                        <span className="text-sm">({dateDiffHour(presence.enterDate, presence.exitDate)} hrs)</span>
                    }
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="dai-badge dai-badge-success dai-badge-lg gap-1">
                    <Icon icon="icomoon-free:enter" />
                    Enter: {formatDate(presence.enterDate, { onlyTime: true })}
                </span>
                <span className={`dai-badge dai-badge-lg gap-1 ${presence.exitDate ? "dai-badge-error" : "dai-badge-ghost"}`}>
                    <Icon icon="mingcute:exit-fill" />
                    Exit: {!presence.exitDate ? "-" : formatDate(presence.exitDate, { onlyTime: true })}
                </span>
            </div>
        </div>
    );
};
