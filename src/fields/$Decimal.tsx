import { CustomField } from './CustomField';
import { Decimal } from 'decimal.js';
import { Invalid, Result, Valid } from '../Result';
import { Field } from './Field';
import { InputProps } from '../utils/htmlProps';
import { removeExcessWhitespace } from '../utils/utils';
import _ from 'lodash';
import { XFormLocale } from '../XFormLocale';

export const $Decimal = CustomField<string, Decimal>({
    category: 'numeric',
    preprocess: removeExcessWhitespace,
    blankInput: '',

    parse(this: Field<string, Decimal>, input: string): Result<Decimal> {
        const allowedDecimals =
            inferAllowedDecimalsFrom(this.inputProps) ?? Infinity;

        /* By default don't allow negative numbers as
         * probably you don't want those in your forms */
        const min = new Decimal(this.inputProps.min ?? 0);
        const max = new Decimal(this.inputProps.max ?? Infinity);

        return parseDecimal(input, allowedDecimals, min, max, this.locale);
    },

    validate: Valid,

    acceptExternal(data) {
        if (data instanceof Decimal || _.isNumber(data)) {
            return data.toString();
        }
    },

    inputProps: {
        min: 0,
        style: { display: 'block' },
    },
});

/** Function that infers how many decimals are allowed
 * in a numeric field from the inputProps.
 *
 * For example, a step of 0.01 will result in 2 decimals allowed.
 *
 * It returns undefined if the number of allowed decimals cannot be inferred. */
export function inferAllowedDecimalsFrom(
    inputProps: InputProps
): number | undefined {
    const step = Number(inputProps.step);
    if ((1 / step) % 10 === 0) {
        /* is step something like 0.00001? */
        return -Math.log10(step); // count those zeros
    }
}

export function parseDecimal(
    input: string,
    allowedDecimals: number,
    min: Decimal,
    max: Decimal,
    locale: XFormLocale
): Result<Decimal> {
    /* Is this even a number to start with?
     *
     * There is a lot of computing to do afterwards, so don't dedicate
     * too much CPU to those people that fill forms with random letters */
    if (!floatRegex.test(input)) {
        return Invalid(locale.invalidNumber);
    }

    /* An special message for those QA people that fill integer
     * fields like "Number of children" with decimal numbers */
    if (!allowedDecimals && !integerRegex.test(input)) {
        return Invalid(locale.mustBeInt);
    }

    /* Enough with the regex stuff, give me the Decimal */
    let value: Decimal;
    try {
        value = new Decimal(input);
    } catch (_pokemonException) {
        /* Decimal.js throws a generic Error if
         * the input is invalid so catch 'em all */
        return Invalid(locale.invalidNumber);
    }

    /* Please no negative zeros in my yard */
    if (value.isNegative() && value.isZero()) {
        // If the user said '-0', just pretend to have listened '0'
        value = new Decimal(0);
    }

    /* Another special message, this time for those whose
     * income is pi dollars with a million decimal places */
    if (value.decimalPlaces() > allowedDecimals) {
        return Invalid(locale.tooManyDecimals(allowedDecimals));
    }

    if (value.lessThan(min)) {
        return value.isNegative()
            ? Invalid(locale.negative)
            : Invalid(locale.tooSmall(min));
    }

    if (value.greaterThan(max)) {
        return Invalid(locale.tooBig(max));
    }

    return Valid(value);
}

/* For integers, an optional sign followed by at least one digit */
const integerRegex = /^[-+]?\d+$/;

/* If decimals are allowed, the number format is as follows:
 * 1. an optional sign
 * 2. at least one digit for the integer part
 * 3. an optional decimal part (a dot followed by at least one digit)
 * 4. an optional exponential part
 *     (an E followed by an optional sign and some digits)
 *
 * Things like '.25' without the integer part are not valid here */
const floatRegex = /^[-+]?\d+(\.\d+)?([Ee][-+]?\d+)?$/;
