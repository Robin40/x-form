import { $Text } from './$Text';
import { CustomField } from './CustomField';

export const $Password = CustomField.extends($Text).with({
    label: 'Password',
    inputProps: { type: 'password' },
    preprocess: undefined, // don't trim passwords
});
