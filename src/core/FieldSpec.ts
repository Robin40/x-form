import _ from 'lodash';
import { ReactElement, useContext, useMemo, useRef } from 'react';
import { InputProps } from '../utils/htmlProps';
import { Field } from './Field';
import { useInputState } from './useInputState';
import { Result } from './Result';
import { defaultTheme, Theme } from './Theme';
import { EnumOption } from './EnumOption';
import { XFormContext } from './XFormContext';
import { FormFields } from './Form';

export interface FieldConfig<S, T> {
    readonly label?: string | ReactElement;
    readonly inputProps?: InputProps;
    readonly options?: Options;

    /** For numeric builtin, `true` means zero
     * is not a valid value for this field. */
    readonly nonZero?: boolean;

    /** For numeric builtin, `true` if negative numbers are valid
     * for this field. By default negative numbers are not valid. */
    readonly allowNegative?: boolean;

    optionInputProps?(option: EnumOption): InputProps;

    preprocess?(input: S): S;

    /** Pass a string to change the '--- Select an option ---' label of a select,
     * or pass either null or false to remove that option.
     *
     * By default locale.selectAnOption is used. */
    readonly blankOption?: string | null | false;

    readonly blankResult?: Result<T>;

    readonly render?: Partial<Theme>;

    readonly initialInput?: S;

    /** @internal
     * The rule passed to `showIf` */
    showRule?(fields: FormFields): boolean;
}

export type FieldOption = EnumOption | string;
export type Options = FieldOption[] | AsyncOptions;
export type AsyncOptions = () => Promise<FieldOption[]>;

interface IFieldSpec<S, T> {
    readonly config: FieldConfig<S, T>;
    readonly defaults: FieldDefaults<S, T>;

    with(config: FieldConfig<S, T>): FieldSpec<S, T>;

    /** Makes this field read-only.
     *
     * This is preferred to setting `readOnly` on `inputProps` as this method
     * sets additional props that you will probably want as well (e.g. `disabled`).
     *
     * @see IFieldSpec.readOnlyIf */
    readOnly(): FieldSpec<S, T>;

    /** Make this field editable (i.e. not read-only).
     *
     * Fields are editable by default, but this method may be
     * used to undo a `.readOnly()` or `.readOnlyIf()` modifier.
     *
     * @see IFieldSpec.readOnly */
    editable(): FieldSpec<S, T>;

    /** Makes this field read-only if the `condition` is true.
     * If the `condition` is false, the field
     * becomes editable if it was read-only.
     *
     * @see IFieldSpec.readOnly */
    readOnlyIf(condition: boolean): FieldSpec<S, T>;

    showIf(rule: (fields: FormFields) => boolean): FieldSpec<S, T>;
}

export type FieldCategory = 'textual' | 'numeric' | 'enum' | 'binary';

export interface FieldDefaults<S, T> extends FieldConfig<S, T> {
    category?: FieldCategory;

    blankInput: S;

    isBlank?(input: S): boolean;

    parse(input: S): Result<T>;

    validate(value: T): Result<T>;

    acceptExternal?(data: unknown): S | undefined;

    /** @internal */
    subFields?: Record<string, FieldSpec<any, any>>;
}

export class FieldSpec<S, T> implements IFieldSpec<S, T> {
    constructor(
        readonly config: FieldConfig<S, T>,
        readonly defaults: FieldDefaults<S, T>
    ) {}

    with(config: FieldConfig<S, T>): FieldSpec<S, T> {
        return new FieldSpec(_.merge({}, this.config, config), this.defaults);
    }

    readOnly(): FieldSpec<S, T> {
        return this.readOnlyIf(true);
    }

    editable(): FieldSpec<S, T> {
        return this.readOnlyIf(false);
    }

    readOnlyIf(condition: boolean): FieldSpec<S, T> {
        return this.with({
            inputProps: {
                readOnly: condition,
                disabled: condition,
                'aria-readonly': condition,
                'aria-disabled': condition,
            },
        });
    }

    showIf(rule: (fields: FormFields) => boolean): FieldSpec<S, T> {
        return this.with({
            showRule: rule,
        });
    }
}

export function useField<S, T>(
    field: FieldSpec<S, T>,
    name: string
): Field<S, T> {
    const { locale } = useContext(XFormContext);
    const optionsMethod = field.config.options ?? field.defaults.options ?? [];
    const input = useInputState(
        field.config.initialInput ??
            field.defaults.initialInput ??
            field.defaults.blankInput,
        optionsMethod
    );
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const textAreaRef = useRef(null);

    /* Memoize any inline components defined by the user to avoid bugs where the
     * input loses focus due to React rendering a different component each time. */
    const theme = useMemo(
        () =>
            _.merge(
                {},
                defaultTheme,
                field.defaults.render,
                field.config.render
            ),
        []
    );

    const subFields = _.mapValues(field.defaults.subFields ?? {}, useField);

    return new Field(
        locale,
        field.defaults,
        field.config,
        name,
        input,
        containerRef,
        inputRef,
        textAreaRef,
        theme,
        subFields
    );
}
