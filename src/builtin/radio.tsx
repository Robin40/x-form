import React from 'react';
import { CustomField } from '../core/CustomField';
import { Valid } from '../core/Result';
import { Option } from '../core/EnumOption';
import { select, acceptOption } from './select';

export const radio = CustomField<string, Option>({
    blankInput: '',
    parse: select.defaults.parse,
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
