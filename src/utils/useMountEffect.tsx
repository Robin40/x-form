import { EffectCallback, useEffect } from 'react';

export function useMountEffect(effect: EffectCallback): void {
    // eslint-disable-next-line
    useEffect(effect, []);
}
