import { FieldConfig, FieldDefaults, FieldSpec } from './FieldSpec';
import React, { ChangeEvent, ReactElement } from 'react';
import { isReactElement } from '../utils/utils';
import { InferS, InferT, PartialDeep } from '../utils/types';
import deepExtend from 'deep-extend';
import _ from 'lodash';
import { Field } from './Field';
import { UnwrapError, Valid } from './Result';

export interface ICustomField {
    <S, T>(defaults: FieldDefaults<S, T>): I$CustomField<S, T>;

    extends<S, T>(base: {
        defaults: FieldDefaults<S, T>;
    }): {
        with(extension: PartialDeep<FieldDefaults<S, T>>): I$CustomField<S, T>;
    };

    composite<F extends Record<string, FieldSpec<any, any>>>(
        subFields: F
    ): {
        with(
            extension: PartialDeep<FieldDefaults<InferS<F>, InferT<F>>>
        ): I$CustomField<InferS<F>, InferT<F>>;
    };
}

export interface I$CustomField<S, T> {
    (config: FieldConfig<S, T>): FieldSpec<S, T>;

    (label: string): FieldSpec<S, T>;

    (label: ReactElement): FieldSpec<S, T>;

    (label?: null | undefined): FieldSpec<S, T>;

    defaults: FieldDefaults<S, T>;
}

function makeCustomField(): ICustomField {
    function CustomField<S, T>(
        defaults: FieldDefaults<S, T>
    ): I$CustomField<S, T> {
        function $CustomField(config: FieldConfig<S, T>): FieldSpec<S, T>;
        function $CustomField(label: string): FieldSpec<S, T>;
        function $CustomField(label: ReactElement): FieldSpec<S, T>;
        function $CustomField(label?: null): FieldSpec<S, T>;

        function $CustomField(
            arg?: FieldConfig<S, T> | string | ReactElement | null
        ): FieldSpec<S, T> {
            // $CustomField()
            if (arg == null) {
                return $CustomField({});
            }

            // $CustomField(label: string)
            if (typeof arg === 'string') {
                return $CustomField({ label: arg });
            }

            // $CustomField(label: ReactElement)
            if (isReactElement(arg)) {
                return $CustomField({ label: arg });
            }

            // $CustomField(config)
            return new FieldSpec(arg, defaults);
        }

        $CustomField.defaults = defaults;

        return $CustomField;
    }

    /** Lets you define a custom field based on an existing field.
     *
     * For example, an email field can be defined as follows:
     * ```
     * export const email = CustomField.extends(text).with({
     *     validate(value) {
     *         if (!value.includes('@')) {
     *             return Invalid('Invalid email');
     *         }
     *         return Valid(value);
     *     },
     * });
     * ```
     *
     * You can also extend custom builtin, the
     * base doesn't need to be a built-in field.
     * ``` */
    // eslint-disable-next-line dot-notation
    CustomField.extends = <S, T>(base: { defaults: FieldDefaults<S, T> }) => ({
        with(extension: PartialDeep<FieldDefaults<S, T>>) {
            return CustomField(deepExtend({}, base.defaults, extension));
        },
    });

    CustomField.composite = <F extends Record<string, FieldSpec<any, any>>>(
        subFields: F
    ) => ({
        with(extension: PartialDeep<FieldDefaults<InferS<F>, InferT<F>>>) {
            const defaults: FieldDefaults<InferS<F>, InferT<F>> = {
                subFields: _.mapValues(subFields, (subField, name) =>
                    subField.with({
                        inputProps: {
                            onChange<S, T>(
                                this: Field<S, T>,
                                event: ChangeEvent<HTMLInputElement>
                            ) {
                                const value = event.target.value;
                                this.superField!.input.setValue((prev: S) => ({
                                    ...prev,
                                    [name]: value,
                                }));
                            },

                            onBlur<S, T>(this: Field<S, T>) {
                                this.superField!.input.setHasBeenBlurred(true);
                            },
                        },
                    })
                ),

                blankInput: _.mapValues(
                    subFields,
                    'defaults.blankInput'
                ) as InferS<F>,

                isBlank(this: Field<InferS<F>, InferT<F>>, inputs) {
                    return _.some(
                        zipValues(inputs, this.subFields),
                        ([input, subField]) => subField.isBlank(input)
                    );
                },

                isFocused(this: Field<InferS<F>, InferT<F>>) {
                    return _.some(this.subFields, 'isFocused');
                },

                parse(this: Field<InferS<F>, InferT<F>>, inputs) {
                    try {
                        return Valid(
                            _.chain(zipValues(inputs, this.subFields))
                                .mapValues(([input, subField]) =>
                                    subField.parse(input).unwrap()
                                )
                                .value() as InferT<F>
                        );
                    } catch (err) {
                        if (err instanceof UnwrapError) return err.result;
                        throw err;
                    }
                },

                validate(this: Field<InferS<F>, InferT<F>>, values) {
                    try {
                        return Valid(
                            _.chain(zipValues(values, this.subFields))
                                .mapValues(([value, subField]) =>
                                    subField.validate(value).unwrap()
                                )
                                .value() as InferT<F>
                        );
                    } catch (err) {
                        if (err instanceof UnwrapError) return err.result;
                        throw err;
                    }
                },

                render: {
                    Input({ field }) {
                        return (
                            <React.Fragment>
                                {_.map(field.subFields, (subField, name) => (
                                    <React.Fragment key={name}>
                                        {subField.render()}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        );
                    },
                },
            };

            return CustomField<InferS<F>, InferT<F>>(
                _.merge(defaults, extension)
            );
        },
    });

    return CustomField;
}

export const CustomField = makeCustomField();

function zipValues(
    a: Record<string, any>,
    b: Record<string, any>
): Record<string, any> {
    const ans = {};
    Object.keys(a).forEach((key) => {
        ans[key] = [a[key], b[key]];
    });
    return ans;
}
