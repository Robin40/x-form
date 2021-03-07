import React, { ReactElement } from 'react';
import { FormConfig } from './FormSpec';
import { Field } from './Field';
import { Submitter } from './Submitter';
import _ from 'lodash';
import { FormProps } from '../utils/htmlProps';
import { FormState } from './useFormState';
import autoBind from 'auto-bind';
import { Fields } from '../utils/types';

interface IForm<T> {
    readonly config: FormConfig<T>;
    readonly fields: Fields<T>;
    readonly submitter: Submitter<T>;
    readonly state: FormState;
    readonly hasBeenSubmitted: boolean;
    readonly props: FormProps;
    readonly shownFields: Partial<Fields<T>>;
    readonly isValid: boolean;

    fillWith(data: Record<string, unknown>): void;

    render(): ReactElement;

    renderFields(): ReactElement;

    renderSubmit(): ReactElement;

    submit(): Promise<void>;

    values: Partial<T>;

    reset(): void;
}

export type FormFields = Record<string, Field<any, any>>;

// noinspection JSUnusedGlobalSymbols
export type FormValues = {
    [p: string]: any;
};

export class Form<T = any> implements IForm<T> {
    constructor(
        readonly config: FormConfig<T>,
        readonly fields: Fields<T>,
        readonly submitter: Submitter<T>,
        readonly state: FormState
    ) {
        _.forEach(fields, (field) => field.setForm(this));
        submitter.setForm(this);

        autoBind(this);
    }

    readonly hasBeenSubmitted = this.state.hasBeenSubmitted;

    readonly props = Form.propsFor(this);

    private static propsFor<T>(form: Form<T>): FormProps {
        return {
            onSubmit(event) {
                event.preventDefault();
                form.submit().then();
            },

            ...form.config.props,
        };
    }

    get shownFields(): Partial<Fields<T>> {
        return this.lazyShownFields();
    }

    private lazyShownFields = lazy<Partial<Fields<T>>>(() => {
        return _.pickBy(this.fields, 'shouldBeShown');
    });

    get isValid(): boolean {
        return this.lazyIsValid();
    }

    private lazyIsValid = lazy<boolean>(() => {
        return _.every(this.shownFields, 'isValid');
    });

    fillWith(data: Record<string, unknown>): void {
        _.forEach(data, (value, key) => {
            this.fields[key]?.fillWith?.(value);
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

    get values(): Partial<T> {
        return _.mapValues(this.fields, 'value') as Partial<T>;
    }

    reset(): void {
        _.forEach(this.fields, (field) => field.reset());
        this.state.setHasBeenSubmitted(false);
        this.state.setSubmitError(null);
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
