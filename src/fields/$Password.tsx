import { text } from './text';
import { CustomField } from './CustomField';

export const $Password = CustomField.extends(text).with({
    label: 'Password',
    inputProps: { type: 'password' },
    preprocess: undefined, // don't trim passwords
});
