import Decimal from 'decimal.js';

export interface XFormLocale {
    selectAnOption: string;
    optional: string;
    fieldIsRequired: string;
    invalidNumber: string;
    mustBeInt: string;
    tooManyDecimals(maxDecimals: number): string;
    negative: string;
    tooSmall(min: Decimal): string;
    tooBig(max: Decimal): string;
    cantBeZero: string;
    invalidDate: string;
    invalidTime: string;
    loading: string;
}

export const english: XFormLocale = {
    selectAnOption: '--- Select an option ---',
    optional: 'Optional',
    fieldIsRequired: 'Required field',
    invalidNumber: 'Invalid number',
    mustBeInt: 'Must be an integer number',
    tooManyDecimals: (maxDecimals) =>
        `No more than ${maxDecimals} decimals allowed`,
    negative: "Can't be a negative number",
    tooSmall: (min) => `Must be at least ${min}`,
    tooBig: (max) => `Must be at most ${max}`,
    cantBeZero: "Can't be zero",
    invalidDate: 'Invalid date',
    invalidTime: 'Invalid time',
    loading: 'Loading...',
};

export const spanish: XFormLocale = {
    selectAnOption: '--- Seleccione una opción ---',
    optional: 'Opcional',
    fieldIsRequired: 'Campo requerido',
    invalidNumber: 'Número inválido',
    mustBeInt: 'Debe ser un número entero',
    tooManyDecimals: (maxDecimals) =>
        `No se permite más de ${maxDecimals} decimales`,
    negative: 'No puede ser negativo',
    tooSmall: (min) => `Debe ser al menos ${min}`,
    tooBig: (max) => `Debe ser a lo más ${max}`,
    cantBeZero: 'No puede ser 0',
    invalidDate: 'Fecha inválida',
    invalidTime: 'Hora inválida',
    loading: 'Cargando...',
};
