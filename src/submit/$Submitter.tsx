import _ from 'lodash';
import { ButtonSpec } from './button';
import { ReactElement } from 'react';
import { ButtonProps } from '../utils/htmlProps';
import { Submitter } from './Submitter';
import { Form } from '../Form';

export interface SubmitConfig {
    readonly label?: string | ReactElement;
    readonly onValid: OnValid;
    readonly onInvalid?: OnInvalid | 'disable';
    readonly onError?: OnError;
    readonly buttonProps?: ButtonProps;
}

export type OnValid = (values: any) => Promise<void>;
export type OnInvalid = (form: Form) => void;
export type OnError = (err: Error, form: Form) => void;

interface I$Submitter {
    readonly config: SubmitConfig;
    with(config: Partial<SubmitConfig>): ButtonSpec;
}

export class $Submitter implements I$Submitter {
    constructor(readonly config: SubmitConfig) {}

    with(config: Partial<SubmitConfig>): $Submitter {
        return new $Submitter(_.merge({}, this.config, config));
    }
}

export function useSubmitter(submitter: $Submitter): Submitter {
    return new Submitter(submitter.config);
}
