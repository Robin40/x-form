import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    FormHTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';

export type InputProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;
export type TextAreaProps = DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>;
export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;
export type FormProps = DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
>;
export type LabelProps = DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
>;
