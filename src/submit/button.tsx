import { ReactElement } from 'react';
import { $Submitter, OnValid, SubmitConfig } from './$Submitter';

export interface ButtonSpec {
    readonly config: SubmitConfig;
}

export function button(config: SubmitConfig): $Submitter;
export function button(label: string, config: SubmitConfig): $Submitter;
export function button(label: string, onValid: OnValid): $Submitter;
export function button(label: ReactElement, config: SubmitConfig): $Submitter;
export function button(label: ReactElement, onValid: OnValid): $Submitter;

export function button(
    ...args: [SubmitConfig] | [string | ReactElement, SubmitConfig | OnValid]
): $Submitter {
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
