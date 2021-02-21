import * as React from 'react';
import { ChangeEvent, FocusEvent, ReactElement, RefObject } from 'react';
import {
    FieldCategory,
    FieldConfig,
    FieldDefaults,
    Options,
} from './FieldSpec';
import { InputProps, LabelProps, TextAreaProps } from '../utils/htmlProps';
import { InputState } from './useInputState';
import { Invalid, Predicate, Result, ResultType, Valid } from './Result';
import Immutable from 'immutable';
import deepExtend from 'deep-extend';
import { Theme } from './Theme';
import { EnumOption, Option, OptionWithProps } from './EnumOption';
import {
    isReactElement,
    quote,
    removeExcessWhitespace,
    scrollToTop,
} from '../utils/utils';
import { Form, FormFields } from './Form';
import _ from 'lodash';
import { XFormLocale } from './XFormLocale';

export const setForm = Symbol('setForm');
export const describe = Symbol('describe');

interface IField<S, T> {
    readonly locale: XFormLocale;
    readonly defaults: FieldDefaults<S, T>;
    readonly config: FieldConfig<S, T>;
    readonly name: string;
    readonly input: InputState<S>;
    readonly containerRef: RefObject<HTMLDivElement>;
    readonly inputRef: RefObject<HTMLInputElement>;
    readonly textAreaRef: RefObject<HTMLTextAreaElement>;
    readonly theme: Theme;

    readonly form: Form<any>;

    /** @internal */
    [setForm]<T>(form: Form<T>): void;

    readonly category?: FieldCategory;
    readonly nonZero: boolean;
    readonly allowNegative: boolean;

    /** True if the field is optional, i.e was wrapped in an `optional`.
     * By default all built-in builtin are required. */
    readonly isOptional: boolean;

    readonly subFields: FormFields;

    readonly result: Result<T>;

    /** True if the field can be submitted with the current input, i.e. the user
     * input is in the requested format and the corresponding value passes all
     * validations. */
    readonly isValid: boolean;

    is(value: T): boolean;

    is(predicate: Predicate<T>): boolean;

    is(type: ResultType): boolean;

    readonly label?: string | ReactElement;
    readonly inputProps: InputProps;
    readonly textAreaProps: TextAreaProps;
    readonly options: OptionWithProps[];

    [describe](): string;

    preprocess(input: S): S;

    isBlank(input: S): boolean;

    parse(input: S): Result<T>;

    validate(value: T): Result<T>;

    optionInputProps(option: Option): InputProps;

    shouldBeShown: boolean;

    render(): ReactElement | null;

    focus: HTMLInputElement['focus'];

    isFocused: boolean;

    fillWith(data: any): void;

    reset(): void;
}

export class Field<S, T> implements IField<S, T> {
    constructor(
        readonly locale: XFormLocale,
        readonly defaults: FieldDefaults<S, T>,
        readonly config: FieldConfig<S, T>,
        readonly name: string,
        readonly input: InputState<S>,
        readonly containerRef: RefObject<HTMLDivElement>,
        readonly inputRef: RefObject<HTMLInputElement>,
        readonly textAreaRef: RefObject<HTMLTextAreaElement>,
        readonly theme: Theme,
        readonly subFields: FormFields
    ) {
        _.forEach(subFields, (subField) => {
            subField.superField = this;
        });
    }

    private _form: Form<any> | undefined;

    get form(): Form<any> {
        if (this._form === undefined) {
            throw new Error(
                `Tried to access parent form before initialization`
            );
        }

        return this._form;
    }

    [setForm]<T>(form: Form<T>): void {
        this._form = form as any;
        _.forEach(this.subFields, (subField) => {
            subField[setForm](form);
        });
    }

    /** @internal */
    superField?: Field<any, any>;

    private readonly defaultOptions: Options = [];

    private defaultPreprocess(input: S): S {
        return input;
    }

    private defaultIsBlank(input: S): boolean {
        return Immutable.is(input, this.defaults.blankInput);
    }

    private readonly defaultBlankResult = Invalid<T>(
        this.locale.fieldIsRequired
    );

