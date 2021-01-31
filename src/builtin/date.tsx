import { LocalDate, DateTimeParseException } from 'js-joda';
import { CustomField } from '../core/CustomField';
import { Invalid, Result, Valid } from '../core/Result';
import _ from 'lodash';
import { Field } from '../core/Field';

export const date = CustomField<string, LocalDate>({
    blankInput: '',

    parse(this: Field<string, LocalDate>, input: string): Result<LocalDate> {
        try {
            return Valid(LocalDate.parse(input));
        } catch (err) {
            if (err instanceof DateTimeParseException) {
                return Invalid(this.locale.invalidDate);
            }
            throw err;
        }
    },

    validate: Valid,
    acceptExternal: acceptDate,

    inputProps: {
        type: 'date',
        style: { display: 'block' },
    },
});

function acceptDate(data: unknown): string | undefined {
    if (data instanceof LocalDate) {
        return data.toString();
    }

    if (_.isString(data)) {
        data = new Date(data);
    }

    if (data instanceof Date) {
        const input = data.toISOString().substr(0, 'YYYY-MM-DD'.length);
        if (input !== 'Invalid Date') {
            return input;
        }
    }
}
