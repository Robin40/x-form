import { CustomField } from './CustomField';
import React from 'react';
import { text } from './text';

export const $TextArea = CustomField.extends(text).with({
    preprocess: undefined,

    render: {
        Input({ field }) {
            return (
                <textarea {...field.textAreaProps} ref={field.textAreaRef} />
            );
        },
    },
});
