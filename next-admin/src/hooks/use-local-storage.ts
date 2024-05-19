import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
    let tempInitValue: T;
    if (typeof initialValue == 'function') {
        tempInitValue = (initialValue as () => T)();
    } else {
        tempInitValue = initialValue;
    }

    if (typeof window === 'undefined') {
        const [value, setValue] = useState(initialValue);
        return [value, setValue];
    }


    const [value, setValue] = useState<T>(() => {
        const rawValue = localStorage.getItem(key);
        if (rawValue == null) {
            return tempInitValue;
        }
        try {
            if (typeof tempInitValue === 'string') {
                return rawValue;
            }
            return JSON.parse(rawValue);
        } catch {
            return tempInitValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue] as [T, typeof setValue];
}