import { text } from './text';
import { CustomField } from '../core/CustomField';

export const password = CustomField.extends(text).with({
    label: 'Password',
    inputProps: { type: 'password' },
    preprocess: undefined, // don't trim passwords
});
