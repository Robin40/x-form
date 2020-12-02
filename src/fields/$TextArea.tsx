import { CustomField } from './CustomField';
import React from 'react';
import { $Text } from './$Text';

export const $TextArea = CustomField.extends($Text).with({
    preprocess: undefined,

    render: {
        Input({ field }) {
            return (
                <textarea {...field.textAreaProps} ref={field.textAreaRef} />
            );
        },
    },
});
