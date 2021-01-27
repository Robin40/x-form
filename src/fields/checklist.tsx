import React from 'react';
import { CustomField } from './CustomField';
import { Set } from 'immutable';
import { Valid } from '../Result';
import { Field } from './Field';
import _ from 'lodash';
import { acceptBoolean } from './checkbox';

type S = Set<string>;
type T = Set<string>;

export const checklist = CustomField<S, T>({
    category: 'enum',
    blankInput: Set(),
    parse: Valid,
    validate: Valid,
    acceptExternal: acceptSetOfString,

    optionInputProps(this: Field<S, T>, option) {
        const { input } = this;

        return {
            type: 'checkbox',

            checked: input.value.has(option.value),

            onChange(event) {
                input.setValue(toggle(event.target.value));
            },
        };
    },

    render: {
        Input({ field }) {
            return (
                <React.Fragment>
                    {field.options.map(
                        ({ value, labelProps, label, inputProps }) => (
                            <div key={value}>
                                <input {...inputProps} />
                                <label {...labelProps}>{label}</label>
                            </div>
                        )
                    )}
                </React.Fragment>
            );
        },
    },
});

function acceptSetOfString(data: unknown): Set<string> | undefined {
    /* Is it an array of some other iterable? */
    if (Symbol.iterator in Object(data)) {
        /* Collect all the strings in that iterable */
        const ans = [];
        for (const element of data as any) {
            if (_.isString(element)) {
                ans.push(element);
            }
        }
        return Set(ans);
    }

    /* Is it something like { foo: true, bar: false }? */
    if (_.isPlainObject(data)) {
        return Set(
            Object.keys(data as any).filter(
                (key) => acceptBoolean((data as any)[key]) === true
            )
        );
    }
}

function toggle<T>(element: T) {
    return (set: Set<T>) =>
        set.has(element) ? set.remove(element) : set.add(element);
}
