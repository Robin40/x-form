import React, { PropsWithChildren, ReactElement } from 'react';
import { Invalid } from './Result';
import { Field } from './Field';
import classNames from 'classnames';
import _ from 'lodash';

export interface Theme {
    readonly Field: ThemeComponent;
    readonly FieldContainer: ThemeComponentWithChildren;
    readonly Label: ThemeComponent;
    readonly Optional: ThemeComponent;
    readonly Input: ThemeComponent;
    readonly Message: ThemeComponent;
    readonly Error: ThemeComponentWithChildren;
}

type ThemeComponent = <S, T>(props: ThemeProps<S, T>) => ReactElement | null;

type ThemeComponentWithChildren = <S, T>(
    props: PropsWithChildren<ThemeProps<S, T>>
) => ReactElement | null;

type ThemeProps<S, T> = {
    field: Field<S, T>;
    className?: string;
};

export const defaultTheme: Theme = {
    Field({ field, className }) {
        const { FieldContainer, Label, Input, Message } = field.theme;
        return (
            <FieldContainer field={field} className={className}>
                <Label field={field} />
                <Input field={field} />
                <Message field={field} />
            </FieldContainer>
        );
    },

    FieldContainer({ field, className, children }) {
        return (
            <div
                className={className}
                style={{ marginBottom: '1em' }}
                ref={field.containerRef}
            >
                {children}
            </div>
        );
    },

    Label({ field, className }) {
        const { label, inputProps, theme } = field;
        const { Optional } = theme;

        if (label != null) {
            return (
                <label htmlFor={inputProps.id} className={className}>
                    {label}
                    <Optional field={field} />
                </label>
            );
        }

        return null;
    },

    Optional({ field, className }) {
        if (field.isOptional) {
            return (
                <em className={className} style={{ color: '#585858' }}>
                    {' '}
                    ({field.locale.optional})
                </em>
            );
        }

        return null;
    },

    Input({ field, className }) {
        return (
            <input
                {...field.inputProps}
                className={classNames(field.inputProps.className, className)}
                ref={field.inputRef}
            />
        );
    },

    Message({ field, className }) {
        const { result, input, form, theme } = field;
        const { Error } = theme;

        if (
            result instanceof Invalid &&
            (input.hasBeenBlurred || form.hasBeenSubmitted)
        ) {
            return (
                <Error field={field} className={className}>
                    {result.message}
                </Error>
            );
        }

        return null;
    },

    Error({ className, children }) {
        return (
            <small
                className={className}
                style={{ color: '#b60000', fontWeight: 600 }}
            >
                {children}
            </small>
        );
    },
};

export function injectClassNames(
    theme: Theme,
    injectedClassNames: Partial<Record<keyof Theme, string>>
): Theme {
    return _.mapValues(theme, (OriginalComponent: any, componentName) => {
        return function ComponentWithInjectedClassName<S, T>(
            props: PropsWithChildren<ThemeProps<S, T>>
        ) {
            return (
                <OriginalComponent
                    field={props.field}
                    className={classNames(
                        injectedClassNames[componentName],
                        props.className
                    )}
                >
                    {props.children}
                </OriginalComponent>
            );
        };
    });
}
