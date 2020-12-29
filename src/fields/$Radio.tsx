import React from 'react';
import { CustomField } from './CustomField';
import { Valid } from '../Result';
import { Option } from './EnumOption';
import { $Select, acceptOption } from './$Select';

export const $Radio = CustomField<string, Option>({
    category: 'enum',
    blankInput: '',
    parse: $Select.defaults.parse,
    validate: Valid,
    acceptExternal: acceptOption,

    inputProps: {
        type: 'radio',
    },

    render: {
        Input({ field }) {
            const { options } = field;
            return (
                <div>
                    {options.map((option) => (
                        <div key={option.value}>
                            <input {...option.inputProps} />
                            <label {...option.labelProps}>{option.label}</label>
                        </div>
                    ))}
                </div>
            );
        },
    },
});
