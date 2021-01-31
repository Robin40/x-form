import { CustomField } from '../core/CustomField';
import { Valid } from '../core/Result';
import React from 'react';
import _ from 'lodash';

export const checkbox = CustomField<boolean, boolean>({
    category: 'binary',
    blankInput: false,
    isBlank: () => false,

    parse: Valid,
    validate: Valid,
    acceptExternal: acceptBoolean,

    inputProps: {
        type: 'checkbox',
    },

    render: {
        Field({ field }) {
            const { FieldContainer, Label, Input, Message } = field.theme;
            return (
                <FieldContainer field={field}>
                    <div>
                        <Input field={field} />
                        <Label field={field} />
                    </div>
                    <Message field={field} />
                </FieldContainer>
            );
        },
    },
});

export function acceptBoolean(data: unknown): boolean | undefined {
    if (_.isBoolean(data)) {
        return data;
    }

    if (data === 0 || data === 1) {
        return Boolean(data);
    }

    if (_.isString(data)) {
        if (/^true|t|1|yes|y$/i.test(data)) {
            return true;
        }

        if (/^false|f|0|no|n$/i.test(data)) {
            return false;
        }
    }
}
