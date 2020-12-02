import { ButtonProps } from '../utils/htmlProps';
import React, { ReactElement } from 'react';
import { SubmitConfig } from './$Submitter';
import { Form } from '../Form';
import {
    setHasBeenSubmitted,
    setIsSubmitting,
    setSubmitError,
} from '../useFormState';
import { scrollToTop } from '../utils/utils';
import _ from 'lodash';
import { scrollToField, setForm } from '../fields/Field';

interface ISubmitter {
    readonly config: SubmitConfig;
    readonly buttonProps: ButtonProps;

    render(): ReactElement;

    submit(form: Form): Promise<void>;
}

export class Submitter implements ISubmitter {
    constructor(readonly config: SubmitConfig) {}

    private _form: Form | undefined;

    get form(): Form {
        if (this._form === undefined) {
            throw new Error(
                `Tried to access parent form before initialization`
            );
        }

        return this._form;
    }

    [setForm](form: Form): void {
        this._form = form;
    }

    private _buttonProps?: ButtonProps;

    get buttonProps(): ButtonProps {
        if (this._buttonProps == null) {
            this._buttonProps = this.computeButtonProps();
        }
        return this._buttonProps;
    }

    private computeButtonProps(): ButtonProps {
        const { config, form } = this;
        return {
            type: 'submit',
            disabled: config.onInvalid === 'disable' && !form.isValid,
            ...this.config.buttonProps,
        };
    }

    render(): ReactElement {
        return render(this);
    }

    async submit(form: Form): Promise<void> {
        form.state[setHasBeenSubmitted](true);

        if (!form.isValid) {
            return this.onInvalid(form);
        }

        const values = form.getValuesAssumingTheyAreValid();

        form.state[setSubmitError](null);
        form.state[setIsSubmitting](true);
        return this.onValid(values)
            .catch(form.state[setSubmitError])
            .finally(() => form.state[setIsSubmitting](false));
    }

    private readonly onValid = this.config.onValid;

    private onInvalid(form: Form): void {
        if (this.config.onInvalid === 'disable') {
            return;
        }

        if (_.isFunction(this.config.onInvalid)) {
            this.config.onInvalid(form);
            return;
        }

        return Submitter.defaultOnInvalid(form);
    }

    private static defaultOnInvalid(form: Form): void {
        const firstInvalidField = _.find(
            form.fields,
            (field) => !field.isValid
        );

        if (firstInvalidField == null) {
            scrollToTop();
            return;
        }

        firstInvalidField.focus({
            preventScroll: scrollToField(firstInvalidField),
        });
    }
}

function render({ config, buttonProps }: Submitter): ReactElement {
    return <button {...buttonProps}>{config.label}</button>;
}
