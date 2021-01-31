import { FieldSpec, FieldConfig, FieldDefaults } from './FieldSpec';
import { ReactElement } from 'react';
import { isReactElement } from '../utils/utils';
import { PartialDeep } from '../utils/PartialDeep';
import deepExtend from 'deep-extend';

export interface ICustomField {
    <S, T>(defaults: FieldDefaults<S, T>): I$CustomField<S, T>;

    extends<S, T>(base: {
        defaults: FieldDefaults<S, T>;
    }): {
        with(extension: PartialDeep<FieldDefaults<S, T>>): I$CustomField<S, T>;
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
     * For example, an $Email field can be defined as follows:
     * ```
     * export const $Email = CustomField.extends($Text).with({
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

    return CustomField;
}

export const CustomField = makeCustomField();
