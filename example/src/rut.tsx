import {
    text,
    CustomField,
    Invalid,
    removeExcessWhitespace,
    Result,
    Valid,
} from '@tdc-cl/x-form';

export const rut = CustomField.extends(text).with({
    label: 'RUT',

    preprocess(input) {
        return removeExcessWhitespace(input).toUpperCase();
    },

    parse(input) {
        return parseRut(input).map(() => input);
    },

    validate(value) {
        return parseRut(value).chain(({ digits, dv }) => {
            if (computeDV(digits) !== dv) {
                return Invalid('Dígito verificador incorrecto');
            }

            return Valid(value);
        });
    },
});

interface Rut {
    digits: string[]; // ['1', '8', ...]
    dv: string; // '0' | '1' | ... | 'K'
}

function parseRut(s: string): Result<Rut> {
    const match = withDots.exec(s) ?? withoutDots.exec(s);

    if (!match) {
        return Invalid('Rut inválido');
    }

    let digits = match.slice(1);
    const dv = digits.pop()!;

    return Valid({ digits, dv });
}

const withDots = /^(\d?)(\d)\.(\d)(\d)(\d).(\d)(\d)(\d)-([0-9K])$/;
const withoutDots = /^(\d?)(\d)(\d)(\d)(\d)(\d)(\d)(\d)-?([0-9K])$/;

function computeDV(digits: string[]): string {
    let factors = Array<number>();
    while (factors.length < digits.length) {
        factors.push(2, 3, 4, 5, 6, 7);
    }

    let sum = 0;
    digits.reverse().forEach((digit, i) => {
        sum += Number(digit) * factors[i];
    });

    const dv = 11 - (sum % 11);
    switch (dv) {
        case 11:
            return '0';
        case 10:
            return 'K';
        default:
            return dv.toString();
    }
}