    private readonly defaultBlankOption = this.locale.selectAnOption;

    private defaultIsFocused(): boolean {
        return this.input.isFocused;
    }

    // noinspection JSMethodCanBeStatic
    private defaultShowRule(): boolean {
        return true;
    }

    private readonly defaultMethods = {
        options: this.defaultOptions,
        preprocess: this.defaultPreprocess,
        isBlank: this.defaultIsBlank,
        blankResult: this.defaultBlankResult,
        blankOption: this.defaultBlankOption,
        isFocused: this.defaultIsFocused,
        showRule: this.defaultShowRule,
    };

    private readonly methods = _.merge(
        {},
        this.defaultMethods,
        this.defaults,
        this.config
    );

    readonly label = this.methods.label;
    readonly preprocess = this.methods.preprocess.bind(this);
    readonly isBlank = this.methods.isBlank.bind(this);
    readonly blankResult = this.methods.blankResult;
    readonly blankOption = this.methods.blankOption;
    readonly parse = this.methods.parse.bind(this);
    readonly validate = this.methods.validate.bind(this);
    readonly category = this.methods.category;
    readonly nonZero = this.methods.nonZero ?? false;
    readonly allowNegative = this.methods.allowNegative ?? false;
    private readonly getIsFocused = this.methods.isFocused.bind(this);
    private readonly showRule = this.methods.showRule.bind(this);

    readonly isOptional = this.blankResult instanceof Valid;

    readonly inputProps = this.computeInputProps();

    private computeInputProps(): InputProps {
        const field = this;
        const { config, defaults, name, input } = field;

        const defaultInputProps: Partial<InputProps> = {
            id: name,
            name,
        };
        if (typeof input.value === 'boolean') {
            defaultInputProps.checked = input.value;
        } else {
            defaultInputProps.value = input.value as any;
        }

        const eventHandlers: Partial<InputProps> = {
            onChange(event) {
                field.defaultOnChange(event);
                defaults.inputProps?.onChange?.bind(field)?.(event);
                config.inputProps?.onChange?.bind(field)?.(event);
            },

            onFocus(event) {
                field.defaultOnFocus(event);
                defaults.inputProps?.onFocus?.bind(field)?.(event);
                config.inputProps?.onFocus?.bind(field)?.(event);
            },

            onBlur(event) {
                field.defaultOnBlur(event);
                defaults.inputProps?.onBlur?.bind(field)?.(event);
                config.inputProps?.onBlur?.bind(field)?.(event);
            },
        };

        return deepExtend(
            defaultInputProps,
            _.merge({}, defaults.inputProps, {
                placeholder: defaults.placeholder,
            }),
            _.merge({}, config.inputProps, {
                placeholder: config.placeholder,
            }),
            eventHandlers
        );
    }

    private defaultOnChange(event: ChangeEvent<HTMLInputElement>) {
        if (typeof this.input.value === 'boolean') {
            this.input.setValue(event.target.checked as any);
        }

        if (typeof event.target.value !== typeof this.input.value) {
            return;
        }

        this.input.setValue(event.target.value as any);
    }

    private defaultOnFocus(_event: FocusEvent<HTMLDivElement>) {
        this.input.setIsFocused(true);
    }

    private defaultOnBlur(_event: FocusEvent<HTMLInputElement>) {
        this.input.setIsFocused(false);
        this.input.setHasBeenBlurred(true);
    }

    readonly textAreaProps = this.inputProps as any;

    private _result?: Result<T>;

    get result(): Result<T> {
        if (this._result == null) {
            this._result = this.computeResult();
        }
        return this._result;
    }

    private computeResult(): Result<T> {
        const {
            preprocess,
            isBlank,
            blankResult,
            parse,
            input,
            validate,
        } = this;

        const input_ = preprocess(input.value);
        if (isBlank(input_)) {
            return blankResult;
        }
        return parse(input_).chain(validate);
    }

    get isValid(): boolean {
        return this.is(Valid);
    }

