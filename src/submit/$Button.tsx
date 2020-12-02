import { ReactElement } from 'react';
import { $Submitter, OnValid, SubmitConfig } from './$Submitter';

export interface $Button {
    readonly config: SubmitConfig;
}

export function $Button(config: SubmitConfig): $Submitter;
export function $Button(label: string, config: SubmitConfig): $Submitter;
export function $Button(label: string, onValid: OnValid): $Submitter;
export function $Button(label: ReactElement, config: SubmitConfig): $Submitter;
export function $Button(label: ReactElement, onValid: OnValid): $Submitter;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export function $Button(
    ...args: [SubmitConfig] | [string | ReactElement, SubmitConfig | OnValid]
): $Submitter {
    // $Button(label, onValid)
    if (typeof args[1] === 'function') {
        return $Button(args[0] as any, { onValid: args[1] });
    }

    // $Button(label, config)
    if (args.length === 2) {
        return $Button({ label: args[0], ...args[1] });
    }

    // $Button(config)
    return new $Submitter(args[0]);
}
