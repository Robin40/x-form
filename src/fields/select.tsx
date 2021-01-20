import { CustomField } from './CustomField';
import React from 'react';
import { Option } from './EnumOption';
import { Result, Valid } from '../Result';
import { Field } from './Field';
import _ from 'lodash';

export const select = CustomField<string, Option>({
    category: 'enum',
    blankInput: '',

    parse(this: Field<string, Option>, input: string): Result<Option> {
        return Valid(this.input.options.find(_.matches({ value: input }))!);
    },

    validate: Valid,
    acceptExternal: acceptOption,

    inputProps: {
        style: { display: 'block' },
    },

    render: {
        Input({ field }) {
            return (
                <select {...(field.inputProps as any)}>
                    <option value=''>{field.locale.selectAnOption}</option>
                    {field.options.map(({ value, label }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </select>
            );
        },
    },
});

export function acceptOption(data: unknown): string | undefined {
    if (_.isString((data as any).value)) {
        return (data as any).value;
    }
}
