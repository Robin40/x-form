import { FieldSpec, useField } from './FieldSpec';
import _ from 'lodash';
import { $Submitter, useSubmitter } from './$Submitter';
import { Form } from './Form';
import { FormProps } from '../utils/htmlProps';
import { useFormState } from './useFormState';

export interface FormConfig {
    readonly fields: $FormFields;
    readonly submit: $Submitter;
    readonly props?: FormProps;
}

export type FieldTransform = <S, T>(
    field: FieldSpec<S, T>,
    name: string,
    fields: $FormFields
) => FieldSpec<S, T>;

/** @see $Form */
class _$Form {
    constructor(readonly config: FormConfig) {}

    with(config: Partial<FormConfig>): $Form {
        return $Form(_.merge({}, this.config, config));
    }

    each(fieldTransform: FieldTransform): $Form {
        return this.with({
            fields: _.mapValues(this.config.fields, fieldTransform),
        });
    }

    /** Makes the whole form read-only,
     * i.e. every field become read-only and the submit button is disabled. */
    readOnly(): $Form {
        return this.each((field) => field.readOnly()).with({
            submit: this.config.submit.with({
                buttonProps: { disabled: true, 'aria-disabled': true },
            }),
        });
    }
}

export type $Form = _$Form;

// // eslint-disable-next-line @typescript-eslint/no-redeclare
export function $Form(config: FormConfig): $Form {
    return new _$Form(config);
}

// make `$Form(...) instanceof $Form` to work
$Form.prototype = _$Form.prototype;

type $FormFields = {
    [p: string]: FieldSpec<any, any>;
};

export function useForm(form: $Form): Form {
    const state = useFormState();

    /* Prevent the user from changing form data while submitting */
    if (state.isSubmitting) {
        form = form.readOnly();
    }

    const { config } = form;
    const fields = _.mapValues(config.fields, useField);
    const submitter = useSubmitter(config.submit);

    return new Form(config, fields, submitter, state);
}
