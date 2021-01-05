import { CustomField } from './CustomField';
import { removeExcessWhitespace } from '../utils/utils';
import { Result, Valid } from '../Result';
import { Field } from './Field';
import { $Decimal, inferAllowedDecimalsFrom, parseDecimal } from './$Decimal';
import { Decimal } from 'decimal.js';
import _ from 'lodash';

export const $Number = CustomField<string, number>({
    category: 'numeric',
    preprocess: removeExcessWhitespace,
    blankInput: '',

    parse(this: Field<string, number>, input: string): Result<number> {
        const allowedDecimals = inferAllowedDecimalsFrom(this.inputProps) ?? 0;

        /* By default don't allow negative numbers as
         * probably you don't want those in your forms */
        const defaultMin = this.allowNegative ? -Infinity : 0;
        const min = new Decimal(this.inputProps.min ?? defaultMin);
        const max = new Decimal(this.inputProps.max ?? Infinity);

        /* Why write a parser again for the native numbers when
         * the Decimal parser works well? Let's reuse that wonder
         * and just convert to a native number at the end. */
        return parseDecimal(
            input,
            allowedDecimals,
            min,
            max,
            this.nonZero,
            this.allowNegative,
            this.locale
        ).map((decimal) => decimal.toNumber());
    },

    validate: Valid,

    acceptExternal(data) {
        if (_.isNumber(data)) {
            return data.toString();
        }
    },

    inputProps: $Decimal.defaults.inputProps,
});
