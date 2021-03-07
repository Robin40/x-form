import { ReactElement } from 'react';
import { ButtonProps } from '../utils/htmlProps';
import { Form } from './Form';

export interface SubmitConfig<T = any> {
    readonly submitButtonLabel?: string | ReactElement;
    readonly onValid?: OnValid<T>;
    readonly onInvalid?: OnInvalid<T> | 'disable';
    readonly onError?: OnError<T>;
    readonly buttonProps?: ButtonProps;
}

export type OnValid<T> = (values: T) => Promise<void>;
export type OnInvalid<T> = (form: Form<T>) => void;
export type OnError<T> = (err: Error, form: Form<T>) => void;