    /** Checks whether this field is a valid field with the given value,
     * using `Immutable.is` for the equality check.
     *
     * Example
     * ```
     * const form = useForm($Form({
     *     builtin: {
     *         maritalStatus: $Select('Marital status').with({
     *             options: ['Single', 'Married', ...]
     *         }),
     *         ...
     *     },
     *     ...
     * }));
     * const { maritalStatus } = form.builtin;
     * maritalStatus.is('Married')
     * ```
     * */
    is(value: T): boolean;

    /** Checks whether this field is a valid field whose value satisfies
     * the given predicate.
     *
     * Example:
     * ```
     * const { income } = form.builtin;
     * const over9000 = x => x > 9000;
     * income.is(over900)
     * ``` */
    is(predicate: Predicate<T>): boolean;

    /** Checks whether this field is an instance of the given result type.
     *
     * Examples:
     * ```
     * field.is(Valid)
     * field.is(Invalid)
     * ``` */
    is(type: ResultType): boolean;

    is(arg: T | Predicate<T> | ResultType): boolean {
        return this.result.is(arg as any);
    }

    static getValueAssumingItIsValid<T>(field: Field<any, T>): T {
        return field.result.unwrap(
            `Couldn't get the value of the ${field[
                describe
            ]()} because it's invalid`
        );
    }

    [describe](): string {
        const { label, name } = this;
        const tilde = '`';

        if (
            label == null ||
            isReactElement(label) ||
            removeExcessWhitespace(label) === ''
        ) {
            return `field at ${quote(name, tilde)}`;
        }

        return `field ${quote(label)} (${quote(name, tilde)})`;
    }

    optionInputProps(option: EnumOption): InputProps {
        return {
            ...this.defaultOptionInputProps(option),
            ...this.defaults.optionInputProps?.call?.(this, option),
            ...this.config.optionInputProps?.call?.(this, option),
        };
    }

    readonly options = this.input.options.map((option) => {
        const inputProps = this.optionInputProps(option);

        const labelProps: LabelProps = {
            htmlFor: inputProps.id,
        };

        return new OptionWithProps(option, inputProps, labelProps);
    });

    private defaultOptionInputProps(option: EnumOption): InputProps {
        return {
            ...this.inputProps,
            id: `${this.name}_${option.value}`,
            checked: (this.input.value as any) === option.value,
            value: option.value,
        };
    }

    get shouldBeShown(): boolean {
        return this.showRule(this.form.fields);
    }

    render(): ReactElement | null {
        if (!this.shouldBeShown) {
            return null;
        }

        const { Field } = this.theme;
        return <Field field={this} />;
    }

    focus(options?: FocusOptions): void {
        const element = this.inputRef.current ?? this.textAreaRef.current;

        if (element == null) {
            console.error(
                `I tried to focus the ${this[
                    describe
                ]()} but it doesn't have an inputRef or textAreaRef`
            );
            return;
        }

        element.focus(options);
    }

    get isFocused(): boolean {
        return this.getIsFocused();
    }

    fillWith(data: any): void {
        const input = this.acceptExternal(data);

        if (input !== undefined) {
            this.input.setValue(input);
        }
    }

    private acceptExternal(data: any): S | undefined {
        if (data === undefined) {
            return undefined;
        }

        if (data === null) {
            return this.defaults.blankInput;
        }

        const input = this.methods.acceptExternal?.(data);

        if (input !== undefined) {
            return input;
        }

        if (data.constructor === (this.input.value as any).constructor) {
            return data;
        }
    }

    reset(): void {
        this.input.setValue(this.input.initialValue);
        this.input.setHasBeenBlurred(false);
        _.forEach(this.subFields, (subField) => {
            subField.reset();
        });
    }
}

export function scrollToField<S, T>(field: Field<S, T>): boolean {
    if (field.containerRef.current == null) {
        scrollToTop();
        console.error(
            `I tried to scroll to the ${field[describe]()}, ` +
                `but it doesn't have a containerRef to scroll to`
        );
        return false;
    }

    field.containerRef.current.scrollIntoView({
        behavior: 'smooth',
    });
    return true;
}
