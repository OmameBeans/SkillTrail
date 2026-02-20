import { useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (t: T) => void] => {

    const toGlobalKey = (key: string) => {
        return `skilltrail_${key}`;
    };

    const [state, setSate] = useState<T>(() => {
        const globalKey = toGlobalKey(key);
        const storageValue = localStorage.getItem(globalKey);
        if (storageValue) {
            if (typeof initialValue === 'string') {
                return storageValue as unknown as T;
            } else {
                return JSON.parse(storageValue) as T;
            }
        } else {
            const stringValue = typeof initialValue === 'string' ? initialValue : JSON.stringify(initialValue);
            localStorage.setItem(globalKey, stringValue);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        const globalKey = toGlobalKey(key);
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(globalKey, stringValue);
        setSate(value);
    };

    return [state, setValue];
};