'use client';

import { LoadingButton } from '@/components/loading-button';
import { useRootContext } from '@/contexts/root';
import { LastPresenceDto } from '@/dtos/last-presence';
import { ENV } from '@/helper/env';
import { sendHttp } from '@/helper/send-http';
import { Presence } from '@/types/presence';
import { Icon } from '@iconify/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface HomeProps {}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month index starts from 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const Home: FunctionComponent<HomeProps> = () => {
    const { setNavbarTitle } = useRootContext();

    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enterTime, setEnterTime] = useState('');
    const [exitTime, setExitTime] = useState('');

    const [loadingEnter, setLoadingEnter] = useState(false);
    const [loadingExit, setLoadingExit] = useState(false);

    useEffect(() => {
        setNavbarTitle('Home');
        getStatus();
    }, []);

    const presence = async (type: "ENTER" | "EXIT") => {
        const confirmed = confirm("Are you sure to continue?");
        if (!confirmed) return;

        type CreatePresenceDto = {
            type: "ENTER" | "EXIT";
        };
        const payload: CreatePresenceDto = { type };

        if (type === "ENTER") setLoadingEnter(true);
        else setLoadingExit(true);
        const res = await sendHttp<Presence>({
            url: `${ENV.API_BASE_URL}/presence`,
            method: 'post',
            payload
        });
        if (type === "ENTER") setLoadingEnter(false);
        else setLoadingExit(false);
        if (!res.success) {
            toast(res.message, { type: "error" });
            return;
        }

        toast("Success", { type: "success" });
        if (type === 'ENTER') {
            setEnterTime(formatDate(res.data.enterDate));
        } else {
            setExitTime(!res.data.exitDate?.length ? "" : formatDate(res.data.exitDate));
        }
    };

    const getStatus = async () => {
        setLoading(true);
        const res = await sendHttp<LastPresenceDto>({
            url: `${ENV.API_BASE_URL}/presence/last`,
        });
        setLoading(false);
        if (!res.success) {
            setFailed(true);
            toast(res.message, { type: "error" });
            return;
        }
        setEnterTime(!res.data.enterDate ? "" : formatDate(res.data.enterDate));
        setExitTime(!res.data.exitDate ? "" : formatDate(res.data.exitDate));
    };

    return (
        <div className="grid min-h-[75dvh] place-items-center">
            {loading ? (
                <div className="flex flex-col gap-4">
                    <button className="dai-btn dai-skeleton h-28 w-40"></button>
                    <button className="dai-btn dai-skeleton h-28 w-40"></button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <LoadingButton
                        loading={loadingEnter}
                        size='lg'
                        onClick={() => presence("ENTER")}
                        disabled={enterTime.length > 0 || failed}
                        className="dai-btn dai-btn-success flex h-28 w-40 flex-col gap-2"
                    >
                        <span className="flex items-center gap-2 text-2xl">
                            <Icon icon="icomoon-free:enter" />
                            Enter
                        </span>
                        {enterTime.length > 0 && <span className="text-sm">{enterTime}</span>}
                    </LoadingButton>
                    <LoadingButton
                        loading={loadingExit}
                        size='lg'
                        onClick={() => presence("EXIT")}
                        disabled={enterTime.length === 0 || exitTime.length > 0 || failed}
                        className="dai-btn dai-btn-error flex h-28 w-40 flex-col gap-2"
                    >
                        <span className="flex items-center gap-2 text-2xl">
                            <Icon icon="mingcute:exit-fill" />
                            Exit
                        </span>
                        {exitTime.length > 0 && <span className="text-sm">{exitTime}</span>}
                    </LoadingButton>
                </div>
            )}
        </div>
    );
};

export default Home;
