import _ from 'lodash';
import { ButtonSpec } from '../builtin/button';
import { ReactElement } from 'react';
import { ButtonProps } from '../utils/htmlProps';
import { Submitter } from './Submitter';
import { Form } from './Form';

export interface SubmitConfig<T = any> {
    readonly submitButtonLabel?: string | ReactElement;
    readonly onValid: OnValid<T>;
    readonly onInvalid?: OnInvalid<T> | 'disable';
    readonly onError?: OnError<T>;
    readonly buttonProps?: ButtonProps;
}

export type OnValid<T> = (values: T) => Promise<void>;
export type OnInvalid<T> = (form: Form<T>) => void;
export type OnError<T> = (err: Error, form: Form<T>) => void;

interface I$Submitter<T> {
    readonly config: SubmitConfig<T>;

    with(config: Partial<SubmitConfig<T>>): ButtonSpec<T>;
}

export class $Submitter<T = any> implements I$Submitter<T> {
    constructor(readonly config: SubmitConfig<T>) {}

    with(config: Partial<SubmitConfig<T>>): $Submitter<T> {
        return new $Submitter(_.merge({}, this.config, config));
    }
}

export function useSubmitter<T>(submitter: $Submitter<T>): Submitter<T> {
    return new Submitter(submitter.config);
}
