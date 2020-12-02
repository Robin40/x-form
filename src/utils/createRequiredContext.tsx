import { createContext } from 'react';

export function createRequiredContext<T>(name: string) {
    return createContext<T>(Bomb(`You forgot ${name}Context.Provider`));
}

export function Bomb<T>(message: string): T {
    return new Proxy(
        {},
        {
            get() {
                throw new Error(message);
            },
        }
    ) as T;
}
