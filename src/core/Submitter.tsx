import { ButtonProps } from '../utils/htmlProps';
import React, { ReactElement } from 'react';
import { SubmitConfig } from './$Submitter';
import { Form } from './Form';
import {
    setHasBeenSubmitted,
    setIsSubmitting,
    setSubmitError,
} from './useFormState';
import { scrollToTop } from '../utils/utils';
import _ from 'lodash';
import { scrollToField, setForm } from './Field';

interface ISubmitter<T> {
    readonly config: SubmitConfig<T>;
    readonly buttonProps: ButtonProps;

    render(): ReactElement;

    submit(form: Form<T>): Promise<void>;
}

export class Submitter<T> implements ISubmitter<T> {
    constructor(readonly config: SubmitConfig<T>) {}

    private _form: Form<T> | undefined;

    get form(): Form<T> {
        if (this._form === undefined) {
            throw new Error(
                `Tried to access parent form before initialization`
            );
        }

        return this._form;
    }

    [setForm](form: Form<T>): void {
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

    async submit(form: Form<T>): Promise<void> {
        form.state[setHasBeenSubmitted](true);

        if (!form.isValid) {
            return this.onInvalid(form);
        }

        form.state[setSubmitError](null);
        form.state[setIsSubmitting](true);
        try {
            await this.onValid(form.values as T);
        } catch (err) {
            form.state[setSubmitError](err);
            this.onError(err, form);
        } finally {
            form.state[setIsSubmitting](false);
        }
    }

    private readonly onValid = this.config.onValid;

    private onInvalid(form: Form<T>): void {
        if (this.config.onInvalid === 'disable') {
            return;
        }

        if (_.isFunction(this.config.onInvalid)) {
            this.config.onInvalid(form);
            return;
        }

        return Submitter.defaultOnInvalid(form);
    }

    private static defaultOnInvalid<T>(form: Form<T>): void {
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

    private onError = this.config.onError ?? Submitter.defaultOnError;

    private static defaultOnError(err: Error /*, form: Form */): void {
        throw err;
    }
}

function render<T>({ config, buttonProps }: Submitter<T>): ReactElement {
    return <button {...buttonProps}>{config.label}</button>;
}
