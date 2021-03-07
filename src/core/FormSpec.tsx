import { FieldSpec, useField } from './FieldSpec';
import _ from 'lodash';
import { SubmitConfig } from './SubmitConfig';
import { Form } from './Form';
import { FormProps } from '../utils/htmlProps';
import { useFormState } from './useFormState';
import { FieldSpecs } from '../utils/types';
import { Submitter } from './Submitter';

export interface FormConfig<T = any> {
    readonly fields: FieldSpecs<T>;
    readonly submit?: SubmitConfig<T>;
    readonly props?: FormProps;
}

export type FieldTransform<F> = <S, T>(
    field: FieldSpec<S, T>,
    name: string,
    fields: FieldSpecs<F>
) => FieldSpec<S, T>;

export class FormSpec<T> {
    constructor(readonly config: FormConfig<T>) {}

    with(config: Partial<FormConfig<T>>): FormSpec<T> {
        return new FormSpec(_.merge({}, this.config, config));
    }

    each(fieldTransform: FieldTransform<T>): FormSpec<T> {
        return this.with({
            fields: _.mapValues(
                this.config.fields,
                fieldTransform
            ) as FieldSpecs<T>,
        });
    }

    /** Makes the whole form read-only,
     * i.e. every field become read-only and the submit button is disabled. */
    readOnly(): FormSpec<T> {
        return this.each((field) => field.readOnly()).with({
            submit: {
                buttonProps: { disabled: true, 'aria-disabled': true },
            },
        });
    }
}

export function useForm<T = any>(
    spec: FormSpec<T>,
    submit: SubmitConfig<T>
): Form<T> {
    const state = useFormState();

    /* Prevent the user from changing form data while submitting */
    if (state.isSubmitting) {
        spec = spec.readOnly();
    }

    const { config } = spec.with({ submit });
    const fields = _.mapValues(config.fields, useField) as any;
    const submitter = new Submitter(config.submit ?? {});

    return new Form<T>(config, fields, submitter, state);
}
