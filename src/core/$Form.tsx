import { FieldSpec, useField } from './FieldSpec';
import _ from 'lodash';
import { $Submitter, useSubmitter } from './$Submitter';
import { Form } from './Form';
import { FormProps } from '../utils/htmlProps';
import { useFormState } from './useFormState';
import { FieldSpecs } from '../utils/types';

export interface FormConfig<T> {
    readonly fields: FieldSpecs<T>;
    readonly submit: $Submitter<T>;
    readonly props?: FormProps;
}

export type FieldTransform<F> = <S, T>(
    field: FieldSpec<S, T>,
    name: string,
    fields: FieldSpecs<F>
) => FieldSpec<S, T>;

/** @see $Form */
class _$Form<T> {
    constructor(readonly config: FormConfig<T>) {}

    with(config: Partial<FormConfig<T>>): $Form<T> {
        return $Form(_.merge({}, this.config, config));
    }

    each(fieldTransform: FieldTransform<T>): $Form<T> {
        return this.with({
            fields: _.mapValues(
                this.config.fields,
                fieldTransform
            ) as FieldSpecs<T>,
        });
    }

    /** Makes the whole form read-only,
     * i.e. every field become read-only and the submit button is disabled. */
    readOnly(): $Form<T> {
        return this.each((field) => field.readOnly()).with({
            submit: this.config.submit.with({
                buttonProps: { disabled: true, 'aria-disabled': true },
            }),
        });
    }
}

export type $Form<T> = _$Form<T>;

// // eslint-disable-next-line @typescript-eslint/no-redeclare
export function $Form<T>(config: FormConfig<T>): $Form<T> {
    return new _$Form<T>(config);
}

// make `$Form(...) instanceof $Form` to work
$Form.prototype = _$Form.prototype;

export function useForm<T = any>(form: $Form<T>): Form<T> {
    const state = useFormState();

    /* Prevent the user from changing form data while submitting */
    if (state.isSubmitting) {
        form = form.readOnly();
    }

    const { config } = form;
    const fields = _.mapValues(config.fields, useField) as any;
    const submitter = useSubmitter(config.submit);

    return new Form<T>(config, fields, submitter, state);
}
