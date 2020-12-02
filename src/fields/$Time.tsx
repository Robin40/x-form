import { CustomField } from './CustomField';
import { DateTimeParseException, LocalTime } from 'js-joda';
import { Invalid, Result, Valid } from '../Result';
import { Field } from './Field';

export const $Time = CustomField<string, LocalTime>({
    blankInput: '',

    parse(this: Field<string, LocalTime>, input: string): Result<LocalTime> {
        try {
            return Valid(LocalTime.parse(input));
        } catch (err) {
            if (err instanceof DateTimeParseException) {
                return Invalid(this.locale.invalidTime);
            }
            throw err;
        }
    },

    validate: Valid,

    acceptExternal(data) {
        if (data instanceof LocalTime) {
            return data.toString();
        }
    },

    inputProps: {
        type: 'time',
        style: { display: 'block' },
    },
});
