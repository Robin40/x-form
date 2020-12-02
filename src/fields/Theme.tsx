import React, { PropsWithChildren, ReactElement } from 'react';
import { Invalid } from '../Result';
import { Field } from './Field';

export interface Theme {
    readonly Field: ThemeComponent;
    readonly FieldContainer: ThemeComponentWithChildren;
    readonly Label: ThemeComponent;
    readonly Optional: ThemeComponent;
    readonly Input: ThemeComponent;
    readonly Message: ThemeComponent;
}

type ThemeComponent = <S, T>(props: ThemeProps<S, T>) => ReactElement | null;

type ThemeComponentWithChildren = <S, T>(
    props: PropsWithChildren<ThemeProps<S, T>>
) => ReactElement | null;

type ThemeProps<S, T> = { field: Field<S, T> };

export const defaultTheme: Theme = {
    Field({ field }) {
        const { FieldContainer, Label, Input, Message } = field.theme;
        return (
            <FieldContainer field={field}>
                <Label field={field} />
                <Input field={field} />
                <Message field={field} />
            </FieldContainer>
        );
    },

    FieldContainer({ field, children }) {
        return (
            <div style={{ marginBottom: '1em' }} ref={field.containerRef}>
                {children}
            </div>
        );
    },

    Label({ field }) {
        const { label, inputProps, theme } = field;
        const { Optional } = theme;

        if (label != null) {
            return (
                <label htmlFor={inputProps.id}>
                    {label}
                    <Optional field={field} />
                </label>
            );
        }

        return null;
    },

    Optional({ field }) {
        if (field.isOptional) {
            return (
                <em style={{ color: '#585858' }}> ({field.locale.optional})</em>
            );
        }

        return null;
    },

    Input({ field }) {
        return <input {...field.inputProps} ref={field.inputRef} />;
    },

    Message({ field }) {
        const { result, input, form } = field;

        if (
            result instanceof Invalid &&
            (input.hasBeenBlurred || form.hasBeenSubmitted)
        ) {
            return (
                <small style={{ color: '#b60000', fontWeight: 600 }}>
                    {result.message}
                </small>
            );
        }

        return null;
    },
};
