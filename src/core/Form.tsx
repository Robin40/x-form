import React, { ReactElement } from 'react';
import { FormConfig } from './$Form';
import { Field, setForm } from './Field';
import { Submitter } from './Submitter';
import _ from 'lodash';
import { FormProps } from '../utils/htmlProps';
import { FormState } from './useFormState';

interface IForm {
    readonly config: FormConfig;
    readonly fields: FormFields;
    readonly submitter: Submitter;
    readonly state: FormState;
    readonly hasBeenSubmitted: boolean;
    readonly props: FormProps;
    readonly shownFields: FormFields;
    readonly isValid: boolean;

    fillWith(data: object): void;

    render(): ReactElement;

    renderFields(): ReactElement;

    renderSubmit(): ReactElement;

    submit(): Promise<void>;

    getValuesAssumingTheyAreValid(): FormValues;
}

export type FormFields = Record<string, Field<any, any>>;

export type FormValues = {
    [p: string]: any;
};

export class Form implements IForm {
    constructor(
        readonly config: FormConfig,
        readonly fields: FormFields,
        readonly submitter: Submitter,
        readonly state: FormState
    ) {
        _.forEach(fields, (field) => field[setForm](this));
        submitter[setForm](this);
    }

    readonly hasBeenSubmitted = this.state.hasBeenSubmitted;

    readonly props = Form.propsFor(this);

    private static propsFor(form: Form): FormProps {
        return {
            onSubmit(event) {
                event.preventDefault();
                form.submit().then();
            },

            ...form.config.props,
        };
    }

    get shownFields(): FormFields {
        return this.lazyShownFields();
    }

    private lazyShownFields = lazy<FormFields>(() => {
        return _.pickBy(this.fields, 'shouldBeShown');
    });

    get isValid(): boolean {
        return this.lazyIsValid();
    }

    private lazyIsValid = lazy<boolean>(() => {
        return _.every(this.shownFields, 'isValid');
    });

    fillWith(data: object): void {
        _.forEach(data, (value, key) => {
            this.fields[key]?.fillWith(value);
        });
    }

    render(): ReactElement {
        return (
            <form {...this.props}>
                {this.renderFields()}
                {this.renderSubmit()}
            </form>
        );
    }

    renderFields(): ReactElement {
        return (
            <React.Fragment>
                {_.map(this.fields, (field) => (
                    <React.Fragment key={field.name}>
                        {field.render()}
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    }

    renderSubmit(): ReactElement {
        return this.submitter.render();
    }

    async submit(): Promise<void> {
        return this.submitter.submit(this);
    }

    getValuesAssumingTheyAreValid(): FormValues {
        return _.mapValues(this.shownFields, Field.getValueAssumingItIsValid);
    }
}

function lazy<T>(init: () => T) {
    let value: T | typeof UNINITIALIZED = UNINITIALIZED;
    return () => {
        if (value === UNINITIALIZED) {
            value = init();
        }
        return value;
    };
}

const UNINITIALIZED = Symbol('UNINITIALIZED');
