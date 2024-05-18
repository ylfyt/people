'use client';

import { FunctionComponent, useDeferredValue, useEffect, useState } from 'react';
import { DailyPresenceCard } from '@/components/daily-presence-card';
import { DailyPresenceCardSkeleton } from '@/components/daily-presence-card-skeleton';
import { Icon } from '@iconify/react';
import { useRootContext } from '@/contexts/root';
import { Presence } from '@/types/presence';
import { sendHttp } from '@/helper/send-http';
import { ENV } from '@/helper/env';
import { toast } from 'react-toastify';

interface ReportProps {}

const Report: FunctionComponent<ReportProps> = () => {
    const { setNavbarTitle } = useRootContext();
    const [loading, setLoading] = useState(false);

    const [presences, setPresences] = useState<Presence[]>([]);

    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const disableBtn = useDeferredValue(!start || !end || new Date(start).getTime() > new Date(end).getTime());

    useEffect(() => {
        setNavbarTitle('Report');
        getData("", "");
    }, []);

    const getData = async (s: string, e: string) => {
        setLoading(true);
        const res = await sendHttp<Presence[]>({
            url: `${ENV.API_BASE_URL}/presence?start=${s}&end=${e}`
        });
        setLoading(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }
        setPresences(res.data);
    };

    return (
        <div className="flex min-h-[75dvh] w-full flex-col gap-2">
            <div className="mx-4 flex items-center justify-between sm:gap-8 sm:justify-start rounded-lg border p-2">

                <div className="flex items-center gap-2 sm:flex-row flex-col">
                    <div className='flex gap-2 items-center'>
                        <span className='w-11 sm:hidden'>Start</span>
                        <input
                            value={start}
                            onChange={e => setStart(e.target.value)}
                            type="date"
                            className="rounded-lg text-sm sm:text-base bg-base-200 px-2 py-1 outline-none focus:outline focus:outline-base-200"
                        />
                    </div>
                    <span className='hidden sm:block'>to</span>
                    <div className='flex gap-2 items-center'>
                        <span className='w-11 sm:hidden'>End</span>
                        <input
                            value={end}
                            onChange={e => setEnd(e.target.value)}
                            type="date"
                            className="rounded-lg bg-base-200 text-sm sm:text-base px-2 py-1 outline-none focus:outline focus:outline-base-200"
                        />
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <button onClick={() => getData(start, end)} disabled={disableBtn || loading} className="dai-btn dai-btn-primary dai-btn-sm">
                        <Icon icon="fa:search" />
                    </button>
                    {(start || end) && <button onClick={() => {
                        setStart("");
                        setEnd("");
                        getData("", "");
                    }} className='dai-btn dai-btn-sm'><Icon icon="ic:baseline-clear" /></button>}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2 px-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => {
                        return <DailyPresenceCardSkeleton key={idx} />;
                    })
                ) : (
                    presences.map((el, idx) => {
                        return <DailyPresenceCard key={idx} presence={el} />;
                    })
                )}
            </div>
        </div>
    );
};

export default Report;
