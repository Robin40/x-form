import { CustomField } from '../core/CustomField';
import React from 'react';
import { text } from './text';

export const textarea = CustomField.extends(text).with({
    preprocess: undefined,

    render: {
        Input({ field }) {
            return (
                <textarea {...field.textAreaProps} ref={field.textAreaRef} />
            );
        },
    },
});
