'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { DailyPresenceCard } from '@/components/daily-presence-card';
import { DailyPresenceCardSkeleton } from '@/components/daily-presence-card-skeleton';

interface ReportProps {}

const Report: FunctionComponent<ReportProps> = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="flex min-h-[75dvh] w-full flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 px-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => {
                        return <DailyPresenceCardSkeleton key={idx} />;
                    })
                ) : (
                    <DailyPresenceCard />
                )}
            </div>
        </div>
    );
};

export default Report;
