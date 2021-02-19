import { ReactElement } from 'react';
import { $Submitter, OnValid, SubmitConfig } from '../core/$Submitter';

export interface ButtonSpec<T = any> {
    readonly config: SubmitConfig<T>;
}

export function button<T = any>(config: SubmitConfig<T>): $Submitter<T>;
export function button<T = any>(
    label: string,
    config: SubmitConfig<T>
): $Submitter<T>;
export function button<T = any>(
    label: string,
    onValid: OnValid<T>
): $Submitter<T>;
export function button<T = any>(
    label: ReactElement,
    config: SubmitConfig<T>
): $Submitter<T>;
export function button<T = any>(
    label: ReactElement,
    onValid: OnValid<T>
): $Submitter<T>;

export function button<T = any>(
    ...args:
        | [SubmitConfig<T>]
        | [string | ReactElement, SubmitConfig<T> | OnValid<T>]
): $Submitter<T> {
    // $Button(label, onValid)
    if (typeof args[1] === 'function') {
        return button(args[0] as any, { onValid: args[1] });
    }

    // $Button(label, config)
    if (args.length === 2) {
        return button({ label: args[0], ...args[1] });
    }

    // $Button(config)
    return new $Submitter(args[0]);
}
