import { CustomField } from './CustomField';
import { removeExcessWhitespace } from '../utils/utils';
import { Valid } from '../Result';
import { Field } from './Field';

export const $Text = CustomField<string, string>({
    category: 'textual',

    preprocess(this: Field<string, string>, input: string): string {
        // Don't remove whitespace from passwords
        const type =
            this.config.inputProps?.type ?? this.defaults.inputProps?.type;
        if (type === 'password') {
            return input;
        }

        /* Leading/trailing whitespace or 2+ consecutive
         * spaces are in most cases accidentally typed */
        return removeExcessWhitespace(input);
    },

    blankInput: '',
    parse: Valid,
    validate: Valid,

    inputProps: {
        style: { display: 'block' },
    },
});
