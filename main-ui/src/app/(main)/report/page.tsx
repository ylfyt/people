'use client';

import { FunctionComponent, useEffect, useState } from 'react';
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

    useEffect(() => {
        setNavbarTitle('Report');
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        const res = await sendHttp<Presence[]>({
            url: `${ENV.API_BASE_URL}/presence`
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
            <div className="mx-4 flex items-center justify-between rounded-lg border p-2">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        className="rounded-lg bg-base-200 px-2 py-1 outline-none focus:outline focus:outline-base-200"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="rounded-lg bg-base-200 px-2 py-1 outline-none focus:outline focus:outline-base-200"
                    />
                </div>
                <button className="dai-btn dai-btn-primary dai-btn-sm">
                    <Icon icon="fa:search" />
                </button>
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
